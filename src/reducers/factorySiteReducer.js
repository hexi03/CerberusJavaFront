import {CREATE, DELETE, FACTORYSITE, FETCHALL, FETCHNOTFOUND, FETCHONE, UPDATE} from "../actions/actions.js";

const initialState = {
  factorySites: {}
};
//ALARM switch inheritance
export const factorySiteReducer = (state = initialState, action) => {
  if (action.scope === FACTORYSITE) {
    console.log(action);
    switch (action.action) {
      case FETCHALL:
        state = {...state, factorySites: action.factorySites };
        break;
      case FETCHONE:
      case UPDATE:
        state =  {...state, factorySites: {...Object.keys(state.factorySites).reduce((dictionary, key) => {
              if(state.factorySites[key].id != action.id)
              dictionary[state.factorySites[key].id] = state.factorySites[key];
              return dictionary;
            }, {}) }};
      case CREATE:
        state = {...state, factorySites: {...(state.factorySites)}}
        state.factorySites[action.factorySite.id] = action.factorySite;
        break;
      case DELETE:
      case FETCHNOTFOUND:
        state = {...state, factorySites: {...Object.keys(state.factorySites).reduce((dictionary, key) => {
              if(state.factorySites[key].id != action.id)
              dictionary[state.factorySites[key].id] = state.factorySites[key];
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
