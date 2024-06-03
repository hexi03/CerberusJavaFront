import {CREATE, DELETE, FETCHALL, FETCHNOTFOUND, FETCHONE, PRODUCT, UPDATE} from "../actions/actions.js";

const initialState = {
  products: {}
};
//ALARM switch inheritance
export const productReducer = (state = initialState, action) => {
  if (action.scope === PRODUCT) {
    console.log(action);
    switch (action.action) {
      case FETCHALL:
        state = {...state, products: action.products.reduce((dictionary,index) => {dictionary[index.id] = index; return dictionary} , {}) };
        break;
      case FETCHONE:
      case UPDATE:
        state =  {...state, products: {...Object.keys(state.products).reduce((dictionary, key) => {
              if(state.products[key].id != action.id)
              dictionary[state.products[key].id] = state.products[key];
              return dictionary;
            }, {}) }};
      case CREATE:
        state = {...state, products: {...(state.products)}}
        state.products[action.product.id] = action.product;
        break;
      case DELETE:
      case FETCHNOTFOUND:
        state = {...state, products: {...Object.keys(state.products).reduce((dictionary, key) => {
              if(state.products[key].id != action.id)
              dictionary[state.products[key].id] = state.products[key];
              return dictionary;
            }, {}) }};
        break;
      default:
        break;
    }
  }
  console.log(state);
  return state;
};

