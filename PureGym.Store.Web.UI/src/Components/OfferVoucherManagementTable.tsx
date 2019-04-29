import React from "react";
import { IOfferVoucher, ISubsetGroup } from "../App/index";
import getDataUrl from "../App/common/proxy";
import showErrorAlert from "../App/common/errorMessage";
import swal from "sweetalert";
import LoadingWheel from "./LoadingWheel";

interface IOfferVoucherManagementTableProps {
  offerVouchers: IOfferVoucher[];
  fetchVouchers: () => void;
  subsets: ISubsetGroup[];
  isLoadingVouchers: boolean;
}

interface IOfferVoucherManagementTableRowProps {
  voucherId: number;
  code: string;
  minBasketPrice: number;
  value: number;
  itemSubset: string;
  deleteVoucher: (id: number) => void;
}

interface IOfferVoucherManagementTableRowState {
  code: string;
  value: string;
  minBasketPrice: string;
  itemSubset: string;
  codeError: string;
  valueError: string;
  minBasketPriceError: string;
  isSaving: boolean;
  subsetError: string;
}

function OfferVoucherManagementTableRow(props: IOfferVoucherManagementTableRowProps): JSX.Element {
  return (
    <tr>
      <td>{props.voucherId}</td>
      <td>{props.code}</td>
      <td>{props.value.toFixed(2)}</td>
      <td>{props.minBasketPrice.toFixed(2)}</td>
      <td>{props.itemSubset}</td>
      <td>
        <button
          className="btn btn-danger"
          onClick={() => props.deleteVoucher(props.voucherId)}
        >Delete</button>
      </td>
    </tr>
  );
}

class OfferVoucherManagementTable extends React.PureComponent<IOfferVoucherManagementTableProps, IOfferVoucherManagementTableRowState> {
  public constructor(props: IOfferVoucherManagementTableProps) {
    super(props);

    this.state = {
      code: "",
      value: "0",
      minBasketPrice: "0",
      itemSubset: "",
      codeError: "",
      minBasketPriceError: "",
      valueError: "",
      subsetError: "",
      isSaving: false
    };
  }

  public render() {
    return (
      <tbody>
        <tr>
          <td>-</td>
          <td>
            <input
              type="text"
              className="form-control"
              style={{
                maxWidth: "250px"
              }}
              value={this.state.code}
              onChange={this.updateCode}
            />
            {
              this.state.codeError.length > 0 &&
              <p className="text-danger font-13 mb-0">{this.state.codeError}</p>
            }
          </td>
          <td>
            <input
              type="number"
              className="form-control"
              style={{
                maxWidth: "250px"
              }}
              value={this.state.value}
              onChange={this.updateValue}
              onBlur={this.onBlurValue}
            />
            {
              this.state.valueError.length > 0 &&
              <p className="text-danger font-13 mb-0">{this.state.valueError}</p>
            }
          </td>
          <td>
            <input
              type="number"
              className="form-control"
              style={{
                maxWidth: "250px"
              }}
              value={this.state.minBasketPrice}
              onChange={this.updateMinBasketPrice}
              onBlur={this.onBlurMinBasketPrice}
            />
            {
              this.state.minBasketPriceError.length > 0 &&
              <p className="text-danger font-13 mb-0">{this.state.minBasketPriceError}</p>
            }
          </td>
          <td>
            <input
              type="text"
              className="form-control"
              style={{
                maxWidth: "250px"
              }}
              list="offerVoucherManagementTableList"
              onChange={this.onSubsetChange}
              value={this.state.itemSubset}
            />
            {
              this.state.subsetError.length > 0 &&
              <p className="text-danger font-13 mb-0">{this.state.subsetError}</p>
            }
            <datalist id="offerVoucherManagementTableList">
              {
                this.props.subsets.map((s, i) =>
                  <option key={i} value={s.name}>{s.subsetId}</option>
                )
              }
            </datalist>
          </td>
          <td>
            <button className="btn btn-info" onClick={this.saveOfferVoucher}>
            {this.state.isSaving ? "Saving..." : "Save Voucher"}</button>
          </td>
        </tr>
        {
          this.props.isLoadingVouchers &&
          <tr>
            <td colSpan={6}>
              <LoadingWheel />
            </td>
          </tr>
        }
        {
          this.props.offerVouchers.map((v, i) =>
            <OfferVoucherManagementTableRow
              code={v.code}
              key={i}
              minBasketPrice={v.minPriceToApply}
              voucherId={v.voucherId}
              deleteVoucher={this.deleteVoucher}
              value={v.value}
              itemSubset={v.subsetGroup ? v.subsetGroup.name : "-"}
            />
          )
        }
      </tbody>
    );
  }

