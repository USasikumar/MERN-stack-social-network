// import { v4 as uuidv4 } from "uuid";
// import { SET_ALERT, REMOVE_ALERT } from "./types";
import axios from "axios";
import { setAlert } from "./alert";
import {
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    USER_LOADED,
    AUTH_ERROR,
    LOGIN_FAIL,
    LOGIN_SUCCESS,
    LOG_OUT
} from './types'
import setAuthToken from "../utils/setAuthToken";

// lOAD USER
export const loadUser = () => async dispatch=>{
    if(localStorage.token){
        setAuthToken(localStorage.token);
    }

    try {
        const res = await axios.get('/api/auth');
        dispatch({
            type: USER_LOADED,
            payload: res.data
        })
    } catch (err) {
        dispatch({
            type:AUTH_ERROR
        })
    }
}

export const register = ({name, email, password}) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'X-Github-Token': 'ghu_ZkfhqaOWEWb7cjaUigF6PCi6FmCtiC2nD0MQ'
        }
    }
    const body = JSON.stringify({ name, email, password })
    try {
        const res = await axios.post('/api/users', body, config);
        dispatch({
            type: REGISTER_SUCCESS,
            payload: res.data
        })
        dispatch(loadUser())
    } catch (error) {
        const errors = error.response.data.errors;
        if(errors) {
            console.log(errors)
            errors.array.forEach(err => dispatch(
                setAlert(err.msg,'danger')
            ));
        }
        dispatch({
            type: REGISTER_FAIL
        })
    }
    
}

export const login = ({ email, password}) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'X-Github-Token': 'ghu_ZkfhqaOWEWb7cjaUigF6PCi6FmCtiC2nD0MQ'
        }
    }
    console.log(email,password)
    const body = JSON.stringify({ email, password })
    try {
        const res = await axios.post('/api/auth', body, config);
        dispatch({
            type: LOGIN_SUCCESS,
            payload: res.data
        })
        dispatch(loadUser())
    } catch (error) {
        const errors = error.response.data.errors;
        if(errors) {
            console.log(errors)
            errors.array.forEach(err => dispatch(
                setAlert(err.msg,'danger')
            ));
        }
        dispatch({
            type: LOGIN_FAIL
        })
    }
}

export const logout = () => async dispatch=>{
    dispatch({
        type: LOG_OUT
    })
}