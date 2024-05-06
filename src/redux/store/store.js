import { applyMiddleware, combineReducers, createStore } from "redux";
import { thunk } from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";

import { productReducer } from "../reducers/productReducer";

const rootReducer = combineReducers({
  products: productReducer
});

const middlewares = [thunk];

const middleware = composeWithDevTools(applyMiddleware(...middlewares));

const initalState = {};
const store = createStore(rootReducer, initalState, middleware);

export default store;
