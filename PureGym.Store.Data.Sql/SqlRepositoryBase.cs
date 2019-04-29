using System;
using System.Collections.Generic;
using System.Text;

namespace PureGym.Store.Data.Sql
{
    internal class SqlRepositoryBase
    {
        protected DbStateContext Context { get; }
        protected SqlRepositoryBase(DbStateContext context)
        {
            Context = context;
        }
    }
}
