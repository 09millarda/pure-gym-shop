using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Auth;
using PureGym.Store.Data;
using System;
using System.Collections.Generic;
using System.Text;

namespace PureGym.Store.Azure
{
    public static class ServiceExtensions
    {
        public static IServiceCollection AddAzureServices(this IServiceCollection collection, IConfiguration configuration)
        {
            collection.AddTransient(s => new CloudStorageAccount(new StorageCredentials(configuration["BlobStorage:AccountName"], configuration["BlobStorage:AccountKey"]), true));
            collection.AddTransient<IStorageRepository, AzureStorageRepository>();

            return collection;
        }
    }
}
