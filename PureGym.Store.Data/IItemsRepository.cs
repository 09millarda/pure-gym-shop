using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace PureGym.Store.Data
{
    public interface IItemsRepository
    {
        Task<Item> Create(Item item);
        Task<Item> Update(Item item);
        Task<IEnumerable<Item>> GetAll();
        Task<Item> GetById(int itemId);
        Task<Item> GetByName(string name);
        Task<IEnumerable<Item>> GetByIds(IEnumerable<int> ids);
        Task<IEnumerable<GiftVoucherItem>> GetGiftVoucherItems();
        Task<GiftVoucherItem> GetGiftVoucherItemById(int id);
        Task DeleteById(int id);
    }
}
