using PureGym.Store.Common.Exceptions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace PureGym.Store.Data
{
    public class OfferVoucher : Voucher
    {
        public decimal MinPriceToApply { get; set; }
        public SubsetGroup SubsetGroup { get; set; }

        public override decimal ApplyVoucher(decimal basketTotal, IEnumerable<Item> items)
        {
            if (basketTotal < MinPriceToApply)
                throw new VoucherCannotBeAppliedException($"The basket total £{basketTotal} is less than the required £{MinPriceToApply}. Voucher with code '{Code}' cannot be applied");

            if (SubsetGroup != null)
            {
                var subsetTotal = items.Where(i => SubsetGroup.Items.Select(sI => sI.ItemId).Contains(i.ItemId)).Sum(i => i.Price);
                if (subsetTotal == 0) throw new VoucherCannotBeAppliedException($"The basket does not contain '{SubsetGroup.Name}' items. Voucher with code '{Code}' cannot be applied");
                return Math.Min(Value, subsetTotal);
            }

            return Math.Max(basketTotal, Value);
        }
    }
}
