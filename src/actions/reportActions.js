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
import { ReportType } from "../builders/reportTypes.js";
import { updateToken } from "./authActions.js";

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
            }).finally(_ => updateToken())
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
            }).finally(_ => updateToken())
    };

}

export const fetchOneReportAction = (id) =>{
    console.log("fetchOneReportAction: " + id);
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
        }).finally(_ => updateToken())
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
        }).finally(_ => updateToken())
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
        }).finally(_ => updateToken())

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
        }).finally(_ => updateToken())
}}



export const fetchReportsByQuery = (queryParams) => {
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
            params: queryParams
        })

            .then(response => dispatch(onFetchAllReportAction(response.data)))
            .catch(error => {
                dispatch(onErrorAction(error.message))
            }).finally(_ => updateToken())
    };

}

//SYNC
export const onFetchAllReportAction = (reports) => {
    console.log("репорты на onFetchAllReportAction:");
    console.log(reports);
    const res = {
        scope: REPORT,
        action: FETCHALL,
        type: OK,
        reports: reports.map((rep) => {
            const builder = (new ReportBuilder()).setType(rep.type).setId(rep.id.id).setCreatedAt(rep.createdAt).setDeletedAt(rep.deletedAt).setCreatorId(rep.creatorId.id);
            console.log("ReportBuilder: type: " + rep.type + " creatorId: " + rep.creatorId.id);
            switch(rep.type){
                case ReportType.WH_INVENTARISATION: return builder.setWareHouseId(rep.wareHouseId.id).setItems(rep.items).build();
                case ReportType.WH_RELEASE: return builder.setWareHouseId(rep.wareHouseId.id).setSupReqReportId(rep.supplyReqReportId.id).setItems(rep.items).build();
                case ReportType.WH_REPLENISHMENT: return builder.setWareHouseId(rep.wareHouseId.id).setItems(rep.items).build();
                case ReportType.WH_WS_REPLENISHMENT: return builder.setWareHouseId(rep.wareHouseId.id).setWSReportId(rep.workShiftReportId.id).setItems(rep.items).setUnclaimedRemains(rep.unclaimedRemains).build();
                case ReportType.WH_SHIPMENT: return builder.setWareHouseId(rep.wareHouseId.id).setItems(rep.items).build();
                case ReportType.FS_SUP_REQ: return builder.setFactorySiteId(rep.factorySiteId.id).setTargetWareHouseIds(rep.targetWareHouseIds.map((id) => id.id)).setItems(rep.items).build();
                case ReportType.FS_WORKSHIFT: return builder.setFactorySiteId(rep.factorySiteId.id).setTargetWareHouseIds(rep.targetWareHouseIds.map((id) => id.id)).setProducedItems(rep.produced).setLosses(rep.losses).setRemains(rep.remains).build();
            }
            console.log("Invalid report type: " + rep.type);
            throw new Error('Report type is not valid: ' + rep.type);
        })
    }
    console.log("результат onFetchAllReportAction:");
    console.log(res);
    return res;
};

export const onFetchOneReportAction = (rep) => {
    console.log("onFetchOneReportAction");
    console.log(rep);
    var builder = (new ReportBuilder()).setType(rep.type).setId(rep.id.id).setCreatedAt(rep.createdAt).setDeletedAt(rep.deletedAt).setCreatorId(rep.creatorId.id);
            console.log("ReportBuilder: type: " + rep.type + " creatorId: " + rep.creatorId.id);
            switch(rep.type){
                case ReportType.WH_INVENTARISATION: builder = builder.setWareHouseId(rep.wareHouseId.id).setItems(rep.items);break;
                case ReportType.WH_RELEASE: builder = builder.setWareHouseId(rep.wareHouseId.id).setSupReqReportId(rep.supplyReqReportId.id).setItems(rep.items);break;
                case ReportType.WH_REPLENISHMENT: builder = builder.setWareHouseId(rep.wareHouseId.id).setItems(rep.items);break;
                case ReportType.WH_WS_REPLENISHMENT: builder = builder.setWareHouseId(rep.wareHouseId.id).setWSReportId(rep.workShiftReportId.id).setItems(rep.items).setUnclaimedRemains(rep.unclaimedRemains);break;
                case ReportType.WH_SHIPMENT: builder = builder.setWareHouseId(rep.wareHouseId.id).setItems(rep.items);break;
                case ReportType.FS_SUP_REQ: builder = builder.setFactorySiteId(rep.factorySiteId.id).setTargetWareHouseIds(rep.targetWareHouseIds.map((id) => id.id)).setItems(rep.items);break;
                case ReportType.FS_WORKSHIFT: builder = builder.setFactorySiteId(rep.factorySiteId.id).setTargetWareHouseIds(rep.targetWareHouseIds.map((id) => id.id)).setProducedItems(rep.produced).setLosses(rep.losses).setRemains(rep.remains);break;
                default:
                    console.log("Invalid report type: " + rep.type);
                    throw new Error('Report type is not valid: ' + rep.type);
            }

    return {
    scope: REPORT,
    action: FETCHONE,
    type: OK,
    report: builder.build()
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
