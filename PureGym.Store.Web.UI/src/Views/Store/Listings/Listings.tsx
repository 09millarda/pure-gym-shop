import React, { useEffect } from "react";
import Listing from "../../../Components/Listing";
import { IListingState, IReduxState } from "../../../App/index";
import { fetchAllListings } from "./redux/listingsActions";
import { connect } from "react-redux";
import LoadingWheel from "../../../Components/LoadingWheel";
import { addToCart } from "../Cart/redux/cartActions";
import PageTitle from "../../../Layout/PageTitle/PageTitle";

interface IListingsStateProps {
  isFetchingListings: boolean;
  listings: IListingState[];
}

interface IListingsDispatchProps {
  fetchAllListings: () => void;
  addToCart: (id: number) => void;
}

type IListingsProps = IListingsStateProps & IListingsDispatchProps;

function Listings(props: IListingsProps): JSX.Element {
  useEffect(() => {
    props.fetchAllListings();
  }, []);

  function addToCart(id: number): void {
    props.addToCart(id);
  }

  return (
    <div className="card-box">
      <PageTitle
        title="LISTINGS"
      />
      <div className="row">
        {
          props.listings.map((listing, i) =>
            <Listing
              key={i}
              description={listing.description}
              imgUrl={listing.imageUri}
              price={listing.price}
              title={listing.name}
              addToCart={addToCart}
              id={listing.itemId}
            />
          )
        }
        {
          props.listings.length === 0 && !props.isFetchingListings &&
          <p className="col-12 mt-3">No Listings</p>
        }
        {
          props.isFetchingListings &&
          <div className="col-12">
            <LoadingWheel />
          </div>
        }
      </div>
    </div>
  );
}

function mapStateToProps(state: IReduxState): IListingsStateProps {
  return {
    isFetchingListings: state.listingsState.isFetchingListings,
    listings: state.listingsState.listings
  };
}

function mapDispatchToProps(dispatch: any): IListingsDispatchProps {
  return {
    fetchAllListings: () => dispatch(fetchAllListings()),
    addToCart: (id: number) => dispatch(addToCart(id))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Listings);