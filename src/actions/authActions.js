import {API_URI, API_ORIGIN} from "../consts.js";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthStatus } from "../authStatus.js";
import { debounceAction } from "../helpers/fetchHelpers.js";


export const login = (credentials, cb) => {

    axios({
        method: 'post',
        crossDomain: true,
        url: API_URI + "/auth/login",
        timeout: 4000,
        data: {
            email : credentials.email,
            password : credentials.password
        }
    })
        .then(response => {onUpdateToken(response.data.token); onUpdateLocalStorageUserId(response.data.userId.id)})
        .then(_ => cb())
        .catch(error => {
            if (error.response && error.response.status === 401){
                onBadCredsLoginAction();
            }else{
                onErrorAction(error.message)
            }
        })
}

export const updateToken = debounceAction(() => {

    const authToken = localStorage.getItem('authToken')
    if (!authToken) onUnauthorizedLoginAction();
    axios({
        method: 'post',
        crossDomain: true,
        url: API_URI + "/auth/updateToken",
        timeout: 4000,    // 4 seconds timeout
        headers: {
            'Authorization': `Bearer ${authToken}`
        }
    })
        .then(response => onUpdateToken(response.data.token))
        .catch(error => {
            if (error.response && error.response.status === 401){
                onInvalidTokenAction();
            }else{
                onErrorAction(error.message)
            }
        })

})

const onErrorAction = (message) => {
    console.log(message);
}

const onUpdateToken = (token) => {
    localStorage.setItem('authToken', token)

};

const onUpdateLocalStorageUserId = (id) => {
    localStorage.setItem('userId', id)

};

const onUnauthorizedLoginAction = () => {
    const loginEndpoint = "/login";
    if(window.location.pathname != loginEndpoint)
    window.location = (`${loginEndpoint}?status=${AuthStatus.UNAUTHORIZED}`);
}

const onBadCredsLoginAction = () => {
    window.location = (`/login?status=${AuthStatus.BAD_CREDENTIALS}`);
}

const onInvalidTokenAction = () => {
    localStorage.removeItem('authToken')
    window.location = (`/login?status=${AuthStatus.SESSION_DEAD}`);
}
