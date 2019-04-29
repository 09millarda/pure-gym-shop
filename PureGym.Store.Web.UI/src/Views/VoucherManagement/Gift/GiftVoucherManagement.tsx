import React from "react";
import { IGiftVoucher, IReduxState } from "../../../App/index";
import { fetchAllVouchers } from "../redux/voucherActions";
import { connect } from "react-redux";
import GiftVoucherManagementTable from "../../../Components/GiftVoucherManagementTable";

interface IGiftVoucherManagementDispatchProps {
    fetchVouchers: () => void;
}

interface IGiftVoucherManagementStateProps {
    giftVouchers: IGiftVoucher[];
    isFetchingVouchers: boolean;
}

type IGiftVoucherManagementProps = IGiftVoucherManagementDispatchProps & IGiftVoucherManagementStateProps;

function GiftVoucherManagement(props: IGiftVoucherManagementProps): JSX.Element {
    return (
        <div className="row mt-3">
            <div className="col-12">
                <div className="table-responsive">
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th>Voucher Id</th>
                                <th>Code</th>
                                <th>Value (£)</th>
                                <th></th>
                            </tr>
                        </thead>
                        <GiftVoucherManagementTable
                            fetchVouchers={props.fetchVouchers}
                            giftVouchers={props.giftVouchers}
                            isFetchingVouchers={props.isFetchingVouchers}
                        />
                    </table>
                </div>
            </div>
        </div>
    );
}

function mapStateToProps(state: IReduxState): IGiftVoucherManagementStateProps {
    return {
        giftVouchers: state.voucherState.vouchers.giftVouchers,
        isFetchingVouchers: state.voucherState.isFetchingVouchers
    };
}

function mapDispatchProps(dispatch: any): IGiftVoucherManagementDispatchProps {
    return {
        fetchVouchers: () => dispatch(fetchAllVouchers())
    };
}

export default connect(mapStateToProps, mapDispatchProps)(GiftVoucherManagement);