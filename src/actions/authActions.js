import {API_URI, API_ORIGIN} from "../consts.js";
import axios from "axios";
import {
    CREATE,
    DELETE,
    DEPARTMENT,
    FETCHALL, OK,
    FETCHNOTFOUND,
    FETCHONE,
    UPDATE
} from "./actions.js";
import {DepartmentBuilder} from "../builders/departmentBuilder.js";



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
        .then(response => onUpdateToken(response.data.token))
        .then(_ => cb())
        .catch(error => {
            if (error.response && error.response.status === 401){
                onUnauthorizedLoginAction();
            }else{
                onErrorAction(error.message)
            }
        })
}

export const updateToken = () => {

    const authToken = localStorage.getItem('authToken')
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

}

const onErrorAction = (message) => {
    console.log(message);
}

const onUpdateToken = (token) => {

    localStorage.setItem('authToken', token)

};

const onUnauthorizedLoginAction = () => {
    alert("Bad credentials");
}

const onInvalidTokenAction = () => {
    localStorage.removeItem('authToken')
    window.location = ('/login');
    alert("Время жизни сессии истекло. Авторизируйтесь заново");

}
