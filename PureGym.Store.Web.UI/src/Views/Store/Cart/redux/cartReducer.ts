import { ICartState } from "../../../../App/index";
import { AnyAction } from "redux";
import { UPDATE_CART_ITEMS } from "./cartActions";

export const initialCartState: ICartState = {
  items: []
};

function reducer(state: ICartState = initialCartState, action: AnyAction): ICartState {
  switch(action.type) {
    case UPDATE_CART_ITEMS:
      return {...state, items: action.cartItems};
    default:
      return state;
  }
}

export default reducer;