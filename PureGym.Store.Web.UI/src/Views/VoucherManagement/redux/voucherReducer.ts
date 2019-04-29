import { IVoucherState } from "../../../App/index";
import { AnyAction } from "redux";
import { FETCH_ALL_VOUCHERS, FETCHED_ALL_VOUCHERS } from "./voucherActions";

export const initialVoucherState: IVoucherState = {
  vouchers: {
    giftVouchers: [],
    offerVouchers: []
  },
  isFetchingVouchers: false
};

export default function voucherStateReducer(state: IVoucherState = initialVoucherState, action: AnyAction): IVoucherState {
  switch (action.type) {
    case FETCH_ALL_VOUCHERS:
      return {...state, isFetchingVouchers: true};
    case FETCHED_ALL_VOUCHERS:
      return {...state, isFetchingVouchers: false, vouchers: action.vouchers};
    default:
      return state;
  }
}