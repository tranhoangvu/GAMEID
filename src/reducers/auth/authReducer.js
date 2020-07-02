const {
    LOG_IN,
    FIREBASE_TOKEN,
    LOG_OUT,
    USER_COUNT_MESS
} = require('../../lib/constants').default;

import InitialState from './authInitialState';
import firebase from 'react-native-firebase';

const initialState = new InitialState()
/**
 * ## globalReducer function
 * @param {Object} state - initialState
 * @param {Object} action - type and payload
 */

export default function authReducer(state = initialState, action) {
    if (!(state instanceof InitialState)) return initialState.merge(state)
    switch (action.type) {
        case LOG_IN:
            let userProfile = action.payload;
            var isAuth = true;
            if (userProfile === null) isAuth = false;
            var userAuth = state.set('userProfile', userProfile)
                    .set('isAuth', isAuth);
            return userAuth;

        case FIREBASE_TOKEN:
            let firebaseToken = action.payload;
            return state.set('firebaseToken', firebaseToken);

        case LOG_OUT:
            return state.set('userProfile', null).set('isAuth', false);
    }
    return state;
}