import {API_URI, API_ORIGIN} from "../consts.js";
import axios from "axios";
import {
    CREATE,
    DELETE,
    WAREHOUSE,
    FETCHALL, OK,
    FETCHNOTFOUND,
    FETCHONE,
    onErrorAction,
    UPDATE
} from "./actions.js";
import {WareHouseBuilder} from "../builders/wareHouseBuilder.js";


export const fetchAllWareHouseAction = () => {
    return async (dispatch) => {
        const authToken = localStorage.getItem('authToken')
        axios({
            method: 'get',
            url: API_URI + "/warehouse/fetch",
            timeout: 4000,    // 4 seconds timeout
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Origin':API_ORIGIN
            }
        })
            .then(response => dispatch(onFetchAllWareHouseAction(response.data)))
            .catch(error => {
                dispatch(onErrorAction(error.message))
            })
    };

}

export const fetchOneWareHouseAction = (id) =>{
return async (dispatch) => {
    const authToken = localStorage.getItem('authToken')
    axios({
        method: 'get',
        url: API_URI + "/warehouse/fetch",
        timeout: 4000,    // 4 seconds timeout
        headers: {
            'Authorization': `Bearer ${authToken}`,
            'Origin':API_ORIGIN
        },
        params: new URLSearchParams({
            id: id,
        })
    })
        .then(response => dispatch(onFetchOneWareHouseAction(response.data[0])))
        .catch(error => {
            console.log(error)
            if (error.response && error.response.status === 404){
                dispatch(onFetchOneNotFoundWareHouseAction(id))
            }else{
                dispatch(onErrorAction(error.message))
            }
        })
}
}



export const createWareHouseAction = (wareHouse) =>{
    console.log("createWareHouseAction")
    console.log(wareHouse)
return async (dispatch) => {
    console.log("createWareHouseAction inside")
    const authToken = localStorage.getItem('authToken')
    axios({
        method: 'post',
        url: API_URI + "/warehouse/create",
        timeout: 4000,    // 4 seconds timeout
        headers: {
            'Authorization': `Bearer ${authToken}`,
            'Origin':API_ORIGIN
        },
        data: {
            departmentId : wareHouse.departmentId,
            name : wareHouse.name
        }
    })
        .then(response => {wareHouse.id = response.data; dispatch(onCreateWareHouseAction(wareHouse))})
        .catch(error => {
            dispatch(onErrorAction(error.message))
        })
}}



export const updateWareHouseAction = (wareHouse) =>{
return async (dispatch) => {
    const authToken = localStorage.getItem('authToken')
    axios({
        method: 'put',
        url: API_URI + "/warehouse/update",
        timeout: 4000,    // 4 seconds timeout
        headers: {
            'Authorization': `Bearer ${authToken}`,
            'Origin':API_ORIGIN
        },
        data: {
            id : wareHouse.id,
            departmentId : wareHouse.departmentId,
            name : wareHouse.name
        }
    }).then(response => dispatch(onUpdateWareHouseAction(wareHouse)))
        .catch(error => {
            dispatch(onErrorAction(error.message))
        })

}}



export const deleteWareHouseAction = (wareHouse) => {
return async (dispatch) => {
    console.log("deleteWareHouseAction");
    console.log(wareHouse);
    const authToken = localStorage.getItem('authToken')
    axios({
        method: 'delete',
        url: API_URI + "/warehouse/delete",
        timeout: 4000,    // 4 seconds timeout
        headers: {
            'Authorization': `Bearer ${authToken}`,
            'Origin':API_ORIGIN
        },
        params: new URLSearchParams({
            id: wareHouse.id,
        })
    })
        .then(response => dispatch(onDeleteWareHouseAction(wareHouse.id)))
        .catch(error => {
            dispatch(onErrorAction(error.message))
        })
}}

//SYNC
export const onFetchAllWareHouseAction = (wareHouses) => {return {
    scope: WAREHOUSE,
    action: FETCHALL,
    type: OK,
    wareHouses: wareHouses.map((wh) => ((new WareHouseBuilder()).setId(wh.id.id).setDepartmentId(wh.departmentId.id).setName(wh.name).build()))
}};

export const onFetchOneWareHouseAction = (wh) => {return {
    scope: WAREHOUSE,
    action: FETCHONE,
    type: OK,
    wareHouse: (new WareHouseBuilder()).setId(wh.id.id).setDepartmentId(wh.departmentId.id).setName(wh.name).build()
}};

export const onFetchOneNotFoundWareHouseAction = (id) => ({
    scope: WAREHOUSE,
    type: OK,
    action: FETCHNOTFOUND,
    id: id.id
});


export const onCreateWareHouseAction = (wareHouse) => ({
    scope: WAREHOUSE,
    action: CREATE,
    type: OK,
    wareHouse: wareHouse
});

export const onUpdateWareHouseAction = (wareHouse) => ({
    scope: WAREHOUSE,
    action: UPDATE,
    type: OK,
    wareHouse: wareHouse
});

export const onDeleteWareHouseAction = (id) => ({
    scope: WAREHOUSE,
    action: DELETE,
    type: OK,
    id: id.id
});
