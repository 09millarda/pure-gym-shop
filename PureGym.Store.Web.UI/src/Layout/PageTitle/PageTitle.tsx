import React from "react";

interface IPageTitleProps {
  title: string;
}

function PageTitle(props: IPageTitleProps): JSX.Element {
  return (
    <ul className="nav nav-tabs tabs-bordered">
      <li className="nav-item">
        <a className="nav-link active">{props.title}</a>
      </li>
    </ul>
  );
}

export default PageTitle;