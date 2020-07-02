const {
    FETCH_DATA
} = require('../../lib/constants').default;

import InitialState from './firebaseInitialState';
import firebase from 'react-native-firebase';

const initialState = new InitialState()
/**
 * ## globalReducer function
 * @param {Object} state - initialState
 * @param {Object} action - type and payload
 */

export default function firebaseReducer(state = initialState, action) {
    if (!(state instanceof InitialState)) return initialState.merge(state)
    switch (action.type) {
        case FETCH_DATA:
            let firebaseConfig = action.payload;
            var isFetchData = true;
            if (firebaseConfig === null) isFetchData = false;
            var fireData = state.set('firebaseConfig', firebaseConfig)
                    .set('isFetchData', isFetchData);
            return fireData;
    }
    return state;
}