import {all} from "redux-saga/effects"
import {countWatcher} from "./countSaga";
import {userWatcher} from "./userSaga";
import {departmentWatcher} from "./departmentSaga.js";


export function combineWorker(actions){
    function* worker(action){
        let task = NaN;
        for (const [act, gen] of Object.entries(actions)) {
            if (act === action.action){
                task = gen(action)
            }
        }

        if(task != NaN){
            for (const eff of task) {
                yield task;
            }
        }
    };
    return worker;
}
export function* rootWatcher() {
    yield all([departmentWatcher(), factorySiteWatcher(), wareHouseWatcher])
}