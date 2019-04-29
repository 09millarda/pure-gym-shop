using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PureGym.Store.Web.Models
{
    public class ApplyVouchers
    {
        public List<string> Codes { get; set; }
        public List<ItemIdQuantity> ItemIdQuantities { get; set; }
    }

    public class ItemIdQuantity
    {
        public int ItemId { get; set; }
        public int Quantity { get; set; }
    }
}
