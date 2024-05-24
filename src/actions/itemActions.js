import { API_URI, API_ORIGIN } from "../consts.js";
import axios from "axios";
import {
    CREATE,
    DELETE,
    FETCHALL,
    FETCHNOTFOUND,
    FETCHONE,
    onErrorAction,
    OK,
    UPDATE
} from "./actions.js";
import { ItemBuilder } from "../builders/itemBuilder.js";
import { updateToken } from "./authActions.js";
import { debounceAction } from "../helpers/fetchHelpers.js";
export const fetchAllItemsAction = debounceAction(() => {
    return (dispatch) => {
        const authToken = localStorage.getItem('authToken');
        axios.get(API_URI + "/registry/fetchItem", {
            crossDomain: true,
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        })
        .then(response => {
            dispatch(onFetchAllItemsAction(response.data));
        })
        .catch(error => {
            dispatch(onErrorAction(error.message));
        }).finally(_ => updateToken());
    };
})

export const fetchOneItemAction = debounceAction((id) => {
    return (dispatch) => {
        const authToken = localStorage.getItem('authToken');
        axios.get(API_URI + "/registry/fetchItem", {
            crossDomain: true,
            headers: {
                'Authorization': `Bearer ${authToken}`
            },
            params: { id }
        })
        .then(response => {
            if (response.data.length === 0) {
                dispatch(onFetchOneNotFoundItemAction(id));
            } else {
                dispatch(onFetchOneItemAction(response.data[0]));
            }
        })
        .catch(error => {
            dispatch(onErrorAction(error.message));
        }).finally(_ => updateToken());
    }
})

export const createItemAction = (item) => {
    return (dispatch) => {
        const authToken = localStorage.getItem('authToken');
        axios.post(API_URI + "/registry/addItem", {
            name: item.name,
            units: item.units
        }, {
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Origin': API_ORIGIN
            }
        })
        .then(response => {
            item.id = response.data.id;
            dispatch(onCreateItemAction(item));
        })
        .catch(error => {
            dispatch(onErrorAction(error.message));
        }).finally(_ => updateToken());
    }
}

export const updateItemAction = (item) => {
    return (dispatch) => {
        const authToken = localStorage.getItem('authToken');
        axios.put(API_URI + "/registry/updateItem", {
            id: item.id,
            name: item.name,
            units: item.units
        }, {
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Origin': API_ORIGIN
            }
        })
        .then(() => {
            dispatch(onUpdateItemAction(item));
        })
        .catch(error => {
            dispatch(onErrorAction(error.message));
        }).finally(_ => updateToken());
    }
}

export const deleteItemAction = (item) => {
    return (dispatch) => {
        const authToken = localStorage.getItem('authToken');
        axios.delete(API_URI + "/registry/removeItem", {
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Origin': API_ORIGIN
            },
            params: { id: item.id }
        })
        .then(() => {
            dispatch(onDeleteItemAction(item.id));
        })
        .catch(error => {
            dispatch(onErrorAction(error.message));
        }).finally(_ => updateToken());
    }
}

// SYNC
export const onFetchAllItemsAction = (items) => ({
    scope: 'ITEM',
    action: FETCHALL,
    type: OK,
    items: items.map(item => (new ItemBuilder()).setId(item.id.id).setName(item.name).setUnits(item.units).build())
});

export const onFetchOneItemAction = (item) => ({
    scope: 'ITEM',
    action: FETCHONE,
    type: OK,
    item: (new ItemBuilder()).setId(item.id).setName(item.name).setUnits(item.units).build()
});

export const onFetchOneNotFoundItemAction = (id) => ({
    scope: 'ITEM',
    action: FETCHNOTFOUND,
    type: OK,
    id: id
});

export const onCreateItemAction = (item) => ({
    scope: 'ITEM',
    action: CREATE,
    type: OK,
    item: item
});

export const onUpdateItemAction = (item) => ({
    scope: 'ITEM',
    action: UPDATE,
    type: OK,
    item: item
});

export const onDeleteItemAction = (id) => ({
    scope: 'ITEM',
    action: DELETE,
    type: OK,
    id: id
});
