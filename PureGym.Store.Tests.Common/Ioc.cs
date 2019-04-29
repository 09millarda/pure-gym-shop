using Microsoft.Extensions.DependencyInjection;
using PureGym.Store.Data;
using PureGym.Store.Data.Sql;
using System;
using System.Collections.Generic;
using System.Text;

namespace PureGym.Store.Tests.Common
{
    public static class Ioc
    {
        private static readonly IServiceProvider _serviceProvider;

        static Ioc()
        {
            _serviceProvider = new ServiceCollection()
                .AddScoped(sp => new DbStateContext(Config.SqlConnectionString))
                .AddSingleton<IItemsRepository>(sp => new SqlItemRepository(sp.GetService<DbStateContext>()))
                .BuildServiceProvider();
        }

        public static TType ResolveType<TType>() => _serviceProvider.GetService<TType>();
    }
}
