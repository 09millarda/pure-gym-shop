import React from "react";
import Listings from "./Listings/Listings";
import Cart from "./Cart/Cart";

function Store(): JSX.Element {
  return (
    <div className="row">
      <div className="col-lg-7 col-xl-8">
        <Listings />
      </div>
      <div className="col-lg-5 col-xl-4">
        <Cart />
      </div>
    </div>
  );
}

export default Store;