import React, { useState, useEffect } from "react";

interface ICartListing {
  id: number;
  removeFromCart?: (id: number) => void;
  updateCartListingQuantity?: (id: number, quantity: number) => void;
  title: string;
  unitPrice: number;
  quantity: number;
  readonly: boolean | undefined;
}

function CartListing(props: ICartListing): JSX.Element {
  const [localQuantity, setLocalQuantity] = useState(props.quantity.toString());

  useEffect(() => {
    setLocalQuantity(props.quantity.toString());
  }, [
    props.quantity
  ]);

  function calculateTotalPrice(unitPrice: number, quantity: number): number {
    return parseFloat((unitPrice * quantity).toFixed(2));
  }

  function updateQuantity(e: React.ChangeEvent<HTMLInputElement>): void {
    const quantity: number = e.target.validity.valid && e.target.value.length > 0 ? parseInt(e.target.value, 10) : 1;
    if (props.updateCartListingQuantity) {
      props.updateCartListingQuantity(props.id, quantity);
    }
  }

  return (
    <tr>
      <td>{props.title}</td>
      <td>
        {
          !props.readonly &&
          <input
            type="number"
            step={1}
            min={1}
            className="form-control"
            style={{
              maxWidth: "70px"
            }}
            value={localQuantity}
            onChange={(e) => setLocalQuantity(e.target.value)}
            onBlur={updateQuantity}
            pattern="[0-9]+"
          />
        }
        {
          props.readonly && localQuantity
        }
      </td>
      <td>£{props.unitPrice}</td>
      <td>£{calculateTotalPrice(props.unitPrice, props.quantity)}</td>
      {
        !props.readonly &&
        <td>
          <button
            className="btn btn-link"
            style={{
              padding: "0px"
            }}
            onClick={() => props.removeFromCart ? props.removeFromCart(props.id) : null}
          >Remove</button>
        </td>
      }
    </tr>
  );
}

export default CartListing;