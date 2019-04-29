using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace PureGym.Store.Data
{
    public interface ISubsetRepository
    {
        Task<IEnumerable<SubsetGroup>> GetAllGroups();
        Task<SubsetGroup> Create(SubsetGroup subsetGroup);
        Task<SubsetGroup> Update(SubsetGroup subsetGroup);
        Task Delete(int subsetGroupId);
        Task<SubsetGroup> GetById(int id);
        Task<SubsetGroup> GetByName(string name);
        Task DeleteByItemId(int itemId);
    }
}
