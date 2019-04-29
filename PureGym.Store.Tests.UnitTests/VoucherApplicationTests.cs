using FluentAssertions;
using PureGym.Store.Data;
using PureGym.Store.Web.Controllers;
using PureGym.Store.Web.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using Xunit;

namespace PureGym.Store.Tests.UnitTests
{
    public class VoucherApplicationTests
    {
        private Item GetCapItem() => new Item
        {
            ItemId = 1,
            Name = "Cap",
            Description = "A cap",
            ImageUri = "",
            ItemType = ItemType.Listing,
            Price = 9.99m
        };

        private Item GetBeanieItem() => new Item
        {
            ItemId = 2,
            Name = "Beanie",
            Description = "A beanie",
            ImageUri = "",
            ItemType = ItemType.Listing,
            Price = 5.99m
        };

        private Item GetShoesItem() => new Item
        {
            ItemId = 3,
            Name = "Shoes",
            Description = "Smart shoes",
            ImageUri = "",
            ItemType = ItemType.Listing,
            Price = 24.99m
        };

        private Item GetVoucherItem() => new Item
        {
            ItemId = 4,
            Name = "£10 Gift Voucher",
            Description = "£10 voucher",
            ImageUri = "",
            ItemType = ItemType.Voucher,
            Price = 10.00m
        };

        private SubsetGroup GetHatSubsetGroup() => new SubsetGroup
        {
            Items = new List<Item>
            {
                GetCapItem(),
                GetBeanieItem()
            },
            Name = "Hat Group"
        };

        private OfferVoucher GetOfferVoucher10Pounds() => new OfferVoucher
        {
            Code = "10POUNDSOFF",
            MinPriceToApply = 50,
            Value = 10,
            VoucherType = VoucherType.Offer
        };

        private OfferVoucher GetOfferVoucher5PoundsOffHats() => new OfferVoucher
        {
            Code = "5POUNDSOFFHATS",
            MinPriceToApply = 0,
            Value = 5,
            VoucherType = VoucherType.Offer,
            SubsetGroup = GetHatSubsetGroup()
        };

        private GiftVoucher GetGiftVoucher10PoundsOff() => new GiftVoucher
        {
            Code = "TENNEROFF",
            Value = 10,
            VoucherType = VoucherType.Gift
        };

        [Fact]
        public void ApplyNoVouchers()
        {
            var cartItems = new List<Item>
            {
                GetCapItem(),
                GetShoesItem(),
                GetVoucherItem()
            };

            var response = VouchersController.ApplyVouchersItems(null, new List<GiftVoucher>(), cartItems);
            response.Item1.Count().Should().Be(0);
            response.Item2.Should().BeNull();
        }

        [Fact]
        public void ApplyVoucherScopedToHatSubsetWithHats()
        {
            var cartItems = new List<Item>
            {
                GetCapItem(),
                GetShoesItem(),
                GetVoucherItem()
            };

            var response = VouchersController.ApplyVouchersItems(GetOfferVoucher5PoundsOffHats(), new List<GiftVoucher>(), cartItems);
            response.Item1.Should().BeEquivalentTo(new List<VoucherApplicationResponse>
            {
                new VoucherApplicationResponse
                {
                    Code = "5POUNDSOFFHATS",
                    Discount = 5,
                    Description = "Applied offer voucher with code '5POUNDSOFFHATS'"
                }
            });
            response.Item2.Should().BeNull();
        }

        [Fact]
        public void ApplyVoucherScopedToHatSubsetWithNoHats()
        {
            var cartItems = new List<Item>
            {
                GetShoesItem(),
                GetVoucherItem()
            };

            var response = VouchersController.ApplyVouchersItems(GetOfferVoucher5PoundsOffHats(), new List<GiftVoucher>(), cartItems);
            response.Item2.Should().Be("The basket does not contain 'Hat Group' items. Voucher with code '5POUNDSOFFHATS' cannot be applied");
        }

        [Fact]
        public void ApplyOfferVoucherWhenBasketDoesNotMeetMinBasketPrice()
        {
            var cartItems = new List<Item>
            {
                GetShoesItem(),
                GetVoucherItem()
            };

            var response = VouchersController.ApplyVouchersItems(GetOfferVoucher10Pounds(), new List<GiftVoucher>(), cartItems);
            response.Item2.Should().Be("The basket total £34.99 is less than the required £50. Voucher with code '10POUNDSOFF' cannot be applied");
        }

        [Fact]
        public void ShouldNotApplyGiftVoucherToVoucherItemInCart()
        {
            var cartItems = new List<Item>
            {
                GetBeanieItem(),
                GetVoucherItem()
            };
            var response = VouchersController.ApplyVouchersItems(null, new List<GiftVoucher>
            {
                GetGiftVoucher10PoundsOff()
            }, cartItems);
            response.Item1.Should().BeEquivalentTo(new List<VoucherApplicationResponse>
            {
                new VoucherApplicationResponse
                {
                    Code = "TENNEROFF",
                    Description = "Applied gift voucher with code 'TENNEROFF'",
                    Discount = 5.99m
                }
            });
        }
    }
}
