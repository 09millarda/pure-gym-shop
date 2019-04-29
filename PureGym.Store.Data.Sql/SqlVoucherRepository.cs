using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PureGym.Store.Data.Sql
{
    internal class SqlVoucherRepository : SqlRepositoryBase, IVoucherRepository
    {
        public SqlVoucherRepository(DbStateContext context) : base(context) { }

        public async Task<GiftVoucher> Create(GiftVoucher giftVoucher)
        {
            var sqlVoucher = await Create(giftVoucher.Code, giftVoucher.Value, VoucherType.Gift);
            await Context.GiftVouchers.AddAsync(new Models.GiftVoucher
            {
                Voucher = sqlVoucher
            });
            await Context.SaveChangesAsync();

            return new GiftVoucher
            {
                Code = sqlVoucher.Code,
                Value = sqlVoucher.Value,
                VoucherId = sqlVoucher.VoucherId
            };
        }

        public async Task<OfferVoucher> Create(OfferVoucher offerVoucher)
        {
            var sqlVoucher = await Create(offerVoucher.Code, offerVoucher.Value, VoucherType.Offer);
            var sqlOfferVoucher = new Models.OfferVoucher
            {
                MinPriceToApply = offerVoucher.MinPriceToApply,
                Voucher = sqlVoucher
            };

            if (offerVoucher.SubsetGroup != null && !string.IsNullOrEmpty(offerVoucher.SubsetGroup.Name))
                sqlOfferVoucher.Subset = await Context.Subsets.SingleAsync(s => s.SubsetId == offerVoucher.SubsetGroup.SubsetId).ConfigureAwait(false);

            await Context.OfferVouchers.AddAsync(sqlOfferVoucher);
            await Context.SaveChangesAsync();

            offerVoucher.VoucherId = sqlVoucher.VoucherId;
            return offerVoucher;
        }

        public async Task DeleteById(int voucherId)
        {
            var voucher = await Context.Vouchers.SingleAsync(v => v.VoucherId == voucherId);
            
            switch (voucher.VoucherType)
            {
                case VoucherType.Gift:
                    var giftVoucher = await Context.GiftVouchers.SingleAsync(v => v.Voucher.VoucherId == voucher.VoucherId);
                    Context.Remove(giftVoucher);
                    break;
                case VoucherType.Offer:
                    var offerVoucher = await Context.OfferVouchers.SingleAsync(v => v.Voucher.VoucherId == voucher.VoucherId);
                    Context.Remove(offerVoucher);
                    break;
            }

            Context.Remove(voucher);
            await Context.SaveChangesAsync();
        }

        public async Task<Voucher> GetByCode(string voucherCode)
        {
            var voucher = await Context.Vouchers.SingleOrDefaultAsync(v => v.Code == voucherCode);
            if (voucher == null) return null;

            return new Voucher
            {
                Code = voucher.Code,
                Value = voucher.Value,
                VoucherId = voucher.VoucherId,
                VoucherType = voucher.VoucherType
            };
        }

        public async Task<Voucher> GetById(int voucherId)
        {
            var voucher = await Context.Vouchers.SingleOrDefaultAsync(v => v.VoucherId == voucherId);
            if (voucher == null) return null;

            return new Voucher
            {
                VoucherId = voucher.VoucherId,
                Code = voucher.Code,
                Value = voucher.Value,
                VoucherType = voucher.VoucherType
            };
        }

        public async Task<GiftVoucher> GetGiftVoucherByVoucherId(int voucherId)
        {
            var giftVoucher = await Context.GiftVouchers.Include(v => v.Voucher).SingleOrDefaultAsync(v => v.Voucher.VoucherId == voucherId);
            if (giftVoucher == null) return null;

            return new GiftVoucher
            {
                VoucherId = giftVoucher.VoucherId,
                Code = giftVoucher.Voucher.Code,
                Value = giftVoucher.Voucher.Value,
                VoucherType = VoucherType.Gift
            };
        }

        public async Task<IEnumerable<GiftVoucher>> GetGiftVouchers()
        {
            return (await Context.GiftVouchers.Include(v => v.Voucher).ToListAsync())
                .Select(v => new GiftVoucher
                {
                    Code = v.Voucher.Code,
                    Value = v.Voucher.Value,
                    VoucherId = v.VoucherId,
                    VoucherType = VoucherType.Gift
                });
        }

        public async Task<OfferVoucher> GetOfferVoucherByVoucherId(int voucherId)
        {
            var offerVoucher = await Context.OfferVouchers
                .Include(v => v.Voucher)
                .Include(v => v.Subset)
                .Include(v => v.Subset.SubsetItems).SingleOrDefaultAsync(v => v.Voucher.VoucherId == voucherId);
            if (offerVoucher == null) return null;

            return new OfferVoucher
            {
                VoucherId = offerVoucher.VoucherId,
                Code = offerVoucher.Voucher.Code,
                MinPriceToApply = offerVoucher.MinPriceToApply,
                Value = offerVoucher.Voucher.Value,
                VoucherType = VoucherType.Offer,
                SubsetGroup = new SubsetGroup
                {
                    Name = offerVoucher.Subset.Name,
                    SubsetId = offerVoucher.Subset.SubsetId,
                    Items = offerVoucher.Subset.SubsetItems.Select(i => new Item
                    {
                        ItemId = i.ItemId
                    }).ToList()
                }
            };

        }

        public async Task<IEnumerable<OfferVoucher>> GetOfferVouchers()
        {
            var offerVouchers = new List<OfferVoucher>();
            (await Context.OfferVouchers.Include(v => v.Voucher).ToListAsync())
                .ForEach(async v =>
                {
                    var voucher = new OfferVoucher
                    {
                        Code = v.Voucher.Code,
                        Value = v.Voucher.Value,
                        VoucherId = v.VoucherId,
                        VoucherType = VoucherType.Gift,
                        MinPriceToApply = v.MinPriceToApply
                    };

                    if (v.SubsetId != null)
                    {
                        var subset = await Context.Subsets
                            .Include(s => s.SubsetItems)
                            .SingleAsync(s => s.SubsetId == v.SubsetId);
                        voucher.SubsetGroup = new SubsetGroup
                        {
                            SubsetId = subset.SubsetId,
                            Name = subset.Name,
                            Items = subset.SubsetItems.Select(i => new Item
                            {
                                ItemId = i.ItemId
                            }).ToList()
                        };
                    }

                    offerVouchers.Add(voucher);
                });

            return offerVouchers;
        }

        private async Task<Models.Voucher> Create(string code, decimal value, VoucherType voucherType)
        {
            var sqlVoucher = new Models.Voucher
            {
                VoucherType = voucherType,
                Code = code,
                Value = value
            };
            await Context.Vouchers.AddAsync(sqlVoucher);
            return sqlVoucher;
        }
    }
}
