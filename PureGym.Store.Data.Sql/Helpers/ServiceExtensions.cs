using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Text;

namespace PureGym.Store.Data.Sql.Helpers
{
    public static class ServiceExtensions
    {
        public static IServiceCollection AddDbServices(this IServiceCollection collection, IConfiguration configuration)
        {
            collection.AddScoped(sp => new DbStateContext(configuration["Sql_ConnectionString"]));
            collection.AddTransient<IItemsRepository, SqlItemRepository>();
            collection.AddTransient<IVoucherRepository, SqlVoucherRepository>();
            collection.AddTransient<ISubsetRepository, SqlSubsetRepository>();

            return collection;
        }
    }
}
