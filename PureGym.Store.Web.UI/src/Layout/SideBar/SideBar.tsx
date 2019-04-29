import React from "react";
import SideBarMenuOption from "./SideBarMenuOption";
import { faTags, faStoreAlt, faDolly, faCashRegister, faLayerGroup } from "@fortawesome/free-solid-svg-icons";

function SideBar(): JSX.Element {
  return (
    <div
      className="left side-menu"
      style={{
        top: "0px"
      }}
    >
      <div
        style={{
          position: "relative",
          overflow: "inherit",
          width: "auto"
        }}
      >
        <div
          className="sidebar-inner"
          style={{
            overflow: "hidden",
            width: "auto"
          }}
        >
          <div id="sidebar-menu">
            <ul>
              <li className="menu-title">Store</li>
              <SideBarMenuOption
                title="Store"
                logo={faStoreAlt}
                rootUrl="/"
              />
              <SideBarMenuOption
                title="Checkout"
                logo={faCashRegister}
                rootUrl="/checkout"
              />
              <li className="menu-title">Admin</li>
              <SideBarMenuOption
                title="Item Management"
                logo={faDolly}
                rootUrl="/item-management"
                exact={false}
              />
              <SideBarMenuOption
                title="Subset Management"
                logo={faLayerGroup}
                rootUrl="/subset-management"
                exact={false}
              />
              <SideBarMenuOption
                title="Voucher Management"
                logo={faTags}
                exact={false}
                rootUrl="/voucher-management"
              />
            </ul>
            <div className="clearfix"></div>
          </div>
          <div className="clearfix"></div>
        </div>
      </div>
    </div>
  );
}

export default SideBar;