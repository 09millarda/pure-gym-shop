import React from "react";
import { ICartListingState, IReduxState, IListingState } from "../../../App/index";
import { connect } from "react-redux";
import { removeItemFromCart, alterCartQuantity } from "./redux/cartActions";
import { Link } from "react-router-dom";
import CartItemsTable from "../../../Components/CartItemsTable";
import PageTitle from "../../../Layout/PageTitle/PageTitle";

interface ICartStateProps {
  items: ICartListingState[];
  listings: IListingState[];
}

interface ICartDispatchProps {
  removeItemsWithId: (id: number) => void;
  alterItemQuantity: (id: number, quantity: number) => void;
}

type ICartProps = ICartStateProps & ICartDispatchProps;

function Cart(props: ICartProps): JSX.Element {
  function removeFromCart(id: number): void {
    props.removeItemsWithId(id);
  }

  function updateCartListingQuantity(id: number, quantity: number): void {
    props.alterItemQuantity(id, quantity);
  }

  function calculateBasketTotal(cartItems: ICartListingState[], listings: IListingState[]): number {
    let total: number = 0;

    cartItems.forEach(item => {
      const listing: IListingState | undefined = listings.find(l => l.itemId === item.id);

      if (listing != null) {
        total += listing.price * item.quantity;
      }
    });

    return total;
  }

  return (
    <div className="card-box">
      <PageTitle
        title="SHOPPING CART"
      />
      <CartItemsTable
        items={props.items}
        listings={props.listings}
        removeFromCart={removeFromCart}
        updateCartListingQuantity={updateCartListingQuantity}
        readonly={false}
      />
      {
        props.items.length > 0 &&
        <div className="row">
          <div className="col-12">
            <p className="text-right">
              <b>Basket Total:</b> £{calculateBasketTotal(props.items, props.listings).toFixed(2)}
            </p>
            <p className="text-right">
              <Link to="/checkout" className="btn btn-info">Checkout</Link>
            </p>
          </div>
        </div>
      }
    </div>
  );
}

function mapStateToProps(state: IReduxState): ICartStateProps {
  return {
    items: state.cartState.items,
    listings: state.listingsState.listings
  };
}

function mapDispatchToProps(dispatch: any): ICartDispatchProps {
  return {
    removeItemsWithId: (id: number) => dispatch(removeItemFromCart(id)),
    alterItemQuantity: (id: number, quantity: number) => dispatch(alterCartQuantity(id, quantity))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Cart);