using System;
using System.Collections.Generic;
using System.Text;

namespace PureGym.Store.Data.Sql.Models
{
    internal class Item
    {
        public int ItemId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }
        public string ImageUri { get; set; }
        public ItemType ItemType { get; set; }
    }
}
