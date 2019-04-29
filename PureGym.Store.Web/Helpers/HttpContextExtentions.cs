using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PureGym.Store.Web.Helpers
{
    internal static class HttpContextExtentions
    {
        public static Uri CreateCreatedUri(this HttpRequest httpRequest, string rootPath) =>
            new Uri(string.Format("{0}://{1}/{2}", httpRequest.Scheme, httpRequest.Host, rootPath));
    }
}
