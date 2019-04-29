using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace PureGym.Store.Data
{
    public class GiftVoucher : Voucher
    {
        public override decimal ApplyVoucher(decimal basketTotal, IEnumerable<Item> items)
        {
            var applicableItems = items.Where(i => i.ItemType != ItemType.Voucher);
            return Math.Min(Value, applicableItems.Sum(i => i.Price));
        }
    }
}
