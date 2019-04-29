import { AnyAction } from "redux";
import { ReduxStore } from "../../../../App/redux/store";
import { IListingState, ICartListingState } from "../../../../App/index";
import { setCartCookie } from "../../../../App/common/cookieManager";

export const UPDATE_CART_ITEMS: string = "UPDATE_CART_ITEMS";

export function updateCart(cartItems: ICartListingState[]): AnyAction {
  setCartCookie(cartItems, 7);
  return {
    type: UPDATE_CART_ITEMS,
    cartItems
  };
}

export function alterCartQuantity(id: number, quantity: number): AnyAction {
  const listings: IListingState[] = ReduxStore.getState().listingsState.listings;
  const listing: IListingState | undefined = listings.find(l => l.itemId === id);
  if (listing == null) {
    return {
      type: "_default"
    };
   }

  const cartItems: ICartListingState[] = ReduxStore.getState().cartState.items.slice();
  const cartItem: ICartListingState | undefined = cartItems.find(i => i.id === listing.itemId);

  if (cartItem == null) {
    cartItems.push({
      id: listing.itemId,
      quantity: quantity
    });
  } else {
    cartItem.quantity = quantity;
  }

  return updateCart(cartItems);
}

export function addToCart(id: number): AnyAction {
  const cartItem: ICartListingState | undefined = ReduxStore.getState().cartState.items.find(i => i.id === id);

  if (cartItem == null) {
    return alterCartQuantity(id, 1);
  } else {
    return alterCartQuantity(id, cartItem.quantity + 1);
  }
}

export function removeItemFromCart(id: number): AnyAction {
  const cartItems: ICartListingState[] = ReduxStore.getState().cartState.items.slice().filter(i => i.id !== id);

  return updateCart(cartItems);
}