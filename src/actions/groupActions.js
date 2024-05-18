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
import { GroupBuilder } from "../builders/groupBuilder.js";

export const fetchAllGroupsAction = () => {
    return async (dispatch) => {
        try {
            const authToken = localStorage.getItem('authToken');
            const response = await axios.get(API_URI + "/group/fetch", {
                crossDomain: true,
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });
            dispatch(onFetchAllGroupAction(response.data));
        } catch (error) {
            dispatch(onErrorAction(error.message));
        }
    };
}

export const fetchOneGroupAction = (id) => {
    return async (dispatch) => {
        try {
            const authToken = localStorage.getItem('authToken');
            const response = await axios.get(API_URI + "/group/fetch", {
                crossDomain: true,
                headers: {
                    'Authorization': `Bearer ${authToken}`
                },
                params: { id }
            });
            if (response.data.length === 0) {
                dispatch(onFetchOneNotFoundGroupAction(id));
            } else {
                dispatch(onFetchOneGroupAction(response.data[0]));
            }
        } catch (error) {
            dispatch(onErrorAction(error.message));
        }
    }
}

export const createGroupAction = (group) => {
    return async (dispatch) => {
        try {
            const authToken = localStorage.getItem('authToken');
            const response = await axios.post(API_URI + "/group/create", {
                name: group.name
            }, {
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Origin': API_ORIGIN
                }
            });
            group.id = response.data;
            dispatch(onCreateGroupAction(group));
        } catch (error) {
            dispatch(onErrorAction(error.message));
        }
    }
}

export const updateGroupAction = (group) => {
    return async (dispatch) => {
        try {
            const authToken = localStorage.getItem('authToken');
            await axios.put(API_URI + "/group/update", {
                id: group.id,
                name: group.name
            }, {
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Origin': API_ORIGIN
                }
            });
            dispatch(onUpdateGroupAction(group));
        } catch (error) {
            dispatch(onErrorAction(error.message));
        }
    }
}

export const deleteGroupAction = (group) => {
    return async (dispatch) => {
        try {
            const authToken = localStorage.getItem('authToken');
            await axios.delete(API_URI + "/group/delete", {
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Origin': API_ORIGIN
                },
                params: { id: group.id }
            });
            dispatch(onDeleteGroupAction(group.id));
        } catch (error) {
            dispatch(onErrorAction(error.message));
        }
    }
}

// SYNC
export const onFetchAllGroupAction = (groups) => ({
    scope: 'GROUP',
    action: FETCHALL,
    type: OK,
    groups: groups.map(group => (new GroupBuilder()).setId(group.id).setName(group.name).build())
});

export const onFetchOneGroupAction = (group) => ({
    scope: 'GROUP',
    action: FETCHONE,
    type: OK,
    group: (new GroupBuilder()).setId(group.id).setName(group.name).build()
});

export const onFetchOneNotFoundGroupAction = (id) => ({
    scope: 'GROUP',
    action: FETCHNOTFOUND,
    type: OK,
    id: id
});

export const onCreateGroupAction = (group) => ({
    scope: 'GROUP',
    action: CREATE,
    type: OK,
    group: group
});

export const onUpdateGroupAction = (group) => ({
    scope: 'GROUP',
    action: UPDATE,
    type: OK,
    group: group
});

export const onDeleteGroupAction = (id) => ({
    scope: 'GROUP',
    action: DELETE,
    type: OK,
    id: id
});
