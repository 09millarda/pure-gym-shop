import React, { useState, useEffect } from "react";
import PageTitle from "../../Layout/PageTitle/PageTitle";
import { IListingState, IReduxState } from "../../App/index";
import { fetchAllListings } from "../Store/Listings/redux/listingsActions";
import { connect } from "react-redux";
import ItemManagementTable from "../../Components/ItemManagementTable";
import { Link, Switch, Route } from "react-router-dom";
import NewItem from "./New/New";
import EditItem from "./Edit/EditItem";

interface IItemManagementDispatchProps {
  fetchAllListings: () => void;
}

interface IItemManagementStateProps {
  listings: IListingState[];
  isFetchingListings: boolean;
}

type IItemManagementProps = IItemManagementDispatchProps & IItemManagementStateProps;

function ItemManagement(props: IItemManagementProps): JSX.Element {
  useEffect(() => {
    props.fetchAllListings();
  }, []);

  return (
    <div className="row">
      <div className="col-lg-6 col-xl-8">
        <div className="card-box">
          <PageTitle
            title="ITEM MANAGEMENT"
          />
          <div className="row">
            <div className="col-12">
              <Link to="/item-management/new" className="btn btn-info mt-3">New Item</Link>
              <button className="btn btn-secondary mt-3 float-right" onClick={props.fetchAllListings}>Refresh</button>
            </div>
          </div>
          <ItemManagementTable
            items={props.listings.filter(i => i.itemType !== "Voucher").map((l): {
              itemId: number;
              name: string;
              price: number;
            } => {
              return {
                itemId: l.itemId,
                name: l.name,
                price: l.price
              };
            })}
          />
        </div>
      </div>
      <div className="col-lg-6 col-xl-4">
        <Switch>
          <Route exact={true} path="/item-management/new" component={NewItem} />
          <Route path="/item-management/edit/:itemId" component={EditItem} />
        </Switch>
      </div>
    </div>
  );
}

function mapStateToProps(state: IReduxState): IItemManagementStateProps {
  return {
    listings: state.listingsState.listings,
    isFetchingListings: state.listingsState.isFetchingListings
  };
}

function mapDispatchToProps(dispatch: any): IItemManagementDispatchProps {
  return {
    fetchAllListings: () => dispatch(fetchAllListings())
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ItemManagement);