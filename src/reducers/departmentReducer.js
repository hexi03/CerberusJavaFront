import {CREATE, DELETE, DEPARTMENT, FETCHALL, FETCHNOTFOUND, FETCHONE, UPDATE} from "../actions/actions.js";

const initialState = {
  departments: {}
};
//ALARM switch inheritance
export const departmentReducer = (state = initialState, action) => {
  if (action.scope === DEPARTMENT) {
    console.log(action);
    switch (action.action) {
      case FETCHALL:
        state = {...state, departments: action.departments };
        break;
      case FETCHONE:
      case UPDATE:
        state =  {...state, departments: {...Object.keys(state.departments).reduce((dictionary, key) => {
              if(state.departments[key].id != action.id)
              dictionary[state.departments[key].id] = state.departments[key];
              return dictionary;
            }, {}) }};
      case CREATE:
        state = {...state, departments: {...(state.departments)}}
        state.departments[action.department.id] = action.department;
        break;
      case DELETE:
      case FETCHNOTFOUND:
        state = {...state, departments: {...Object.keys(state.departments).reduce((dictionary, key) => {
              if(state.departments[key].id != action.id)
              dictionary[state.departments[key].id] = state.departments[key];
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
