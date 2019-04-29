﻿// <auto-generated />
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using PureGym.Store.Data.Sql;

namespace PureGym.Store.Data.Sql.Migrations
{
    [DbContext(typeof(DbStateContext))]
    [Migration("20190425004104_add-subset-to-offer-voucher")]
    partial class addsubsettooffervoucher
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "2.2.4-servicing-10062")
                .HasAnnotation("Relational:MaxIdentifierLength", 128)
                .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

            modelBuilder.Entity("PureGym.Store.Data.Sql.Models.GiftVoucher", b =>
                {
                    b.Property<int>("GiftVoucherId")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<int>("VoucherId");

                    b.HasKey("GiftVoucherId");

                    b.HasIndex("VoucherId");

                    b.ToTable("GiftVouchers");
                });

            modelBuilder.Entity("PureGym.Store.Data.Sql.Models.Item", b =>
                {
                    b.Property<int>("ItemId")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("Description");

                    b.Property<string>("ImageUri");

                    b.Property<string>("Name");

                    b.Property<decimal>("Price");

                    b.HasKey("ItemId");

                    b.ToTable("Items");
                });

            modelBuilder.Entity("PureGym.Store.Data.Sql.Models.OfferVoucher", b =>
                {
                    b.Property<int>("OfferVoucherId")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<decimal>("MinPriceToApply");

                    b.Property<int>("SubsetId");

                    b.Property<int>("VoucherId");

                    b.HasKey("OfferVoucherId");

                    b.HasIndex("SubsetId");

                    b.HasIndex("VoucherId");

                    b.ToTable("OfferVouchers");
                });

            modelBuilder.Entity("PureGym.Store.Data.Sql.Models.Subset", b =>
                {
                    b.Property<int>("SubsetId")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("Name");

                    b.HasKey("SubsetId");

                    b.ToTable("Subsets");
                });

            modelBuilder.Entity("PureGym.Store.Data.Sql.Models.SubsetItem", b =>
                {
                    b.Property<int>("SubsetItemId")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<int>("ItemId");

                    b.Property<int>("SubsetId");

                    b.HasKey("SubsetItemId");

                    b.HasIndex("ItemId");

                    b.HasIndex("SubsetId");

                    b.ToTable("SubsetItems");
                });

            modelBuilder.Entity("PureGym.Store.Data.Sql.Models.Voucher", b =>
                {
                    b.Property<int>("VoucherId")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("Code");

                    b.Property<decimal>("Value");

                    b.Property<int>("VoucherType");

                    b.HasKey("VoucherId");

                    b.ToTable("Vouchers");
                });

            modelBuilder.Entity("PureGym.Store.Data.Sql.Models.GiftVoucher", b =>
                {
                    b.HasOne("PureGym.Store.Data.Sql.Models.Voucher", "Voucher")
                        .WithMany()
                        .HasForeignKey("VoucherId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("PureGym.Store.Data.Sql.Models.OfferVoucher", b =>
                {
                    b.HasOne("PureGym.Store.Data.Sql.Models.Subset", "Subset")
                        .WithMany()
                        .HasForeignKey("SubsetId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("PureGym.Store.Data.Sql.Models.Voucher", "Voucher")
                        .WithMany()
                        .HasForeignKey("VoucherId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("PureGym.Store.Data.Sql.Models.SubsetItem", b =>
                {
                    b.HasOne("PureGym.Store.Data.Sql.Models.Item", "Item")
                        .WithMany()
                        .HasForeignKey("ItemId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("PureGym.Store.Data.Sql.Models.Subset", "Subset")
                        .WithMany("SubsetItems")
                        .HasForeignKey("SubsetId")
                        .OnDelete(DeleteBehavior.Cascade);
                });
#pragma warning restore 612, 618
        }
    }
}
