using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PureGym.Store.Data.Sql
{
    internal class SqlItemRepository : SqlRepositoryBase, IItemsRepository
    {
        public SqlItemRepository(DbStateContext context) : base(context) { }

        public async Task<Item> Create(Item item)
        {
            var sqlItem = new Models.Item
            {
                Description = item.Description,
                Name = item.Name,
                Price = item.Price,
                ImageUri = item.ImageUri
            };

            await Context.Items.AddAsync(sqlItem);
            await Context.SaveChangesAsync();

            item.ItemId = sqlItem.ItemId;
            return item;
        }

        public async Task DeleteById(int id)
        {
            var sqlItem = await Context.Items.SingleAsync(i => i.ItemId == id);
            Context.Remove(sqlItem);
            await Context.SaveChangesAsync();
        }

        public async Task<IEnumerable<Item>> GetAll()
        {
            var sqlItems = await Context.Items.OrderBy(i => i.ItemType).ToListAsync();

            return sqlItems.Select(item => new Item
            {
                Description = item.Description,
                ItemId = item.ItemId,
                Name = item.Name,
                Price = item.Price,
                ImageUri = item.ImageUri,
                ItemType = item.ItemType
            });
        }

        public async Task<Item> GetById(int itemId)
        {
            var sqlItem = await Context.Items.SingleOrDefaultAsync(i => i.ItemId == itemId);
            if (sqlItem == null) return null;

            return new Item
            {
                ItemId = sqlItem.ItemId,
                Description = sqlItem.Description,
                Name = sqlItem.Name,
                Price = sqlItem.Price,
                ImageUri = sqlItem.ImageUri,
                ItemType = sqlItem.ItemType
            };
        }

        public async Task<IEnumerable<Item>> GetByIds(IEnumerable<int> ids)
        {
            var items = await Context.Items.Where(item => ids.Contains(item.ItemId)).ToListAsync();
            return items.Select(i => new Item
            {
                ItemId = i.ItemId,
                Description = i.Description,
                Name = i.Name,
                Price = i.Price,
                ImageUri = i.ImageUri,
                ItemType = i.ItemType
            });
        }

        public async Task<Item> GetByName(string name)
        {
            var item = await Context.Items.SingleOrDefaultAsync(i => i.Name == name);
            if (item == null) return null;

            return new Item
            {
                Name = item.Name,
                Description = item.Description,
                ItemId = item.ItemId,
                Price = item.Price,
                ItemType = item.ItemType,
                ImageUri = item.ImageUri
            };
        }

        public async Task<GiftVoucherItem> GetGiftVoucherItemById(int id)
        {
            var giftVoucher = await Context.GiftVoucherItems.Include(v => v.Item).SingleOrDefaultAsync(g => g.Item.ItemId == id);
            if (giftVoucher == null) return null;

            return new GiftVoucherItem
            {
                Description = giftVoucher.Item.Description,
                ImageUri = giftVoucher.Item.ImageUri,
                ItemId = giftVoucher.ItemId,
                Name = giftVoucher.Item.Name,
                Price = giftVoucher.Item.Price
            };
        }

        public async Task<IEnumerable<GiftVoucherItem>> GetGiftVoucherItems()
        {
            var giftVouchers = await Context.GiftVoucherItems.Include(v => v.Item).ToListAsync();
            return giftVouchers.Select(v => new GiftVoucherItem
            {
                Description = v.Item.Description,
                ImageUri = v.Item.ImageUri,
                ItemId = v.ItemId,
                Name = v.Item.Name,
                Price = v.Item.Price
            });
        }

        public async Task<Item> Update(Item item)
        {
            var sqlItem = await Context.Items.SingleAsync(i => i.ItemId == item.ItemId);

            sqlItem.Name = item.Name;
            sqlItem.Price = item.Price;
            sqlItem.Description = item.Description;
            sqlItem.ImageUri = item.ImageUri;

            Context.Items.Update(sqlItem);
            await Context.SaveChangesAsync();
            return item;
        }
    }
}
