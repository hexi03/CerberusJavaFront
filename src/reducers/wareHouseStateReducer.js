import { FETCHNOTFOUND, FETCHONE, WAREHOUSESTATE } from "../actions/actions.js";

const initialState = {
  states: {}
};
//ALARM switch inheritance
export const wareHouseStateReducer = (state = initialState, action) => {
  if (action.scope === WAREHOUSESTATE) {
    console.log(action);
    switch (action.action) {
      // case FETCHALL:
      //   state = {...state, states: action.states };
      //   break;
      case FETCHONE:
        state =  {...state, states: {...Object.keys(state.states).reduce((dictionary, key) => {
              if(state.states[key].id != action.state.id)
              dictionary[state.states[key].id] = state.states[key];
              return dictionary;
            }, {}) }};
        state = {...state, states: {...(state.states)}}
        state.states[action.state.id] = action.state;
        break;
      case FETCHNOTFOUND:
        state = {...state, states: {...Object.keys(state.states).reduce((dictionary, key) => {
              if(state.states[key].id != action.state.id)
              dictionary[state.states[key].id] = state.states[key];
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

