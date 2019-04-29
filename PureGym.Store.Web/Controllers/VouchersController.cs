using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PureGym.Store.Common.Exceptions;
using PureGym.Store.Data;
using PureGym.Store.Web.Helpers;
using PureGym.Store.Web.Models;

namespace PureGym.Store.Web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VouchersController : ControllerBase
    {
        private readonly IVoucherRepository _voucherRepository;
        private readonly IItemsRepository _itemsRepository;
        private readonly ISubsetRepository _subsetRepository;
        private readonly Random _random = new Random();

        public VouchersController(IVoucherRepository voucherRepository, ISubsetRepository subsetRepository, IItemsRepository itemsRepository)
        {
            _voucherRepository = voucherRepository;
            _subsetRepository = subsetRepository;
            _itemsRepository = itemsRepository;
        }

        [HttpPost("apply")]
        public async Task<IActionResult> ApplyVouchers([FromBody]ApplyVouchers body)
        {
            var fetchItemsTask = new List<Task<Item>>();
            body.ItemIdQuantities.ForEach(i => fetchItemsTask.Add(_itemsRepository.GetById(i.ItemId)));

            var items = await Task.WhenAll(fetchItemsTask).ConfigureAwait(false);
            if (items.Length != body.ItemIdQuantities.Count) return BadRequest("This basket contains invalid items");

            var vouchers = new List<Voucher>();
            foreach (var code in body.Codes)
            {
                var voucher = await _voucherRepository.GetByCode(code).ConfigureAwait(false);
                if (voucher == null) return BadRequest($"Voucher Code '{code}' is not valid");
                vouchers.Add(voucher);
            }

            var applicationResponse = await FormatVouchers(vouchers, ApplyQuantities(items, body.ItemIdQuantities)).ConfigureAwait(false);
            if (applicationResponse.Item2 != null) return BadRequest(applicationResponse.Item2);

            return Ok(applicationResponse.Item1);
        }

        [HttpPost("gift")]
        public async Task<IActionResult> CreateGift([FromBody]GiftVoucherPostBody vouchers)
        {
            var giftVouchers = new List<GiftVoucher>();
            foreach (var voucher in vouchers.GiftVouchers)
            {
                voucher.Code = GenerateVoucherCode();
                giftVouchers.Add(await _voucherRepository.Create(voucher).ConfigureAwait(false));
            }

            return Ok(string.Join(", ", giftVouchers.Select(g => $"£{g.Value} Voucher (Code: {g.Code})")));
        }

        [HttpPost("offer")]
        public async Task<IActionResult> CreateOffer([FromBody]OfferVoucher voucher)
        {
            if (await _voucherRepository.GetByCode(voucher.Code).ConfigureAwait(false) != null)
                return BadRequest($"Voucher with code '{voucher.Code}' already exists");

            if (voucher.SubsetGroup != null && !string.IsNullOrEmpty(voucher.SubsetGroup.Name))
            {
                var subsetGroup = await _subsetRepository.GetByName(voucher.SubsetGroup.Name).ConfigureAwait(false);
                if (subsetGroup == null)
                    return BadRequest($"Subset with name '{voucher.SubsetGroup.Name}' does not exist");

                voucher.SubsetGroup.SubsetId = subsetGroup.SubsetId;
            }

            var offerVoucher = await _voucherRepository.Create(voucher).ConfigureAwait(false);
            var locatedAtUri = HttpContext.Request.CreateCreatedUri($"api/vouchers/{offerVoucher.VoucherId}");

            return Created(locatedAtUri, offerVoucher);
        }

        [HttpGet("byCode/{code}")]
        public async Task<IActionResult> GetByCode(string code)
        {
            var voucher = await _voucherRepository.GetByCode(code).ConfigureAwait(false);
            if (voucher == null) return NotFound();

            switch (voucher.VoucherType)
            {
                case VoucherType.Gift:
                    return await FetchGiftVoucher(voucher.VoucherId).ConfigureAwait(false);
                case VoucherType.Offer:
                    return await FetchOfferVoucher(voucher.VoucherId).ConfigureAwait(false);
                default:
                    return StatusCode(500);
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var response = new
            {
                OfferVouchers = await _voucherRepository.GetOfferVouchers().ConfigureAwait(false),
                GiftVouchers = await _voucherRepository.GetGiftVouchers().ConfigureAwait(false)
            };

            return Ok(response);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var voucher = await _voucherRepository.GetById(id).ConfigureAwait(false);
            if (voucher == null) return NotFound($"No Voucher with Id '{id}' exists");

            await _voucherRepository.DeleteById(id).ConfigureAwait(false);
            return Ok();
        }

        private async Task<IActionResult> FetchOfferVoucher(int voucherId)
        {
            var offerVoucher = await _voucherRepository.GetOfferVoucherByVoucherId(voucherId);
            if (offerVoucher == null) return NotFound();

            return Ok(offerVoucher);
        }

        private string GenerateVoucherCode()
        {
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            return new string(Enumerable.Repeat(chars, 10)
              .Select(s => s[_random.Next(s.Length)]).ToArray());
        }

        private IEnumerable<Item> ApplyQuantities(IEnumerable<Item> items, IEnumerable<ItemIdQuantity> quantities)
        {
            var _items = new List<Item>();

            foreach (var item in items)
            {
                var quantity = quantities.Single(q => q.ItemId == item.ItemId).Quantity;
                for (int i = 0; i < quantity; i++)
                    _items.Add(item);
            }

            return _items;
        }

        public static (IEnumerable<VoucherApplicationResponse>, string) ApplyVouchersItems(OfferVoucher offerVoucher, IEnumerable<GiftVoucher> giftVouchers, IEnumerable<Item> items)
        {
            var response = new List<VoucherApplicationResponse>();
            var basketPrice = items.Sum(i => i.Price);

            if (offerVoucher != null)
            {
                decimal discount = 0;
                try
                {
                    discount = offerVoucher.ApplyVoucher(basketPrice, items);
                }
                catch (VoucherCannotBeAppliedException ex)
                {
                    return (null, ex.Message);
                }

                basketPrice -= discount;
                response.Add(new VoucherApplicationResponse
                {
                    Code = offerVoucher.Code,
                    Description = $"Applied offer voucher with code '{offerVoucher.Code}'",
                    Discount = discount
                });
            }

            foreach (var giftVoucher in giftVouchers)
            {
                var discount = giftVoucher.ApplyVoucher(basketPrice, items);
                basketPrice -= discount;
                response.Add(new VoucherApplicationResponse
                {
                    Code = giftVoucher.Code,
                    Description = $"Applied gift voucher with code '{giftVoucher.Code}'",
                    Discount = discount
                });
            }

            return (response, null);
        }

        private async Task<(IEnumerable<VoucherApplicationResponse>, string)> FormatVouchers(IEnumerable<Voucher> vouchers, IEnumerable<Item> items)
        {
            var giftVouchers = new List<GiftVoucher>();
            OfferVoucher offerVoucher = null;

            foreach (var voucher in vouchers)
            {
                switch (voucher.VoucherType)
                {
                    case VoucherType.Offer:
                        if (offerVoucher != null) return (null, "Can only apply one offer voucher");
                        offerVoucher = await _voucherRepository.GetOfferVoucherByVoucherId(voucher.VoucherId).ConfigureAwait(false);
                        break;
                    case VoucherType.Gift:
                        giftVouchers.Add(await _voucherRepository.GetGiftVoucherByVoucherId(voucher.VoucherId).ConfigureAwait(false));
                        break;
                }
            }

            return ApplyVouchersItems(offerVoucher, giftVouchers, items);
        }

        private async Task<IActionResult> FetchGiftVoucher(int voucherId)
        {
            var giftVoucher = await _voucherRepository.GetGiftVoucherByVoucherId(voucherId);
            if (giftVoucher == null) return NotFound();

            return Ok(giftVoucher);
        }
    }
}