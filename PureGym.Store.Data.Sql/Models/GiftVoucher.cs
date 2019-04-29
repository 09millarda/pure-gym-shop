using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace PureGym.Store.Data.Sql.Models
{
    internal class GiftVoucher
    {
        public int GiftVoucherId { get; set; }
        public int VoucherId { get; set; }
        public virtual Models.Voucher Voucher { get; set; }
    }
}
