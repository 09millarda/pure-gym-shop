using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Text;

namespace PureGym.Store.Data.Sql.Helpers
{
    internal static class ModelBuilderExtensions
    {
        public static void ConfigurePrimaryKey<TEntity>(this ModelBuilder modelBuilder,
            Expression<Func<TEntity, object>> propExpression) where TEntity : class
        {
            modelBuilder.Entity<TEntity>().HasKey(propExpression);
            modelBuilder.Entity<TEntity>().Property(propExpression).ValueGeneratedOnAdd();
        }
    }
}
