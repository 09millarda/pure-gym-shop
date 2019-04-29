using System;
using System.Collections.Generic;
using System.Text;

namespace PureGym.Store.Data
{
    public class SubsetGroup
    {
        public int SubsetId { get; set; }
        public string Name { get; set; }
        public List<Item> Items { get; set; }
    }
}
