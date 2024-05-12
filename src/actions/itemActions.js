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

export const fetchAllItemAction = () => {
    return async (dispatch) => {
        try {
            const authToken = localStorage.getItem('authToken');
            const response = await axios.get(API_URI + "/item/fetch", {
                crossDomain: true,
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });
            dispatch(onFetchAllItemAction(response.data));
        } catch (error) {
            dispatch(onErrorAction(error.message));
        }
    };
}

export const fetchOneItemAction = (id) => {
    return async (dispatch) => {
        try {
            const authToken = localStorage.getItem('authToken');
            const response = await axios.get(API_URI + "/item/fetch", {
                crossDomain: true,
                headers: {
                    'Authorization': `Bearer ${authToken}`
                },
                params: { id }
            });
            if (response.data.length === 0) {
                dispatch(onFetchOneNotFoundItemAction(id));
            } else {
                dispatch(onFetchOneItemAction(response.data[0]));
            }
        } catch (error) {
            dispatch(onErrorAction(error.message));
        }
    }
}

export const createItemAction = (item) => {
    return async (dispatch) => {
        try {
            const authToken = localStorage.getItem('authToken');
            const response = await axios.post(API_URI + "/item/create", {
                name: item.name
            }, {
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Origin': API_ORIGIN
                }
            });
            item.id = response.data;
            dispatch(onCreateItemAction(item));
        } catch (error) {
            dispatch(onErrorAction(error.message));
        }
    }
}

export const updateItemAction = (item) => {
    return async (dispatch) => {
        try {
            const authToken = localStorage.getItem('authToken');
            await axios.put(API_URI + "/item/update", {
                id: item.id,
                name: item.name
            }, {
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Origin': API_ORIGIN
                }
            });
            dispatch(onUpdateItemAction(item));
        } catch (error) {
            dispatch(onErrorAction(error.message));
        }
    }
}

export const deleteItemAction = (item) => {
    return async (dispatch) => {
        try {
            const authToken = localStorage.getItem('authToken');
            await axios.delete(API_URI + "/item/delete", {
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Origin': API_ORIGIN
                },
                params: { id: item.id }
            });
            dispatch(onDeleteItemAction(item.id));
        } catch (error) {
            dispatch(onErrorAction(error.message));
        }
    }
}

// SYNC
export const onFetchAllItemAction = (items) => ({
    scope: 'ITEM',
    action: FETCHALL,
    type: OK,
    items: items.map(item => (new ItemBuilder()).setId(item.id).setName(item.name).build())
});

export const onFetchOneItemAction = (item) => ({
    scope: 'ITEM',
    action: FETCHONE,
    type: OK,
    item: (new ItemBuilder()).setId(item.id).setName(item.name).build()
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
