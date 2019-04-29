import { createStore, applyMiddleware, Store, AnyAction } from "redux";
import rootReducer from "./rootReducer";
import { IReduxState } from "../index";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";

function configureStore(): Store<IReduxState, AnyAction> {
  return createStore(
    rootReducer,
    composeWithDevTools(
      applyMiddleware(thunk)
    )
  );
}

export const ReduxStore: Store<IReduxState, AnyAction> = configureStore();