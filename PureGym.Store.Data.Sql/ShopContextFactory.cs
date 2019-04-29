using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using PureGym.Store.Common;
using System;
using System.Collections.Generic;
using System.IO;
using System.Text;

namespace PureGym.Store.Data.Sql
{
    internal class ShopContextFactory : IDesignTimeDbContextFactory<DbStateContext>
    {
        public DbStateContext CreateDbContext(string[] args)
        {
            return new DbStateContext(CommonConfiguration.Config["Sql_ConnectionString"]);
        }
    }
}
