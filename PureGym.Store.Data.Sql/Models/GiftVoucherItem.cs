using System;
using System.Collections.Generic;
using System.Text;

namespace PureGym.Store.Data.Sql.Models
{
    internal class GiftVoucherItem
    {
        public int GiftVoucherItemId { get; set; }
        public int ItemId { get; set; }
        public virtual Models.Item Item { get; set; }
    }
}
