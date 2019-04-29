using System;
using System.Collections.Generic;
using System.Text;

namespace PureGym.Store.Common.Exceptions
{
    public class VoucherCannotBeAppliedException : Exception
    {
        public VoucherCannotBeAppliedException(string message) : base(message) { }
    }
}
