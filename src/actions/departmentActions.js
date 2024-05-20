import {API_URI, API_ORIGIN} from "../consts.js";
import axios from "axios";
import {
    CREATE,
    DELETE,
    DEPARTMENT,
    FETCHALL, OK,
    FETCHNOTFOUND,
    FETCHONE,
    onErrorAction,
    UPDATE
} from "./actions.js";
import {DepartmentBuilder} from "../builders/departmentBuilder.js";
import { updateToken } from "./authActions.js";

export const fetchAllDepartmentAction = () => {
    return async (dispatch) => {
        var authToken = localStorage.getItem('authToken')
        axios({
            method: 'get',
            crossDomain: true,
            url: API_URI + "/department/fetch",
            timeout: 4000,    // 4 seconds timeout
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        })
            .then(response => dispatch(onFetchAllDepartmentAction(response.data)))
            .catch(error => {
                dispatch(onErrorAction(error.message))
            }).finally(_ => updateToken())
    };

}

export const fetchOneDepartmentAction = (id) =>{
return async (dispatch) => {
    var authToken = localStorage.getItem('authToken')
    axios({
        method: 'get',
        crossDomain: true,
        url: API_URI + "/department/fetch",
        timeout: 4000,    // 4 seconds timeout
        headers: {
            'Authorization': `Bearer ${authToken}`
        },
        params: new URLSearchParams({
            id: id,
        })
    })
        .then(response => dispatch(onFetchOneDepartmentAction(response.data[0])))
            .catch(error => {
            console.log(error)
            if (error.response && error.response.status === 404){
                dispatch(onFetchOneNotFoundDepartmentAction(id))
            }else{
                dispatch(onErrorAction(error.message))
            }
        }).finally(_ => updateToken())
}
}



export const createDepartmentAction = (department) =>{
    console.log("createDepartmentAction")
    console.log(department)
return async (dispatch) => {
    console.log("createDepartmentAction inside")
    var authToken = localStorage.getItem('authToken')
    axios({
        method: 'post',
        url: API_URI + "/department/create",
        timeout: 4000,    // 4 seconds timeout
        headers: {
            'Authorization': `Bearer ${authToken}`,
            'Origin':API_ORIGIN
        },
        data: {
            name : department.name
        }
    })
        .then(response => {department.id = response.data; dispatch(onCreateDepartmentAction(department))})
            .catch(error => {
            dispatch(onErrorAction(error.message))
        }).finally(_ => updateToken())
}}



export const updateDepartmentAction = (department) =>{
return async (dispatch) => {
    var authToken = localStorage.getItem('authToken')
    axios({
        method: 'put',
        url: API_URI + "/department/update",
        timeout: 4000,    // 4 seconds timeout
        headers: {
            'Authorization': `Bearer ${authToken}`,
            'Origin':API_ORIGIN
        },
        data: {
            id : department.id,
            name : department.name
        }
    }).then(response => dispatch(onUpdateDepartmentAction(department)))
            .catch(error => {
            dispatch(onErrorAction(error.message))
        }).finally(_ => updateToken())

}}



export const deleteDepartmentAction = (department) => {
return async (dispatch) => {
    console.log("deleteDepartmentAction");
    console.log(department);
    var authToken = localStorage.getItem('authToken')
    axios({
        method: 'delete',
        url: API_URI + "/department/delete",
        timeout: 4000,    // 4 seconds timeout
        headers: {
            'Authorization': `Bearer ${authToken}`,
            'Origin':API_ORIGIN
        },
        params: new URLSearchParams({
            id: department.id,
        })
    })
        .then(response => dispatch(onDeleteDepartmentAction(department.id)))
            .catch(error => {
            dispatch(onErrorAction(error.message))
        }).finally(_ => updateToken())
}}

//SYNC
export const onFetchAllDepartmentAction = (departments) => {return {
    scope: DEPARTMENT,
    action: FETCHALL,
    type: OK,
    departments: departments.map((dep) => ((new DepartmentBuilder()).setId(dep.id.id).setName(dep.name).build()))
}};

export const onFetchOneDepartmentAction = (department) => {console.log("onFetchOneDepartmentAction");console.log(department);return {
    scope: DEPARTMENT,
    action: FETCHONE,
    type: OK,
    department: (new DepartmentBuilder()).setId(department.id.id).setName(department.name).build()
}};

export const onFetchOneNotFoundDepartmentAction = (id) => ({
    scope: DEPARTMENT,
    type: OK,
    action: FETCHNOTFOUND,
    id: id.id
});


export const onCreateDepartmentAction = (department) => ({
    scope: DEPARTMENT,
    action: CREATE,
    type: OK,
    department: department
});

export const onUpdateDepartmentAction = (department) => ({
    scope: DEPARTMENT,
    action: UPDATE,
    type: OK,
    department: department
});

export const onDeleteDepartmentAction = (id) => ({
    scope: DEPARTMENT,
    action: DELETE,
    type: OK,
    id: id.id
});
