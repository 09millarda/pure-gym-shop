import React, { useEffect } from "react";
import { Link, Switch, Route, NavLink } from "react-router-dom";
import { IGiftVoucher, IOfferVoucher, IReduxState } from "../../App/index";
import { fetchAllVouchers } from "./redux/voucherActions";
import { connect } from "react-redux";
import OfferVoucherManagement from "./Offer/OfferVoucherManagement";
import GiftVoucherManagement from "./Gift/GiftVoucherManagement";

interface IDispatchProps {
  fetchAllVouchers: () => void;
}

interface IStateProps {
  giftVouchers: IGiftVoucher[];
  offerVouchers: IOfferVoucher[];
}

type IProps = IDispatchProps & IStateProps;

function VoucherManagement(props: IProps): JSX.Element {
  useEffect(() => {
    props.fetchAllVouchers();
  }, []);

  return (
    <div className="row">
      <div className="col-12">
        <div className="card-box">
          <ul className="nav nav-tabs tabs-bordered">
            <li className="nav-item">
              <NavLink to="/voucher-management/offer" className="nav-link">OFFER VOUCHERS</NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/voucher-management/gift" className="nav-link">GIFT VOUCHERS</NavLink>
            </li>
          </ul>
          <div className="row mt-3">
            <div className="col-12">
              <button className="btn btn-secondary" onClick={props.fetchAllVouchers}>Refresh</button>
            </div>
          </div>
          <Switch>
            <Route exact={true} path="/voucher-management/offer" component={OfferVoucherManagement} />
            <Route exact={true} path="/voucher-management/gift" component={GiftVoucherManagement} />
          </Switch>
        </div>
      </div>
    </div>
  );
}

function mapStateToProps(state: IReduxState): IStateProps {
  return {
    giftVouchers: state.voucherState.vouchers.giftVouchers,
    offerVouchers: state.voucherState.vouchers.offerVouchers
  };
}

function mapDispatchToProps(dispatch: any): IDispatchProps {
  return {
    fetchAllVouchers: () => dispatch(fetchAllVouchers())
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(VoucherManagement);