using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using System;
using System.Collections.Generic;
using System.Text;

namespace PureGym.Store.Data
{
    public class Voucher
    {
        public int VoucherId { get; set; }
        public decimal Value { get; set; }
        public string Code { get; set; }
        [JsonConverter(typeof(StringEnumConverter))]
        public VoucherType VoucherType { get; set; }

        public virtual decimal ApplyVoucher(decimal basketTotal, IEnumerable<Item> items) => throw new NotImplementedException();
    }
}
