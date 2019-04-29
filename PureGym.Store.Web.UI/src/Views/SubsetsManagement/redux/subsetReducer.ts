import { ISubsetManagementState } from "../../../App/index";
import { AnyAction } from "redux";
import { FETCH_ALL_SUBSETS, FETCHED_ALL_SUBSETS, UPDATE_NEW_SUBSET } from "./subsetActions";

export const initialSubsetReducer: ISubsetManagementState = {
  subsets: [],
  isFetchingSubsets: false,
  newSubsetState: {
    name: "",
    itemIds: []
  }
};

export default function(state: ISubsetManagementState = initialSubsetReducer, action: AnyAction): ISubsetManagementState {
  switch (action.type) {
    case FETCH_ALL_SUBSETS:
      return {...state, isFetchingSubsets: true};
    case FETCHED_ALL_SUBSETS:
      return {...state, isFetchingSubsets: false, subsets: action.subsets};
    case UPDATE_NEW_SUBSET:
      return {...state, newSubsetState: {...state.newSubsetState, name: action.name, itemIds: action.itemIds}};
    default:
      return state;
  }
}