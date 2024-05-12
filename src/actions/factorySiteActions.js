import {API_URI, API_ORIGIN} from "../consts.js";
import axios from "axios";
import {
    CREATE,
    DELETE,
    FACTORYSITE,
    FETCHALL, OK,
    FETCHNOTFOUND,
    FETCHONE,
    onErrorAction,
    UPDATE,
    UPDATESUPPLY
} from "./actions.js";
import {FactorySiteBuilder} from "../builders/factorySiteBuilder.js";


export const fetchAllFactorySiteAction = () => {
    return async (dispatch) => {
        const authToken = localStorage.getItem('authToken')
        axios({
            method: 'get',
            url: API_URI + "/factorysite/fetch",
            timeout: 4000,    // 4 seconds timeout
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Origin':API_ORIGIN
            }
        })
            .then(response => dispatch(onFetchAllFactorySiteAction(response.data)))
            .catch(error => {
                dispatch(onErrorAction(error.message))
            })
    };

}

export const fetchOneFactorySiteAction = (id) =>{
return async (dispatch) => {
    const authToken = localStorage.getItem('authToken')
    axios({
        method: 'get',
        url: API_URI + "/factorysite/fetch",
        timeout: 4000,    // 4 seconds timeout
        headers: {
            'Authorization': `Bearer ${authToken}`,
            'Origin':API_ORIGIN
        },
        params: new URLSearchParams({
            id: id,
        })
    })
        .then(response => dispatch(onFetchOneFactorySiteAction(response.data[0])))
        .catch(error => {
            console.log(error)
            if (error.response && error.response.status === 404){
                dispatch(onFetchOneNotFoundFactorySiteAction(id))
            }else{
                dispatch(onErrorAction(error.message))
            }
        })
}
}



export const createFactorySiteAction = (factorySite) =>{
    console.log("createFactorySiteAction")
    console.log(factorySite)
return async (dispatch) => {
    console.log("createFactorySiteAction inside")
    const authToken = localStorage.getItem('authToken')
    axios({
        method: 'post',
        url: API_URI + "/factorysite/create",
        timeout: 4000,    // 4 seconds timeout
        headers: {
            'Authorization': `Bearer ${authToken}`,
            'Origin':API_ORIGIN
        },
        data: {
            departmentId : factorySite.departmentId,
            name : factorySite.name
        }
    })
        .then(response => {factorySite.id = response.data; dispatch(onCreateFactorySiteAction(factorySite))})
        .catch(error => {
            dispatch(onErrorAction(error.message))
        })
}}



export const updateFactorySiteAction = (factorySite) =>{
return async (dispatch) => {
    console.log("updateFactorySiteAction")
    console.log(factorySite)
    const authToken = localStorage.getItem('authToken')
    axios({
        method: 'put',
        url: API_URI + "/factorysite/update",
        timeout: 4000,    // 4 seconds timeout
        headers: {
            'Authorization': `Bearer ${authToken}`,
            'Origin':API_ORIGIN
        },
        data: {
            id : factorySite.id,
            departmentId : factorySite.departmentId,
            name : factorySite.name
        }
    }).then(response => dispatch(onUpdateFactorySiteAction(factorySite)))
        .catch(error => {
            dispatch(onErrorAction(error.message))
        })

}}



export const deleteFactorySiteAction = (factorySite) => {
return async (dispatch) => {
    console.log("deleteFactorySiteAction");
    console.log(factorySite);
    const authToken = localStorage.getItem('authToken')
    axios({
        method: 'delete',
        url: API_URI + "/factorysite/delete",
        timeout: 4000,    // 4 seconds timeout
        headers: {
            'Authorization': `Bearer ${authToken}`,
            'Origin':API_ORIGIN
        },
        params: new URLSearchParams({
            id: factorySite.id,
        })
    })
        .then(response => dispatch(onDeleteFactorySiteAction(factorySite.id)))
        .catch(error => {
            dispatch(onErrorAction(error.message))
        })
}}


export const updateFactorySiteSupplyAction = (id, factorySiteSupply) =>{
return async (dispatch) => {
    const authToken = localStorage.getItem('authToken')
    axios({
        method: 'put',
        url: API_URI + "/factorysite/updateSupply",
        timeout: 4000,    // 4 seconds timeout
        headers: {
            'Authorization': `Bearer ${authToken}`,
            'Origin':API_ORIGIN
        },
        data: {
            suppliers : factorySiteSupply.suppliers,
            id : id,
        }
    }).then(response => dispatch(onUpdateFactorySiteSupplyAction(id, factorySiteSupply)))
        .catch(error => {
            dispatch(onErrorAction(error.message))
        })

}}

//SYNC
export const onFetchAllFactorySiteAction = (factorySites) => {return {
    scope: FACTORYSITE,
    action: FETCHALL,
    type: OK,
    factorySites: factorySites.map((fs) => ((new FactorySiteBuilder()).setId(fs.id.id).setDepartmentId(fs.departmentId.id).setName(fs.name).build()))
}};

export const onFetchOneFactorySiteAction = (fs) => {return {
    scope: FACTORYSITE,
    action: FETCHONE,
    type: OK,
    factorySite: (new FactorySiteBuilder()).setId(fs.id.id).setDepartmentId(fs.departmentId.id).setName(fs.name).build()
}};

export const onFetchOneNotFoundFactorySiteAction = (id) => ({
    scope: FACTORYSITE,
    type: OK,
    action: FETCHNOTFOUND,
    id: id.id
});


export const onCreateFactorySiteAction = (factorySite) => ({
    scope: FACTORYSITE,
    action: CREATE,
    type: OK,
    factorySite: factorySite
});

export const onUpdateFactorySiteAction = (factorySite) => ({
    scope: FACTORYSITE,
    action: UPDATE,
    type: OK,
    factorySite: factorySite
});


export const onUpdateFactorySiteSupplyAction = (id, factorySiteSupply) => ({
    scope: FACTORYSITE,
    action: UPDATESUPPLY,
    type: OK,
    id: id,
    factorySiteSupply: factorySiteSupply
});

export const onDeleteFactorySiteAction = (id) => ({
    scope: FACTORYSITE,
    action: DELETE,
    type: OK,
    id: id.id
});
