import React, { useState } from "react";
import fetchDataUrl from "../App/common/proxy";
import showErrorAlert from "../App/common/errorMessage";
import { IListingState, IAppliedVoucherResponse, ICartListingState } from "../App/index";

interface IApplyVoucherFormProps {
  itemIdQuantities: ICartListingState[];
  updateAppliedVouchers: (appliedVouchers: IAppliedVoucherResponse[]) => void;
}

function ApplyVoucherForm(props: IApplyVoucherFormProps): JSX.Element {
  const [voucherCodes, setVoucherCodes] = useState<string[]>([]);
  const [voucherInput, setVoucherInput] = useState("");
  const [voucherInputError, setVoucherInputError] = useState("");

  async function onFormSubmit(e: React.FormEvent): Promise<void> {
    e.preventDefault();
    // validate
    if (voucherInput.length === 0) {
      setVoucherInputError("Code must be between 1 and 20 characters");
      return;
    }

    if (voucherCodes.indexOf(voucherInput) !== -1) {
      setVoucherInputError("A voucher with this code has already been applied");
      return;
    }

    const codes: string[] = voucherCodes.slice();
    codes.push(voucherInput);
    applyVouchers(codes);
  }

  async function applyVouchers(codes: string[]): Promise<void> {
    const url: string = `${fetchDataUrl()}/vouchers/apply`;

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        codes,
        itemIdQuantities: props.itemIdQuantities.map(q => {
          return {
            itemId: q.id,
            quantity: q.quantity
          };
        })
      })
    })
    .then(async res => {
      if (res.status === 200) {
        const json: IAppliedVoucherResponse[] = await res.json();
        props.updateAppliedVouchers(json);
        setVoucherCodes(codes);
        setVoucherInput("");
      } else {
        const text: string = await res.text();
        showErrorAlert("Failed to apply voucher", text);
      }
    })
    .catch(err => {
      showErrorAlert("Failed to apply voucher", err);
    });
  }

  async function clearVouchers(): Promise<void> {
    await applyVouchers([]);
    setVoucherCodes([]);
    setVoucherInputError("");
    props.updateAppliedVouchers([]);
  }

  return (
    <div className="row">
      <div className="col-12">
        <form role="form" onSubmit={onFormSubmit}>
          <div className="form-group">
            <label>Enter Voucher Code</label>
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                style={{
                  maxWidth: "250px"
                }}
                value={voucherInput}
                onChange={(e) => {
                  setVoucherInput(e.target.value);
                  setVoucherInputError("");
                }}
              />
              <div className="input-group-append">
                <button className="btn btn-info">Submit</button>
              </div>
            </div>
            {
              voucherInputError.length > 0 &&
              <p className="text-danger font-13">{voucherInputError}</p>
            }
          </div>
        </form>
      </div>
      <div className="col-12">
        <button
          className="btn"
          onClick={clearVouchers}
        >Clear Vouchers</button>
      </div>
    </div>
  );
}

export default ApplyVoucherForm;