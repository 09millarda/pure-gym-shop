import React from "react";
import { IListing } from "../App/index";
import { faCartPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function Listing(props: IListing): JSX.Element {
  return (
    <div className="col-sm-4">
      <div className="gal-detail thumb">
        <div
          style={{
            backgroundImage: `url(${props.imgUrl})`,
            backgroundRepeat: "no-repeat",
            width: "100%",
            height: "300px",
            backgroundSize: "100% auto"
          }}
        />
        <h4 className="text-center">{props.title}</h4><p className="text-muted text-center">£{props.price.toFixed(2)}</p>
        <div className="ga-border"></div>
        <p>{props.description}</p>
        <button
          className="btn btn-info float-right mt-2"
          onClick={() => props.addToCart(props.id)}
        >
          <FontAwesomeIcon
            icon={faCartPlus}
          />
          <span className="ml-2">Add</span>
        </button>
        <div className="clearfix"></div>
      </div>
    </div>
  );
}

export default Listing;