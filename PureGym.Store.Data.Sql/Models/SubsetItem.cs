using System;
using System.Collections.Generic;
using System.Text;

namespace PureGym.Store.Data.Sql.Models
{
    internal class SubsetItem
    {
        public int SubsetItemId { get; set; }
        public Subset Subset { get; set; }
        public int SubsetId { get; set; }
        public Item Item { get; set; }
        public int ItemId { get; set; }
    }
}
