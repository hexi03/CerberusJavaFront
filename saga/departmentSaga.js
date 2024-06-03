import {ASYNC, DEPARTMENT, onFetchDepartmentAction} from "../actions/departmentActions.js";
import {call, put, takeEvery} from "redux-saga/effects"
import {combineWorker} from "./saga.js";
import {API_URI} from "../consts.js";
import axios from "axios";

function* fetchAllAsync(action) {
    const authToken = localStorage.getItem('authToken')
    const { data } = yield call(axios({
        method: 'get',
        url: API_URI + "/Department/fetch",
        timeout: 4000,    // 4 seconds timeout
        headers: {
            'token': `Bearer ${authToken}`,
        },
        // data: {
        //     firstName: 'David',
        //     lastName: 'Pollock'
        // }
    }));
    if (data.){}
    yield put(onFetchDepartmentAction([data.departments]))
}

function* fetchOneAsync(action) {
    yield undefined;
}

function* createAsync(action) {
    yield undefined;
}

function* updateAsync(action) {
    yield undefined;
}

function* deleteAsync(action) {
    yield undefined;
}

const departmentActions = {
    FETCHALL: fetchAllAsync,
    FETCHONE: fetchOneAsync,
    CREATE: createAsync,
    UPDATE: updateAsync,
    DELETE: deleteAsync
};

export function* departmentWatcher() {
    yield takeEvery(action => action.type === ASYNC && action.scope === DEPARTMENT, combineWorker(departmentActions))
}
