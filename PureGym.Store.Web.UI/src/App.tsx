import React, { Component } from "react";
import SideBar from "./Layout/SideBar/SideBar";
import BreadcrumbBar from "./Layout/BreadcrumbBar/BreadcrumbBar";
import "./App/assets/css/bootstrap.min.css";
import "./App/assets/css/style.css";
import "./App/assets/fonts/fontawesome-webfont.svg";
import { Switch, Route, Redirect } from "react-router-dom";
import Store from "./Views/Store/Store";
import Checkout from "./Views/Checkout/Checkout";
import { ICartListingState } from "./App/index";
import { updateCart } from "./Views/Store/Cart/redux/cartActions";
import { getCartCookie } from "./App/common/cookieManager";
import { connect } from "react-redux";
import ItemManagement from "./Views/ItemManagement/ItemManagement";
import VoucherManagement from "./Views/VoucherManagement/VoucherManagement";
import SubSetsManagement from "./Views/SubsetsManagement/SubsetsManagement";

interface IAppDispatchProps {
  setCart: (cartItems: ICartListingState[]) => void;
}

type IAppProps = IAppDispatchProps;

class App extends Component<IAppProps> {
  public componentDidMount(): void {
    const cartListings: ICartListingState[] = getCartCookie();
    this.props.setCart(cartListings);
  }

  public render(): JSX.Element {
    return (
      <div id="wrapper">
        <SideBar />
        <div className="content-page">
          <div
            className="content"
            style={{
              marginTop: "0px"
            }}
          >
            <div className="container-fluid">
              <BreadcrumbBar />
              <Switch>
                <Route path="/subset-management" component={SubSetsManagement} />
                <Route path="/item-management" component={ItemManagement} />
                <Redirect exact={true} from="/voucher-management" to="/voucher-management/offer" />
                <Route path="/voucher-management" component={VoucherManagement} />
                <Route exact={true} path="/checkout" component={Checkout} />
                <Route exact={true} path="/" component={Store} />
              </Switch>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch: any): IAppDispatchProps {
  return {
    setCart: (items: ICartListingState[]) => dispatch(updateCart(items))
  };
}

export default connect(null, mapDispatchToProps)(App);
