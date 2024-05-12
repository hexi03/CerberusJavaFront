import {CREATE, DELETE, WAREHOUSE, FETCHALL, FETCHNOTFOUND, FETCHONE, UPDATE} from "../actions/actions.js";

const initialState = {
  wareHouses: {}
};
//ALARM switch inheritance
export const wareHouseReducer = (state = initialState, action) => {
  if (action.scope === WAREHOUSE) {
    console.log(action);
    switch (action.action) {
      case FETCHALL:
        state = {...state, wareHouses: action.wareHouses };
        break;
      case FETCHONE:
      case UPDATE:
        state =  {...state, wareHouses: {...Object.keys(state.wareHouses).reduce((dictionary, key) => {
              if(state.wareHouses[key].id != action.id)
              dictionary[state.wareHouses[key].id] = state.wareHouses[key];
              return dictionary;
            }, {}) }};
      case CREATE:
        state = {...state, wareHouses: {...(state.wareHouses)}}
        state.wareHouses[action.wareHouse.id] = action.wareHouse;
        break;
      case DELETE:
      case FETCHNOTFOUND:
        state = {...state, wareHouses: {...Object.keys(state.wareHouses).reduce((dictionary, key) => {
              if(state.wareHouses[key].id != action.id)
              dictionary[state.wareHouses[key].id] = state.wareHouses[key];
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
