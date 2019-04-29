using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Blob;
using PureGym.Store.Data;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace PureGym.Store.Azure
{
    internal class AzureStorageRepository : IStorageRepository
    {
        private readonly CloudBlobClient _cloudBlobClient;

        public AzureStorageRepository(CloudStorageAccount storageAccount)
        {
            _cloudBlobClient = storageAccount.CreateCloudBlobClient();
        }

        public async Task<string> UploadImageBlob(string base64Image)
        {
            var container = _cloudBlobClient.GetContainerReference("images");
            await container.CreateIfNotExistsAsync();

            var refPath = Guid.NewGuid().ToString() + ".jpg";
            refPath = Uri.EscapeUriString(refPath);

            var blob = container.GetBlockBlobReference(refPath);
            blob.Properties.ContentType = "image/jpg";
            base64Image = base64Image.Substring(base64Image.IndexOf(",") + 1);
            var bytes = Convert.FromBase64String(base64Image);
            await blob.UploadFromByteArrayAsync(bytes, 0, bytes.Length).ConfigureAwait(false);

            return blob.StorageUri.PrimaryUri.AbsoluteUri;
        }
    }
}
