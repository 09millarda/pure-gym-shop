using Polly;
using System;
using System.Data.SqlClient;
using System.Threading.Tasks;

namespace PureGym.Store.Tests.Common
{
    public partial class SharedSteps
    {
        private static string _sql;
        private static string _reseedSql;
        private static SqlConnection _sqlConnection;

        public static async Task ResetDatabaseTables()
        {
            using (_sqlConnection = new SqlConnection(Config.SqlConnectionString))
            {
                await _sqlConnection.OpenAsync();
                Policy
                    .Handle<Exception>()
                    .RetryAsync(5, async (exception, count) =>
                    {
                        ResetTable("GiftVoucherItems");
                        ResetTable("Items");
                        ResetTable("GiftVouchers");
                        ResetTable("OfferVouchers");
                        ResetTable("Vouchers");
                        await ExecuteTableReset();
                        await ExecuteTableReseed();
                
                        using (var command = new SqlCommand(_reseedSql, _sqlConnection))
                        {
                            await command.ExecuteNonQueryAsync().ConfigureAwait(false);
                        }
                    });
            }
        }

        private static Task ExecuteTableReset()
        {
            using (var command = new SqlCommand(_sql, _sqlConnection))
            {
                _sql = string.Empty;
                return command.ExecuteNonQueryAsync();
            }
        }

        private static async Task ExecuteTableReseed()
        {
            using (var command = new SqlCommand(_reseedSql, _sqlConnection))
            {
                _reseedSql = string.Empty;
                await command.ExecuteNonQueryAsync().ConfigureAwait(false);
            }
        }

        private static void ResetTable(string tableName)
        {
            _sql += $"DELETE dbo.{tableName};{Environment.NewLine}";
            _reseedSql += $"DBCC CHECKIDENT ({tableName}, RESEED, 0);{Environment.NewLine}";
        }
    }
}
