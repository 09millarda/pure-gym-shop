import { IGiftVoucher, IReduxState } from "../App/index";
import React from "react";
import { async } from "q";
import swal from "sweetalert";
import getDataUrl from "../App/common/proxy";
import showErrorAlert from "../App/common/errorMessage";
import LoadingWheel from "./LoadingWheel";

interface IGiftVoucherManagementTableProps {
    giftVouchers: IGiftVoucher[];
    fetchVouchers: () => void;
    isFetchingVouchers: boolean;
}

interface IGiftVoucherManagementTableRowProps {
    voucherId: number;
    code: string;
    value: number;
    deleteVoucher: (id: number) => void;
}

interface IGiftVoucherManagementTableRowState {
    code: string;
    value: string;
    codeError: string;
    valueError: string;
    isSaving: boolean;
}

function GiftVoucherManagementTableRow(props: IGiftVoucherManagementTableRowProps): JSX.Element {
    return (
        <tr>
            <td>{props.voucherId}</td>
            <td>{props.code}</td>
            <td>{props.value}</td>
            <td>
                <button
                    className="btn btn-danger"
                    onClick={() => props.deleteVoucher(props.voucherId)}
                >Delete</button>
            </td>
        </tr>
    );
}

class GiftVoucherManagementTable extends React.PureComponent<IGiftVoucherManagementTableProps, IGiftVoucherManagementTableRowState> {
    public constructor(props: IGiftVoucherManagementTableProps) {
        super(props);

        this.state = {
            code: "",
            codeError: "",
            isSaving: false,
            value: "0",
            valueError: ""
        };
    }

    public render() {
        return (
            <tbody>
                {/* <tr>
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
                            <p className="test-danger font-13 mb-0">{this.state.valueError}</p>
                        }
                    </td>
                    <td>
                        <button
                            className="btn btn-info"
                            onClick={this.saveGiftVoucher}
                        >
                            {this.state.isSaving ? "Saving..." : "Save Voucher"}
                        </button>
                    </td>
                </tr> */}
                {
                    this.props.isFetchingVouchers &&
                    <tr>
                        <td colSpan={4}>
                        <LoadingWheel />
                        </td>
                    </tr>
                }
                {
                    this.props.giftVouchers.map((v, i) => 
                        <GiftVoucherManagementTableRow
                            code={v.code}
                            deleteVoucher={this.deleteVoucher}
                            key={i}
                            value={v.value}
                            voucherId={v.voucherId}
                        />
                    )
                }
            </tbody>
        );
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

    private saveGiftVoucher = async () => {
        let isValid: boolean = true;

        // code
        if (this.state.code.length === 0 || this.state.code.length > 20) {
            this.setState({
                codeError: "Code must be between 1 and 20 characters"
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
            const url: string = `${getDataUrl()}/vouchers/gift`;

            fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    value: this.state.value,
                    code: this.state.code
                })
            })
            .then(async (res) => {
                if (res.status === 201) {
                  this.props.fetchVouchers();
                  this.setState({
                    code: "",
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

    private onBlurValue = (e: React.FocusEvent<HTMLInputElement>): void => {
        const value: string = (e.target.validity.valid && e.target.value.length > 0 ? parseFloat(e.target.value) : 0).toFixed(2);

        this.setState({...this.state, value, valueError: ""});
    }

    private updateValue = (e: React.ChangeEvent<HTMLInputElement>): void => {
        this.setState({
            value: e.target.value,
            valueError: ""
        });
    }

    private updateCode = (e: React.ChangeEvent<HTMLInputElement>): void => {
        this.setState({
            code: e.target.value,
            codeError: ""
        });
    }
}

export default GiftVoucherManagementTable;