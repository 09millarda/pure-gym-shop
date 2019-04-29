import { ICartListingState } from "../index";
import * as Cookies from "js-cookie";

const CART_ITEMS_COOKIE_NAME: string = "CART_ITEMS_COOKIE";

export function setCartCookie(cartItems: ICartListingState[], expiresInDays: number): void {
  Cookies.set(CART_ITEMS_COOKIE_NAME, JSON.stringify(cartItems), {
    expires: expiresInDays
  });
}

export function getCartCookie(): ICartListingState[] {
  const items: string | undefined = Cookies.get(CART_ITEMS_COOKIE_NAME);
  if (items == null) {
    return [];
  } else {
    return JSON.parse(items);
  }
}