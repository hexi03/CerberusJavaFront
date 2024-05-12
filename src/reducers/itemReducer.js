import {CREATE, DELETE, ITEM, FETCHALL, FETCHNOTFOUND, FETCHONE, UPDATE} from "../actions/actions.js";

const initialState = {
  items: {}
};
//ALARM switch inheritance
export const itemReducer = (state = initialState, action) => {
  if (action.scope === ITEM) {
    console.log(action);
    switch (action.action) {
      case FETCHALL:
        state = {...state, items: action.items };
        break;
      case FETCHONE:
      case UPDATE:
        state =  {...state, items: {...Object.keys(state.items).reduce((dictionary, key) => {
              if(state.items[key].id != action.id)
              dictionary[state.items[key].id] = state.items[key];
              return dictionary;
            }, {}) }};
      case CREATE:
        state = {...state, items: {...(state.items)}}
        state.items[action.item.id] = action.item;
        break;
      case DELETE:
      case FETCHNOTFOUND:
        state = {...state, items: {...Object.keys(state.items).reduce((dictionary, key) => {
              if(state.items[key].id != action.id)
              dictionary[state.items[key].id] = state.items[key];
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

