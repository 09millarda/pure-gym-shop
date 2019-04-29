import { ISideBarMenuOption } from "../../App/index";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NavLink as Link } from "react-router-dom";

function SideBarMenuOption(option: ISideBarMenuOption): JSX.Element {
  return (
    <li>
      <Link exact={option.exact == null ? true : option.exact} to={option.rootUrl}>
        <FontAwesomeIcon
          icon={option.logo}
        />
        <span className="ml-3">{option.title}</span>
      </Link>
    </li>
  );
}

export default SideBarMenuOption;