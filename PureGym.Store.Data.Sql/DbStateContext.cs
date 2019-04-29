using Microsoft.EntityFrameworkCore;
using PureGym.Store.Data.Sql.Helpers;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Text;

namespace PureGym.Store.Data.Sql
{
    internal class DbStateContext : DbContext
    {
        private readonly string _connectionString;

        public DbStateContext(string connectionString)
        {
            _connectionString = connectionString;
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optsBuilder) =>
            optsBuilder.UseSqlServer(_connectionString);

        public DbSet<Models.Item> Items { get; set; }
        public DbSet<Models.Voucher> Vouchers { get; set; }
        public DbSet<Models.GiftVoucher> GiftVouchers { get; set; }
        public DbSet<Models.OfferVoucher> OfferVouchers { get; set; }
        public DbSet<Models.Subset> Subsets { get; set; }
        public DbSet<Models.SubsetItem> SubsetItems { get; set; }
        public DbSet<Models.GiftVoucherItem> GiftVoucherItems { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.ConfigurePrimaryKey<Models.GiftVoucherItem>(e => e.GiftVoucherItemId);
            modelBuilder.ConfigurePrimaryKey<Models.Item>(e => e.ItemId);
            modelBuilder.ConfigurePrimaryKey<Models.Voucher>(e => e.VoucherId);
            modelBuilder.ConfigurePrimaryKey<Models.GiftVoucher>(e => e.GiftVoucherId);
            modelBuilder.ConfigurePrimaryKey<Models.OfferVoucher>(e => e.OfferVoucherId);
            modelBuilder.ConfigurePrimaryKey<Models.Subset>(e => e.SubsetId);
            modelBuilder.ConfigurePrimaryKey<Models.SubsetItem>(e => e.SubsetItemId);
        }
    }
}
