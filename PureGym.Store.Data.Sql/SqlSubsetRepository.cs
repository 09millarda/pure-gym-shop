using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PureGym.Store.Data.Sql
{
    internal class SqlSubsetRepository : SqlRepositoryBase, ISubsetRepository
    {
        public SqlSubsetRepository(DbStateContext context) : base(context) { }

        public async Task<SubsetGroup> Create(SubsetGroup subsetGroup)
        {
            var sqlSubset = new Models.Subset
            {
                Name = subsetGroup.Name
            };

            var sqlSubsetItems = subsetGroup.Items.Select(i => new Models.SubsetItem
            {
                ItemId = i.ItemId,
                Subset = sqlSubset
            });

            await Context.Subsets.AddAsync(sqlSubset);
            await Context.SubsetItems.AddRangeAsync(sqlSubsetItems);
            await Context.SaveChangesAsync();

            return new SubsetGroup
            {
                SubsetId = sqlSubset.SubsetId,
                Name = sqlSubset.Name,
                Items = subsetGroup.Items
            };
        }

        public async Task Delete(int subsetGroupId)
        {
            var sqlSubsetItems = await Context.SubsetItems.Where(i => i.SubsetItemId == subsetGroupId).ToListAsync();
            Context.RemoveRange(sqlSubsetItems);

            var sqlSubset = await Context.Subsets.SingleAsync(s => s.SubsetId == subsetGroupId);
            Context.Remove(sqlSubset);

            await Context.SaveChangesAsync();
        }

        public async Task DeleteByItemId(int itemId)
        {
            var sqlSubsetItems = await Context.SubsetItems.Where(i => i.ItemId == itemId).ToListAsync();
            Context.RemoveRange(sqlSubsetItems);
            await Context.SaveChangesAsync();
        }

        public async Task<IEnumerable<SubsetGroup>> GetAllGroups()
        {
            var sqlSubsetItems = await Context.SubsetItems
                .Include(s => s.Item)
                .Include(s => s.Subset)
                .GroupBy(s => s.SubsetId).ToListAsync();

            return sqlSubsetItems.Select(sg => new SubsetGroup
            {
                SubsetId = sg.First().SubsetId,
                Name = sg.First().Subset.Name,
                Items = sg.Select(i => new Item
                {
                    Name = i.Item.Name,
                    Description = i.Item.Description,
                    ImageUri = i.Item.ImageUri,
                    ItemId = i.Item.ItemId,
                    Price = i.Item.Price,
                    ItemType = i.Item.ItemType
                }).ToList()
            });
        }

        public async Task<SubsetGroup> GetById(int id)
        {
            var subset = await Context.Subsets.SingleOrDefaultAsync(s => s.SubsetId == id);
            if (subset == null) return null;

            var items = await Context.SubsetItems.Include(i => i.Item).Where(i => i.SubsetId == subset.SubsetId).ToListAsync();

            return new SubsetGroup
            {
                Name = subset.Name,
                SubsetId = id,
                Items = items.Select(i => new Item
                {
                    Name = i.Item.Name,
                    Description = i.Item.Description,
                    ImageUri = i.Item.ImageUri,
                    ItemId = i.ItemId,
                    ItemType = i.Item.ItemType,
                    Price = i.Item.Price
                }).ToList()
            };
        }

        public async Task<SubsetGroup> GetByName(string name)
        {
            var subset = await Context.Subsets.SingleOrDefaultAsync(s => s.Name == name);
            if (subset == null) return null;

            var items = await Context.SubsetItems.Include(i => i.Item).Where(i => i.SubsetId == subset.SubsetId).ToListAsync();

            return new SubsetGroup
            {
                Name = subset.Name,
                SubsetId = subset.SubsetId,
                Items = items.Select(i => new Item
                {
                    Name = i.Item.Name,
                    Description = i.Item.Description,
                    ImageUri = i.Item.ImageUri,
                    ItemId = i.ItemId,
                    Price = i.Item.Price,
                    ItemType = i.Item.ItemType
                }).ToList()
            };
        }

        public async Task<SubsetGroup> Update(SubsetGroup subsetGroup)
        {
            var sqlSubset = await Context.Subsets.SingleAsync(s => s.SubsetId == subsetGroup.SubsetId);
            sqlSubset.Name = subsetGroup.Name;

            var currSqlSubsetItems = await Context.SubsetItems.Where(i => i.SubsetId == subsetGroup.SubsetId).ToListAsync();
            Context.RemoveRange(currSqlSubsetItems);

            var sqlSubsetItems = subsetGroup.Items.Select(i => new Models.SubsetItem
            {
                ItemId = i.ItemId,
                Subset = sqlSubset
            });
            await Context.SubsetItems.AddRangeAsync(sqlSubsetItems);

            await Context.SaveChangesAsync();

            return subsetGroup;
        }
    }
}
