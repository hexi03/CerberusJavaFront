import {CREATE, DELETE, FETCHALL, FETCHNOTFOUND, FETCHONE, REPORT, UPDATE} from "../actions/actions.js";

const initialState = {
  reports: {}
};
//ALARM switch inheritance
export const reportReducer = (state = initialState, action) => {
  if (action.scope === REPORT) {
    console.log(action);
    switch (action.action) {
      case FETCHALL:
        state = {...state, reports: action.reports.reduce((dictionary,index) => {dictionary[index.id] = index; return dictionary} , {}) };
        break;
      case FETCHONE:
      case UPDATE:
        state =  {...state, reports: {...Object.keys(state.reports).reduce((dictionary, key) => {
              if(state.reports[key].id != action.report.id)
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
              if(state.reports[key].id != action.report.id)
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

