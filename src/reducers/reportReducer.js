import {CREATE, DELETE, REPORT, FETCHALL, FETCHNOTFOUND, FETCHONE, UPDATE} from "../actions/actions.js";

const initialState = {
  reports: {}
};
//ALARM switch inheritance
export const reportReducer = (state = initialState, action) => {
  if (action.scope === REPORT) {
    console.log(action);
    switch (action.action) {
      case FETCHALL:
        state = {...state, reports: action.reports };
        break;
      case FETCHONE:
      case UPDATE:
        state =  {...state, reports: {...Object.keys(state.reports).reduce((dictionary, key) => {
              if(state.reports[key].id != action.id)
              dictionary[state.reports[key].id] = state.reports[key];
              return dictionary;
            }, {}) }};
      case CREATE:
        state = {...state, reports: {...(state.reports)}}
        state.reports[action.report.id] = action.report;
        break;
      case DELETE:
      case FETCHNOTFOUND:
        state = {...state, reports: {...Object.keys(state.reports).reduce((dictionary, key) => {
              if(state.reports[key].id != action.id)
              dictionary[state.reports[key].id] = state.reports[key];
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

