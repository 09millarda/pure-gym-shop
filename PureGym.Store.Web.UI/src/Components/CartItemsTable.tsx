import { ICartListingState, IListingState } from "../App/index";
import React from "react";
import CartListing from "./CartListing";
import LoadingWheel from "./LoadingWheel";

interface ICartItemsProps {
  items: ICartListingState[];
  listings: IListingState[];
  removeFromCart?: (id: number) => void;
  updateCartListingQuantity?: (id: number, quantity: number) => void;
  readonly?: boolean;
  isFetching?: boolean;
}

function CartItemsTable(props: ICartItemsProps): JSX.Element {
  function generateCartItemListings(cartItems: ICartListingState[], listings: IListingState[]): JSX.Element[] {
    const cartItemElements: JSX.Element[] = [];

    cartItems.forEach((item, i) => {
      const listing: IListingState | undefined = listings.find(l => l.itemId === item.id);
      if (listing != null) {
        cartItemElements.push(
          <CartListing
            id={listing.itemId}
            key={i}
            quantity={item.quantity}
            removeFromCart={props.removeFromCart}
            title={listing.name}
            unitPrice={listing.price}
            updateCartListingQuantity={props.updateCartListingQuantity}
            readonly={props.readonly}
          />
        );
      }
    });

    return cartItemElements;
  }

  return (
    <div className="row">
      <div className="col-12">
        <div className="table-container table-responsive mt-3">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Item</th>
                <th>Quantity</th>
                <th>Unit Cost</th>
                <th>Total</th>
                {
                  !props.readonly &&
                  <th></th>
                }
              </tr>
            </thead>
            <tbody>
              {
                generateCartItemListings(props.items, props.listings)
              }
              {
                (props.items.length === 0 || props.listings.length === 0) && !props.isFetching &&
                <tr>
                  <td colSpan={props.readonly ? 5 : 4}>
                    No items in cart
                  </td>
                </tr>
              }
              {
                props.isFetching &&
                <tr>
                  <td colSpan={props.readonly ? 5 : 4}>
                    <LoadingWheel />
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default CartItemsTable;