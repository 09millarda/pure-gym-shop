import { AnyAction } from "redux";

export const UPDATE_NEW_ITEM: string = "UPDATE_NEW_ITEM";

export function updateNewItemFormState(title: string, price: number, description: string, imageUri: string): AnyAction {
  return {
    type: UPDATE_NEW_ITEM,
    title,
    price,
    description,
    imageUri
  };
}