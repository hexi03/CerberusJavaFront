import {CREATE, DELETE, GROUP, FETCHALL, FETCHNOTFOUND, FETCHONE, UPDATE} from "../actions/actions.js";

const initialState = {
  groups: {}
};
//ALARM switch inheritance
export const groupReducer = (state = initialState, action) => {
  if (action.scope === GROUP) {
    console.log(action);
    switch (action.action) {
      case FETCHALL:
        state = {...state, groups: action.groups.reduce((dictionary,index) => {dictionary[index.id] = index; return dictionary} , {}) };
        break;
      case FETCHONE:
      case UPDATE:
        state =  {...state, groups: {...Object.keys(state.groups).reduce((dictionary, key) => {
              if(state.groups[key].id != action.id)
              dictionary[state.groups[key].id] = state.groups[key];
              return dictionary;
            }, {}) }};
      case CREATE:
        state = {...state, groups: {...(state.groups)}}
        state.groups[action.group.id] = action.group;
        break;
      case DELETE:
      case FETCHNOTFOUND:
        state = {...state, groups: {...Object.keys(state.groups).reduce((dictionary, key) => {
              if(state.groups[key].id != action.id)
              dictionary[state.groups[key].id] = state.groups[key];
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

