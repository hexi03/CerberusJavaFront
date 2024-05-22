import {CREATE, DELETE, FACTORYSITE, FETCHALL, FETCHNOTFOUND, FETCHONE, UPDATE, UPDATESUPPLY} from "../actions/actions.js";

const initialState = {
  factorySites: {}
};
//ALARM switch inheritance
export const factorySiteReducer = (state = initialState, action) => {
  if (action.scope === FACTORYSITE) {
    console.log(action);
    switch (action.action) {
      case FETCHALL:
        state = {...state, factorySites: action.factorySites.reduce((dictionary,index) => {dictionary[index.id] = index; return dictionary} , {}) };
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
        alert(FACTORYSITE+" "+ FETCHNOTFOUND)
        state = {...state, factorySites: {...Object.keys(state.factorySites).reduce((dictionary, key) => {
              if(state.factorySites[key].id != action.id)
              dictionary[state.factorySites[key].id] = state.factorySites[key];
              return dictionary;
            }, {}) }};
        break;
      case UPDATESUPPLY:
        state.factorySites[action.id] = action.factorySiteSupply.suppliers
        break
      default:
        break;
    }
  }
  console.log(state);
  return state;
};
