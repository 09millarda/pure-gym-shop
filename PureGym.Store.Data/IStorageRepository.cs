using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace PureGym.Store.Data
{
    public interface IStorageRepository
    {
        Task<string> UploadImageBlob(string base64Image);
    }
}
