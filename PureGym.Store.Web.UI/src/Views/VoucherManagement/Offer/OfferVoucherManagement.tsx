import React, { useEffect } from "react";
import { IOfferVoucher, IReduxState, ISubsetGroup } from "../../../App/index";
import { fetchAllVouchers } from "../redux/voucherActions";
import { connect } from "react-redux";
import OfferVoucherManagementTable from "../../../Components/OfferVoucherManagementTable";
import { fetchAllSubsets } from "../../SubsetsManagement/redux/subsetActions";

interface IOfferVoucherManagementDispatchProps {
  fetchVouchers: () => void;
  fetchSubsets: () => void;
}

interface IOfferVoucherManagementPropsStateProps {
  offerVouchers: IOfferVoucher[];
  subsets: ISubsetGroup[];
  isFetchingVouchers: boolean;
}

type IOfferVoucherManagementProps = IOfferVoucherManagementDispatchProps & IOfferVoucherManagementPropsStateProps;

function OfferVoucherManagement(props: IOfferVoucherManagementProps): JSX.Element {
  useEffect(() => {
    props.fetchSubsets();
  }, []);

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
                <th>Min. Basket Price (£)</th>
                <th>Item Subset</th>
                <th></th>
              </tr>
            </thead>
            <OfferVoucherManagementTable
              subsets={props.subsets}
              offerVouchers={props.offerVouchers}
              fetchVouchers={props.fetchVouchers}
              isLoadingVouchers={props.isFetchingVouchers}
            />
          </table>
        </div>
      </div>
    </div>
  );
}

function mapStateToProps(state: IReduxState): IOfferVoucherManagementPropsStateProps {
  return {
    offerVouchers: state.voucherState.vouchers.offerVouchers,
    subsets: state.subsetState.subsets,
    isFetchingVouchers: state.voucherState.isFetchingVouchers
  };
}

function mapDispatchToProps(dispatch: any): IOfferVoucherManagementDispatchProps {
  return {
    fetchVouchers: () => dispatch(fetchAllVouchers()),
    fetchSubsets: () => dispatch(fetchAllSubsets())
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(OfferVoucherManagement);