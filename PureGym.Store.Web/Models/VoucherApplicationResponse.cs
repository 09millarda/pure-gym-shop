using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PureGym.Store.Web.Models
{
    public class VoucherApplicationResponse
    {
        public string Code { get; set; }
        public string Description { get; set; }
        public decimal Discount { get; set; }
    }
}
