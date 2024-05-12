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
import { UserBuilder } from "../builders/userBuilder.js";

export const fetchAllUserAction = () => {
    return async (dispatch) => {
        try {
            const authToken = localStorage.getItem('authToken');
            const response = await axios.get(API_URI + "/user/fetch", {
                crossDomain: true,
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });
            dispatch(onFetchAllUserAction(response.data));
        } catch (error) {
            dispatch(onErrorAction(error.message));
        }
    };
}

export const fetchOneUserAction = (id) => {
    return async (dispatch) => {
        try {
            const authToken = localStorage.getItem('authToken');
            const response = await axios.get(API_URI + "/user/fetch", {
                crossDomain: true,
                headers: {
                    'Authorization': `Bearer ${authToken}`
                },
                params: { id }
            });
            if (response.data.length === 0) {
                dispatch(onFetchOneNotFoundUserAction(id));
            } else {
                dispatch(onFetchOneUserAction(response.data[0]));
            }
        } catch (error) {
            dispatch(onErrorAction(error.message));
        }
    }
}

export const createUserAction = (user) => {
    return async (dispatch) => {
        try {
            const authToken = localStorage.getItem('authToken');
            const response = await axios.post(API_URI + "/user/create", {
                name: user.name,
                groupIds : user.groupIds
            }, {
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Origin': API_ORIGIN
                }
            });
            user.id = response.data;
            dispatch(onCreateUserAction(user));
        } catch (error) {
            dispatch(onErrorAction(error.message));
        }
    }
}

export const updateUserAction = (user) => {
    return async (dispatch) => {
        try {
            const authToken = localStorage.getItem('authToken');
            await axios.put(API_URI + "/user/update", {
                id: user.id,
                name: user.name,
                groupIds : user.groupIds
            }, {
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Origin': API_ORIGIN
                }
            });
            dispatch(onUpdateUserAction(user));
        } catch (error) {
            dispatch(onErrorAction(error.message));
        }
    }
}

export const deleteUserAction = (user) => {
    return async (dispatch) => {
        try {
            const authToken = localStorage.getItem('authToken');
            await axios.delete(API_URI + "/user/delete", {
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Origin': API_ORIGIN
                },
                params: { id: user.id }
            });
            dispatch(onDeleteUserAction(user.id));
        } catch (error) {
            dispatch(onErrorAction(error.message));
        }
    }
}

// SYNC
export const onFetchAllUserAction = (users) => ({
    scope: 'USER',
    action: FETCHALL,
    type: OK,
    users: users.map(user => (new UserBuilder()).setId(user.id).setName(user.name).setGroupIds(user.groupIds()).build())
});

export const onFetchOneUserAction = (user) => ({
    scope: 'USER',
    action: FETCHONE,
    type: OK,
    user: (new UserBuilder()).setId(user.id).setName(user.name).setGroupIds(user.groupIds()).build()
});

export const onFetchOneNotFoundUserAction = (id) => ({
    scope: 'USER',
    action: FETCHNOTFOUND,
    type: OK,
    id: id
});

export const onCreateUserAction = (user) => ({
    scope: 'USER',
    action: CREATE,
    type: OK,
    user: user
});

export const onUpdateUserAction = (user) => ({
    scope: 'USER',
    action: UPDATE,
    type: OK,
    user: user
});

export const onDeleteUserAction = (id) => ({
    scope: 'USER',
    action: DELETE,
    type: OK,
    id: id
});
