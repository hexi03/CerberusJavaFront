import {API_ORIGIN, API_URI} from "../consts.js";
import axios from "axios";
import {CREATE, DELETE, FETCHALL, FETCHNOTFOUND, FETCHONE, OK, onErrorAction, UPDATE, USER} from "./actions.js";
import {UserBuilder} from "../builders/userBuilder.js";
import {updateToken} from "./authActions.js";
import {debounceAction} from "../helpers/fetchHelpers.js";

export const fetchAllUsersAction = debounceAction(() => {
    return async (dispatch) => {
        const authToken = localStorage.getItem('authToken');
        axios.get(API_URI + "/usergroup/fetchUser", {
            crossDomain: true,
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        })
        .then(response => {
            dispatch(onFetchAllUserAction(response.data));
        })
        .catch(error => {
            dispatch(onErrorAction(error.message));
        }).finally(_ => updateToken());
    };
})

export const fetchOneUserAction = debounceAction((id) => {
    return async (dispatch) => {
        const authToken = localStorage.getItem('authToken');
        axios.get(API_URI + "/usergroup/fetchUser", {
            crossDomain: true,
            headers: {
                'Authorization': `Bearer ${authToken}`
            },
            params: { id }
        })
        .then(response => {
            if (response.data.length === 0) {
                dispatch(onFetchOneNotFoundUserAction(id));
            } else {
                dispatch(onFetchOneUserAction(response.data[0]));
            }
        })
        .catch(error => {
            dispatch(onErrorAction(error.message));
        }).finally(_ => updateToken());
    }
})

export const createUserAction = (user) => {
    return async (dispatch) => {
        const authToken = localStorage.getItem('authToken');
        axios.post(API_URI + "/usergroup/addUser", {
            name: user.name,
            groupIds: user.groupIds,
            password: user.password,
            email: user.email
        }, {
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Origin': API_ORIGIN
            }
        })
        .then(response => {
            user.id = response.data.id;
            dispatch(onCreateUserAction(user));
        })
        .catch(error => {
            dispatch(onErrorAction(error.message));
        }).finally(_ => updateToken());
    }
}

export const updateUserAction = (user) => {
    return async (dispatch) => {
        const authToken = localStorage.getItem('authToken');
        axios.put(API_URI + "/usergroup/updateUser", {
            id: user.id,
            name: user.name,
            password: user.password,
            email: user.email
        }, {
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Origin': API_ORIGIN
            }
        })
        .then(() => {
            dispatch(onUpdateUserAction(user));
        })
        .catch(error => {
            dispatch(onErrorAction(error.message));
        }).finally(_ => updateToken());
    }
}

export const deleteUserAction = (id) => {
    console.log("deleteUserAction")
    console.log(id)
    return async (dispatch) => {
        const authToken = localStorage.getItem('authToken');
        axios.delete(API_URI + "/usergroup/removeUser", {
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Origin': API_ORIGIN
            },
            params: { id: id }
        })
        .then(() => {
            dispatch(onDeleteUserAction(id));
        })
        .catch(error => {
            dispatch(onErrorAction(error.message));
        }).finally(_ => updateToken());
    }
}

// SYNC
export const onFetchAllUserAction = (users) => { console.log("Выполнился onFetchAllUserAction");  console.log(users); return {
    scope: USER,
    action: FETCHALL,
    type: OK,
    users: users.map(user => (new UserBuilder()).setId(user.id.id).setName(user.name).setEmail(user.email).setGroupIds(user.groupIds.map((id) => id.id) || []).build())
}};

export const onFetchOneUserAction = (user) => ({
    scope: USER,
    action: FETCHONE,
    type: OK,
    user: (new UserBuilder()).setId(user.id.id).setName(user.name).setEmail(user.email).setGroupIds(user.groupIds.map((id) => id.id) || []).build()
});

export const onFetchOneNotFoundUserAction = (id) => ({
    scope: USER,
    action: FETCHNOTFOUND,
    type: OK,
    id: id
});

export const onCreateUserAction = (user) => ({
    scope: USER,
    action: CREATE,
    type: OK,
    user: user
});

export const onUpdateUserAction = (user) => ({
    scope: USER,
    action: UPDATE,
    type: OK,
    user: user
});

export const onDeleteUserAction = (id) => ({
    scope: USER,
    action: DELETE,
    type: OK,
    id: id
});
