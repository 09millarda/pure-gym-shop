using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace PureGym.Store.Data
{
    public interface IVoucherRepository
    {
        Task<GiftVoucher> Create(GiftVoucher giftVoucher);
        Task<OfferVoucher> Create(OfferVoucher offerVoucher);
        Task<Voucher> GetByCode(string voucherCode);
        Task<Voucher> GetById(int voucherId);
        Task<GiftVoucher> GetGiftVoucherByVoucherId(int voucherId);
        Task<OfferVoucher> GetOfferVoucherByVoucherId(int voucherId);
        Task DeleteById(int voucherId);
        Task<IEnumerable<OfferVoucher>> GetOfferVouchers();
        Task<IEnumerable<GiftVoucher>> GetGiftVouchers();
    }
}
