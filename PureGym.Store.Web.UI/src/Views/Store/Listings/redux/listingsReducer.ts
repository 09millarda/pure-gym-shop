import { IListingsState } from "../../../../App/index";
import { AnyAction } from "redux";
import { FETCH_ALL_LISTINGS, FETCHED_ALL_LISTINGS } from "./listingsActions";

export const initialListingsState: IListingsState = {
  listings: [],
  isFetchingListings: false
};

function reducer(state: IListingsState = initialListingsState, action: AnyAction): IListingsState {
  switch(action.type) {
    case FETCH_ALL_LISTINGS:
      return {...state, isFetchingListings: true};
    case FETCHED_ALL_LISTINGS:
      return {...state, isFetchingListings: false, listings: action.listings};
    default:
      return state;
  }
}

export default reducer;