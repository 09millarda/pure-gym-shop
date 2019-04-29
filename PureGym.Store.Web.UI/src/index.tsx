import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { Router } from "react-router-dom";
import history from "./App/history";
import { Provider } from "react-redux";
import { ReduxStore } from "./App/redux/store";

ReactDOM.render(
  <Provider store={ReduxStore}>
    <Router history={history}>
      <App />
    </Router>
  </Provider>,
  document.getElementById("root") as HTMLElement
);

// if you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();