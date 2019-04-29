using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using System;
using System.Collections.Generic;
using System.Text;

namespace PureGym.Store.Data
{
    public class Item
    {
        public int ItemId { get; set; }
        public string ImageUri { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }
        [JsonConverter(typeof(StringEnumConverter))]
        public ItemType ItemType { get; set; }
    }
}
