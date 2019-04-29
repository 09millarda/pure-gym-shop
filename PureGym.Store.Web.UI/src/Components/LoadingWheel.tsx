import React from "react";
import "./LoadingWheel.css";

function LoadingWheel(): JSX.Element {
  return (
    <div className="row">
      <div className="col-12 text-center">
        <div className="loader"></div>
      </div>
    </div>
  );
}

export default LoadingWheel;