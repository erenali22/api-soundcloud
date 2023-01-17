import { csrfFetch } from './csrf';

const SET_USER = 'session/setUser';
const REMOVE_USER = 'session/removeUser';
const SET_LOADED = 'session/loaded';
const SET_SIGNED_IN = 'session/signedIn';

const setUser = (user) => {
    return {
        type: SET_USER,
        payload: user,
    };
};

const removeUser = () => {
    return {
        type: REMOVE_USER,
    };
};

export const setLoaded = (loaded) => {
    return {
        type: SET_LOADED,
        payload: loaded
    };
};

export const setSignedIn = (signedIn) => {
    return {
        type: SET_SIGNED_IN,
        payload: signedIn
    };
};

const initialState = { user: null, loaded: false, signedIn: null };

const sessionReducer = (state = initialState, action) => {
    let newState;
    switch (action.type) {
        case SET_USER:
            newState = Object.assign({}, state);
            newState.user = action.payload;
            return newState;
        case REMOVE_USER:
            newState = Object.assign({}, state);
            newState.user = null;
            newState.signedIn = null;
            return newState;
        case SET_LOADED:
            newState = Object.assign({}, state);
            newState.loaded = action.payload;
            return newState
        case SET_SIGNED_IN:
            newState = Object.assign({}, state);
            newState.signedIn = action.payload;
            return newState
        default:
            return state;
    }
};

export const login = (user) => async (dispatch) => {
    const { credential, password } = user;
    const response = await csrfFetch('/api/session', {
        method: 'POST',
        body: JSON.stringify({
            credential,
            password,
        }),
    });
    const data = await response.json();
    dispatch(setUser(data));
    return response;
};

export const restoreUser = () => async (dispatch) => {
    const response = await csrfFetch('/api/session');
    const data = await response.json();
    dispatch(setUser(data));
    return response;
};

export const signup = (user) => async (dispatch) => {
    const { username, firstName, lastName, email, password } = user;
    const response = await csrfFetch("/api/users", {
      method: "POST",
      body: JSON.stringify({
        username,
        firstName,
        lastName,
        email,
        password,
      }),
    });
    const data = await response.json();
    dispatch(setUser(data));
    return response;
  };

export const logout = () => async (dispatch) => {
    const response = await csrfFetch('/api/session', {
        method: 'DELETE',
    });
    dispatch(removeUser());
    return response;
};

export default sessionReducer;
