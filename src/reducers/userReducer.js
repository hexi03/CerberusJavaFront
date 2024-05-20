import {CREATE, DELETE, USER, FETCHALL, FETCHNOTFOUND, FETCHONE, UPDATE} from "../actions/actions.js";

const initialState = {
  users: {}
};
//ALARM switch inheritance
export const userReducer = (state = initialState, action) => {
  console.log(action);
  if (action.scope === USER) {
    console.log(action);
    switch (action.action) {
      case FETCHALL:
        state = {...state, users: action.users.reduce((dictionary,index) => {dictionary[index.id] = index; return dictionary} , {}) };
        break;
      case FETCHONE:
      case UPDATE:
        state =  {...state, users: {...Object.keys(state.users).reduce((dictionary, key) => {
              if(state.users[key].id != action.id)
              dictionary[state.users[key].id] = state.users[key];
              return dictionary;
            }, {}) }};
      case CREATE:
        state = {...state, users: {...(state.users)}}
        state.users[action.user.id] = action.user;
        break;
      case DELETE:
      case FETCHNOTFOUND:
        state = {...state, users: {...Object.keys(state.users).reduce((dictionary, key) => {
              if(state.users[key].id != action.id)
              dictionary[state.users[key].id] = state.users[key];
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

