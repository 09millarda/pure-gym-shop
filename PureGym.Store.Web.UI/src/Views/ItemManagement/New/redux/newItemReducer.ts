import { INewItemState } from "../../../../App/index";
import { AnyAction } from "redux";
import { UPDATE_NEW_ITEM } from "./newItemAction";

export const initialNewItemState: INewItemState = {
  description: "",
  title: "",
  imageUri: ""
};

export default function newItemReducer(state: INewItemState = initialNewItemState, action: AnyAction): INewItemState {
  switch (action.type) {
    case UPDATE_NEW_ITEM:
      return {...state, title: action.title, unitPrice: action.price, description: action.description, imageUri: action.imageUri};
    default:
      return state;
  }
}