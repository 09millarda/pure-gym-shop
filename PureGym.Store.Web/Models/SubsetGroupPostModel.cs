using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PureGym.Store.Web.Models
{
    public class SubsetGroupPostModel
    {
        public string Name { get; set; }
        public List<int> ItemIds { get; set; } = new List<int>();
    }
}
