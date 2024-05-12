import { thunk } from 'redux-thunk'
import rootReducer from "../reducers/rootReducer.js";
import {applyMiddleware, createStore} from "redux";

const configureStore = () => {
  const middleware = [thunk];
  const store = createStore(
      rootReducer,
      applyMiddleware(...middleware)
  );

  return store;
};

export default configureStore;
