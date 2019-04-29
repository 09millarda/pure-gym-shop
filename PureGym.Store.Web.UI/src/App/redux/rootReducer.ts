import cartReducer, { initialCartState } from "../../Views/Store/Cart/redux/cartReducer";
import listingsReducer, { initialListingsState } from "../../Views/Store/Listings/redux/listingsReducer";
import newItemReducer, { initialNewItemState } from "../../Views/ItemManagement/New/redux/newItemReducer";
import voucherReducer, { initialVoucherState } from "../../Views/VoucherManagement/redux/voucherReducer";
import subsetReducer, { initialSubsetReducer } from "../../Views/SubsetsManagement/redux/subsetReducer";
import { combineReducers } from "redux";
import { IReduxState } from "../index";

export const initialState: IReduxState = {
  cartState: initialCartState,
  listingsState: initialListingsState,
  newItemState: initialNewItemState,
  voucherState: initialVoucherState,
  subsetState: initialSubsetReducer
};

export default combineReducers<IReduxState>({
  cartState: cartReducer,
  listingsState: listingsReducer,
  newItemState: newItemReducer,
  voucherState: voucherReducer,
  subsetState: subsetReducer
});