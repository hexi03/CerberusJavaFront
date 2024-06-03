import {API_ORIGIN, API_URI} from "../consts.js";
import axios from "axios";
import {
    CREATE,
    DELETE,
    FETCHALL,
    FETCHNOTFOUND,
    FETCHONE,
    OK,
    onErrorAction,
    UPDATE,
    UPDATECOMPOSITION
} from "./actions.js";
import {GroupBuilder} from "../builders/groupBuilder.js";
import {updateToken} from "./authActions.js";
import {debounceAction} from "../helpers/fetchHelpers.js";

export const fetchAllGroupsAction = debounceAction(() => {
    return (dispatch) => {
        const authToken = localStorage.getItem('authToken');
        axios.get(API_URI + "/usergroup/fetchGroup", {
            crossDomain: true,
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        })
        .then(response => {
            dispatch(onFetchAllGroupAction(response.data));
        })
        .catch(error => {
            dispatch(onErrorAction(error.message));
        }).finally(_ => updateToken());
    };
})

export const fetchOneGroupAction = debounceAction((id) => {
    return (dispatch) => {
        const authToken = localStorage.getItem('authToken');
        axios.get(API_URI + "/usergroup/fetchGroup", {
            crossDomain: true,
            headers: {
                'Authorization': `Bearer ${authToken}`
            },
            params: { id }
        })
        .then(response => {
            if (response.data.length === 0) {
                dispatch(onFetchOneNotFoundGroupAction(id));
            } else {
                dispatch(onFetchOneGroupAction(response.data[0]));
            }
        })
        .catch(error => {
            dispatch(onErrorAction(error.message));
        }).finally(_ => updateToken());
    }
})

export const createGroupAction = (group) => {
    return (dispatch) => {
        const authToken = localStorage.getItem('authToken');
        axios.post(API_URI + "/usergroup/addGroup", {
            name: group.name
        }, {
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Origin': API_ORIGIN
            }
        })
        .then(response => {
            group.id = response.data.id;
            dispatch(onCreateGroupAction(group));
        })
        .catch(error => {
            dispatch(onErrorAction(error.message));
        }).finally(_ => updateToken());
    }
}

export const updateGroupAction = (group) => {
    return (dispatch) => {
        const authToken = localStorage.getItem('authToken');
        axios.put(API_URI + "/usergroup/updateGroup", {
            id: group.id,
            name: group.name
        }, {
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Origin': API_ORIGIN
            }
        })
        .then(() => {
            dispatch(onUpdateGroupAction(group));
        })
        .catch(error => {
            dispatch(onErrorAction(error.message));
        }).finally(_ => updateToken());
    }
}

export const deleteGroupAction = (id) => {
    console.log("deleteGroupAction")
    console.log(id)
    return (dispatch) => {
        const authToken = localStorage.getItem('authToken');
        axios.delete(API_URI + "/usergroup/removeGroup", {
            crossDomain: true,
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Origin': API_ORIGIN
            },
            params: { id: id }
        })
        .then(() => {
            dispatch(onDeleteGroupAction(id));
        })
        .catch(error => {
            dispatch(onErrorAction(error.message));
        }).finally(_ => updateToken());
    }
}


export const updateGroupCompositionAction = (groupMod) => {
    return (dispatch) => {
        const authToken = localStorage.getItem('authToken');
        axios.put(API_URI + "/usergroup/setUsers", {
            id: groupMod.id,
            users: groupMod.userIds
        }, {
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Origin': API_ORIGIN
            }
        })
        .then(() => {
            dispatch(onUpdateGroupCompositionAction(groupMod));
        })
        .catch(error => {
            dispatch(onErrorAction(error.message));
        }).finally(_ => updateToken());
    }
}




// SYNC
export const onFetchAllGroupAction = (groups) => ({
    scope: 'GROUP',
    action: FETCHALL,
    type: OK,
    groups: groups.map(group => (new GroupBuilder()).setId(group.id.id).setName(group.name).setUserIds(group.userIds.map((id) => id.id) || []).build())
});

export const onFetchOneGroupAction = (group) => ({
    scope: 'GROUP',
    action: FETCHONE,
    type: OK,
    group: (new GroupBuilder()).setId(group.id.id).setName(group.name).setUserIds(group.userIds.map((id) => id.id) || []).build()
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

export const onUpdateGroupCompositionAction = (groupMod) => ({
    scope: 'GROUP',
    action: UPDATECOMPOSITION,
    type: OK,
    groupMod: groupMod
});

export const onDeleteGroupAction = (id) => ({
    scope: 'GROUP',
    action: DELETE,
    type: OK,
    id: id
});
