using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace PureGym.Store.Data.Sql.Models
{
    internal class OfferVoucher
    {
        public int OfferVoucherId { get; set; }
        public int VoucherId { get; set; }
        public virtual Voucher Voucher { get; set; }
        public decimal MinPriceToApply { get; set; }
        public int? SubsetId { get; set; }
        public virtual Subset Subset { get; set; }
    }
}
