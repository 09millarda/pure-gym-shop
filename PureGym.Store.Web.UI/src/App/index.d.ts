import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { ThunkAction } from "redux-thunk";

export declare module "react-spinners/BarLoader" {
  import React from "react";

  export const BarLoader: (props: any) => React.SFC<any>;
}

export type ThunkResult<R> = ThunkAction<R, IReduxState, undefined, Action>;

export interface IAppliedVoucherResponse {
  code: string;
  description: string;
  discount: number;
}

export interface ISubsetManagementState {
  subsets: ISubsetGroup[];
  isFetchingSubsets: boolean;
  newSubsetState: INewSubsetState;
}

export interface INewSubsetState {
  name: string;
  itemIds: number[];
}

export interface ISubsetGroup {
  name: string;
  subsetId: number;
  items: IListingState[];
}

export interface IReduxState {
  cartState: ICartState;
  listingsState: IListingsState;
  newItemState: INewItemState;
  voucherState: IVoucherState;
  subsetState: ISubsetManagementState;
}

export interface IVoucher {
  voucherId: number;
  value: number;
  code: string;
  voucherType: string;
  subsetGroup?: ISubsetGroup;
}

export interface IOfferVoucher extends IVoucher {
  minPriceToApply: number;
}

export interface IGiftVoucher extends IVoucher { }

export interface IVoucherState {
  vouchers: {
    giftVouchers: IGiftVoucher[];
    offerVouchers: IOfferVoucher[];
  };
  isFetchingVouchers: boolean;
}

export interface INewItemState {
  title: string;
  unitPrice?: number;
  description: string;
  imageUri: string;
}

export interface IListingState {
  itemId: number;
  name: string;
  description: string;
  price: number;
  imageUri: string;
  itemType: string;
}

export interface IListingsState {
  listings: IListingState[];
  isFetchingListings: boolean;
}

export interface ICartListingState {
  id: number;
  quantity: number;
}

export interface ICartState {
  items: ICartListingState[];
}

export interface ISideBarMenuOption {
  title: string;
  logo: IconProp;
  rootUrl: string;
  exact?: boolean;
}

export interface IListing {
  id: number;
  addToCart: (id: number) => void;
  imgUrl: string;
  title: string;
  price: number;
  description: string;
}