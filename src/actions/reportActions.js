import {API_URI, API_ORIGIN} from "../consts.js";
import axios from "axios";
import {
    CREATE,
    DELETE,
    REPORT,
    FETCHALL, OK,
    FETCHNOTFOUND,
    FETCHONE,
    onErrorAction,
    UPDATE
} from "./actions.js";
import {ReportBuilder} from "../builders/reportBuilder.js";


export const fetchAllReportAction = () => {
    return async (dispatch) => {
        const authToken = localStorage.getItem('authToken')
        axios({
            method: 'get',
            url: API_URI + "/report/fetch",
            timeout: 4000,    // 4 seconds timeout
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Origin':API_ORIGIN
            }
        })
            .then(response => dispatch(onFetchAllReportAction(response.data)))
            .catch(error => {
                dispatch(onErrorAction(error.message))
            })
    };

}


export const fetchAllReportActionByQuery = (reportQuery) => {
    return async (dispatch) => {
        const authToken = localStorage.getItem('authToken')
        axios({
            method: 'get',
            url: API_URI + "/report/fetch",
            timeout: 4000,    // 4 seconds timeout
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Origin':API_ORIGIN
            },
            params: new URLSearchParams({
                ...reportQuery
            })
        })
            .then(response => dispatch(onFetchAllReportAction(response.data)))
            .catch(error => {
                dispatch(onErrorAction(error.message))
            })
    };

}

export const fetchOneReportAction = (id) =>{
return async (dispatch) => {
    const authToken = localStorage.getItem('authToken')
    axios({
        method: 'get',
        url: API_URI + "/report/fetch",
        timeout: 4000,    // 4 seconds timeout
        headers: {
            'Authorization': `Bearer ${authToken}`,
            'Origin':API_ORIGIN
        },
        params: new URLSearchParams({
            id: id,
        })
    })
        .then(response => dispatch(onFetchOneReportAction(response.data[0])))
        .catch(error => {
            console.log(error)
            if (error.response && error.response.status === 404){
                dispatch(onFetchOneNotFoundReportAction(id))
            }else{
                dispatch(onErrorAction(error.message))
            }
        })
}
}



export const createReportAction = (report) =>{
    console.log("createReportAction")
    console.log(report)
return async (dispatch) => {
    console.log("createReportAction inside")
    const authToken = localStorage.getItem('authToken')
    axios({
        method: 'post',
        url: API_URI + "/report/create",
        timeout: 4000,    // 4 seconds timeout
        headers: {
            'Authorization': `Bearer ${authToken}`,
            'Origin':API_ORIGIN
        },
        data: {
            departmentId : report.departmentId,
            name : report.name
        }
    })
        .then(response => {report.id = response.data; dispatch(onCreateReportAction(report))})
        .catch(error => {
            dispatch(onErrorAction(error.message))
        })
}}



export const updateReportAction = (report) =>{
return async (dispatch) => {
    const authToken = localStorage.getItem('authToken')
    axios({
        method: 'put',
        url: API_URI + "/report/update",
        timeout: 4000,    // 4 seconds timeout
        headers: {
            'Authorization': `Bearer ${authToken}`,
            'Origin':API_ORIGIN
        },
        data: {
            id : report.id,
            departmentId : report.departmentId,
            name : report.name
        }
    }).then(response => dispatch(onUpdateReportAction(report)))
        .catch(error => {
            dispatch(onErrorAction(error.message))
        })

}}



export const deleteReportAction = (report) => {
return async (dispatch) => {
    console.log("deleteReportAction");
    console.log(report);
    const authToken = localStorage.getItem('authToken')
    axios({
        method: 'delete',
        url: API_URI + "/report/delete",
        timeout: 4000,    // 4 seconds timeout
        headers: {
            'Authorization': `Bearer ${authToken}`,
            'Origin':API_ORIGIN
        },
        params: new URLSearchParams({
            id: report.id,
        })
    })
        .then(response => dispatch(onDeleteReportAction(report.id)))
        .catch(error => {
            dispatch(onErrorAction(error.message))
        })
}}

//SYNC
export const onFetchAllReportAction = (reports) => {return {
    scope: REPORT,
    action: FETCHALL,
    type: OK,
    reports: reports.map((wh) => ((new ReportBuilder()).setId(wh.id.id).setDepartmentId(wh.departmentId.id).setName(wh.name).build()))
}};

export const onFetchOneReportAction = (wh) => {return {
    scope: REPORT,
    action: FETCHONE,
    type: OK,
    report: (new ReportBuilder()).setId(wh.id.id).setDepartmentId(wh.departmentId.id).setName(wh.name).build()
}};

export const onFetchOneNotFoundReportAction = (id) => ({
    scope: REPORT,
    type: OK,
    action: FETCHNOTFOUND,
    id: id.id
});


export const onCreateReportAction = (report) => ({
    scope: REPORT,
    action: CREATE,
    type: OK,
    report: report
});

export const onUpdateReportAction = (report) => ({
    scope: REPORT,
    action: UPDATE,
    type: OK,
    report: report
});

export const onDeleteReportAction = (id) => ({
    scope: REPORT,
    action: DELETE,
    type: OK,
    id: id.id
});
