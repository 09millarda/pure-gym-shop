using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.IO;
using System.Text;

namespace PureGym.Store.Common
{
    public static class CommonConfiguration
    {
        public static IConfiguration Config { get; }

        static CommonConfiguration()
        {
            Config = new ConfigurationBuilder()
                .AddJsonFile("appsettings.json", true)
                .AddEnvironmentVariables()
                .AddUserSecrets("PureGym.Store.Web")
                .Build();
        }
    }
}