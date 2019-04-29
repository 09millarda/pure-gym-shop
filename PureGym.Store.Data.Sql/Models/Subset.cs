using System;
using System.Collections.Generic;
using System.Text;

namespace PureGym.Store.Data.Sql.Models
{
    internal class Subset
    {
        public int SubsetId { get; set; }
        public string Name { get; set; }
        public virtual List<SubsetItem> SubsetItems { get; set; }
    }
}
