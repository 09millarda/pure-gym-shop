using System;
using System.Collections.Generic;
using System.Text;

namespace PureGym.Store.Data.Sql.Models
{
    internal class Voucher
    {
        public int VoucherId { get; set; }
        public string Code { get; set; }
        public decimal Value { get; set; }
        public VoucherType VoucherType { get; set; }
    }
}
