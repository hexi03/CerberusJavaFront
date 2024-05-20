// rootReducer.js
import { combineReducers } from 'redux';
import {departmentReducer} from "./departmentReducer.js";
import {factorySiteReducer} from "./factorySiteReducer.js";
import {wareHouseReducer} from "./wareHouseReducer.js";
import {itemReducer} from "./itemReducer.js";
import {productReducer} from "./productReducer.js";
import {userReducer} from "./userReducer.js";
import {groupReducer} from "./groupReducer.js";
import {reportReducer} from "./reportReducer.js";
import { factorySiteStateReducer } from './factorySiteStateReducer.js';
import { wareHouseStateReducer } from './wareHouseStateReducer.js';


const rootReducer = combineReducers({
  department: departmentReducer,
  factorySite: factorySiteReducer,
  wareHouse: wareHouseReducer,
  item: itemReducer,
  product: productReducer,
  user: userReducer,
  group: groupReducer,
  report: reportReducer,
  factorySiteState: factorySiteStateReducer,
  wareHouseState: wareHouseStateReducer
});


export default rootReducer;
