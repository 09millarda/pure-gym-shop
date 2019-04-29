import React, { useEffect, useState } from "react";
import { ICartListingState, IListingState, IReduxState, IAppliedVoucherResponse, IGiftVoucher } from "../../App/index";
import CartItemsTable from "../../Components/CartItemsTable";
import { connect } from "react-redux";
import ApplyVoucherForm from "../../Components/ApplyVoucherForm";
import getDataUrl from "../../App/common/proxy";
import showErrorAlert from "../../App/common/errorMessage";
import PageTitle from "../../Layout/PageTitle/PageTitle";
import swal from "sweetalert";
import { setCartCookie } from "../../App/common/cookieManager";

interface ICheckoutStateProps {
  cartItems: ICartListingState[];
}

type IProps = ICheckoutStateProps;

function Checkout(props: IProps): JSX.Element {
  const [cartListings, setCartListings] = useState<IListingState[]>([]);
  const [isFetchingCartListings, setIsFetchingCartListings] = useState(false);
  const [appliedVouchers, setAppliedVouchers] = useState<IAppliedVoucherResponse[]>([]);

  async function fetchItemsByIds(): Promise<void> {
    setIsFetchingCartListings(true);

    const itemIds: number[] = props.cartItems.map(i => i.id);
    const url: string = `${getDataUrl()}/items/byIds?csvItemIds=${itemIds.join(",")}`;
    fetch(url)
      .then(async (res) => {
        const listings: IListingState[] = await res.json();
        setCartListings(listings);
      })
      .catch((err) => {
        showErrorAlert("An error occured fetching listings", err);
      })
      .finally(() => {
        setIsFetchingCartListings(false);
      });
  }

  useEffect(() => {
    fetchItemsByIds();
  }, [
    props.cartItems
  ]);

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

  function calculateSubTotal(basketTotal: number, appliedVouchers: IAppliedVoucherResponse[]): number {
    const appliedVoucherDiscountTotal: number = appliedVouchers.reduce((t, n) => t + n.discount, 0);
    return basketTotal - appliedVoucherDiscountTotal;
  }

  function mapGiftVouchers(cartItems: ICartListingState[], listings: IListingState[]): IGiftVoucher[] {
    const items: IListingState[] = listings.filter(l => l.itemType === "Voucher" && cartItems.find(i => i.id === l.itemId) != null);

    const quantifiedVouchers: IGiftVoucher[] = [];
    for(const _item of items) {
      const item = cartItems.find(i => i.id === _item.itemId);
      if (item == null) {
        continue;
      }

      for (let i = 0; i < item.quantity; i++) {
        quantifiedVouchers.push({
          value: _item.price,
          code: "",
          voucherType: "Voucher",
          voucherId: -1
        });
      }
    }

    return quantifiedVouchers;
  }

  async function buyItems() {
    const url: string = `${getDataUrl()}/vouchers/gift`;

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        giftVouchers: mapGiftVouchers(props.cartItems, cartListings).map((g) => {
          return {
            value: g.value
          };
        })
      })
    })
    .then(async (res) => {
      const text: string = await res.text();
      const price = calculateSubTotal(calculateBasketTotal(props.cartItems, cartListings), appliedVouchers).toFixed(2);
      swal({
        title: `You spent £${price}`,
        icon: "success",
        text
      })
      .then(() => {
        setCartCookie([], 7);
        window.location.href = "/";
      });
    })
    .catch((err) => {
      showErrorAlert("An error occured fetching listings", err);
    })
    .finally(() => {
      setIsFetchingCartListings(false);
    });
  }

  return (
    <div className="row">
      <div className="col-12">
        <div className="card-box">
          <PageTitle
            title="CHECKOUT"
          />
          <CartItemsTable
            items={props.cartItems}
            listings={cartListings}
            readonly={true}
            isFetching={isFetchingCartListings}
          />
          {
            !isFetchingCartListings && cartListings.length > 0 &&
            <div className="row mt-3">
              <div className="col-6">
                <ApplyVoucherForm
                  itemIdQuantities={props.cartItems.filter(i =>
                    cartListings.find(item => item.itemId === i.id) != null)}
                  updateAppliedVouchers={setAppliedVouchers}
                />
              </div>
              <div className="col-6">
                <p className="text-right">
                  Basket Total: <b>£{calculateBasketTotal(props.cartItems, cartListings).toFixed(2)}</b>
                </p>
                <div>
                  <table
                    className="table table-sm float-right"
                    style={{
                      maxWidth: "300px",
                      margin: "0px"
                    }}>
                    <tbody>
                      {
                        appliedVouchers.map((appliedVoucher, i) =>
                          <tr key={i}>
                            <td>{appliedVoucher.description}</td>
                            <td><b>- £{appliedVoucher.discount}</b></td>
                          </tr>
                        )
                      }
                    </tbody>
                  </table>
                  <div className="clearfix"></div>
                </div>
                <hr/>
                <p className="text-right">
                  Invoice Total: <b>£{calculateSubTotal(calculateBasketTotal(props.cartItems, cartListings), appliedVouchers).toFixed(2)}</b>
                </p>
                <button className="btn btn-success mt-3 float-right" onClick={buyItems}>Buy Now</button>
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  );
}

function mapStateToProps(state: IReduxState): ICheckoutStateProps {
  return {
    cartItems: state.cartState.items
  };
}

export default connect(mapStateToProps)(Checkout);