  private saveOfferVoucher = async () => {
    let isValid: boolean = true;

    // code
    if (this.state.code.length === 0 || this.state.code.length > 20) {
      this.setState({
        codeError: "Code must be between 1 and 20 characters"
      });
      isValid = false;
    }

    // item subset
    const subset: ISubsetGroup | undefined = this.props.subsets.find(s => s.name === this.state.itemSubset);
    if (subset == null && this.state.itemSubset.length > 0) {
      this.setState({
        subsetError: "Not a valid subset"
      });
      isValid = false;
    }

    // value
    if (parseFloat(this.state.value) <= 0) {
      this.setState({
        valueError: "Value must be greater than 0"
      });
      isValid = false;
    }

    if (isValid) {
      const swalResponse: any = await swal({
        icon: "warning",
        title: "Are you sure?",
        text: "This will create a new voucher",
        dangerMode: true,
        buttons: ["Cancel", "Create"]
      });

      if (!swalResponse) {
        return;
      }

      this.setState({
        isSaving: true
      });
      const url: string = `${getDataUrl()}/vouchers/offer`;

      fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          minPriceToApply: this.state.minBasketPrice,
          value: this.state.value,
          code: this.state.code,
          voucherType: "Offer",
          subsetGroup: {
            name: this.state.itemSubset
          }
        })
      })
      .then(async (res) => {
        if (res.status === 201) {
          this.props.fetchVouchers();
          this.setState({
            code: "",
            itemSubset: "",
            minBasketPrice: "",
            value: ""
          });
        } else {
          const text: string = await res.text();
          showErrorAlert("Failed to save voucher", text);
        }
      })
      .catch(err => {
        showErrorAlert("Failed to save voucher", err);
      })
      .finally(() => {
        this.setState({
          isSaving: false
        });
      });
    }
  }

  private onSubsetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      itemSubset: e.target.value,
      subsetError: ""
    });
  }

  private updateCode = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      code: e.target.value,
      codeError: ""
    });
  }

  private updateValue = (e: React.ChangeEvent<HTMLInputElement>): void => {
    this.setState({
      value: e.target.value,
      valueError: ""
    });
  }

  private onBlurValue = (e: React.FocusEvent<HTMLInputElement>): void => {
    const value: string = (e.target.validity.valid && e.target.value.length > 0 ? parseFloat(e.target.value) : 0).toFixed(2);

    this.setState({...this.state, value, valueError: ""});
  }

  private updateMinBasketPrice = (e: React.ChangeEvent<HTMLInputElement>): void => {
    this.setState({
      minBasketPrice: e.target.value,
      minBasketPriceError: ""
    });
  }

  private onBlurMinBasketPrice = (e: React.FocusEvent<HTMLInputElement>): void => {
    const minBasketPrice: string = (e.target.validity.valid && e.target.value.length > 0 ? parseFloat(e.target.value) : 0).toFixed(2);

    this.setState({...this.state, minBasketPrice, minBasketPriceError: ""});
  }

  private deleteVoucher = async (id: number): Promise<void> => {
    const swalResponse: any = await swal({
      icon: "warning",
      title: "Are you sure?",
      text: "This will permanently delete this voucher",
      dangerMode: true,
      buttons: ["Cancel", "Delete"]
    });

    if (!swalResponse) {
      return;
    }

    const url = `${getDataUrl()}/vouchers/${id}`;

    fetch(url, {
      method: "DELETE"
    })
    .then(async (res) => {
      if (res.status === 200) {
        this.props.fetchVouchers();
      } else {
        const text: string = await res.text();
        showErrorAlert("Failed to delete voucher", text);
      }
    })
    .catch((err) => {
      showErrorAlert("Failed to delete voucher", err);
    });
  }
}

export default OfferVoucherManagementTable;