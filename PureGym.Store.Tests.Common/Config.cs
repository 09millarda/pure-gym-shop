using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Text;

namespace PureGym.Store.Tests.Common
{
    public static class Config
    {
        private static readonly IConfiguration _config;

        static Config()
        {
            _config = new ConfigurationBuilder()
                .AddJsonFile("appsettings.json", true)
                .AddEnvironmentVariables()
                .Build();
        }

        public static readonly string SqlConnectionString = _config["Int_Sql_ConnectionString"];
    }
}
