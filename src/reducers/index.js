import firebase from './firebase/firebaseReducer';
import auth from './auth/authReducer';
import device from './device/deviceReducer';
import global from './global/globalReducer';
import server from './server/serverReducer';

import { combineReducers } from 'redux';
import { reducer as network } from 'react-native-offline';

/**
 * ## CombineReducers
 *
 * the rootReducer will call each and every reducer with the state and action
 * EVERY TIME there is a basic action
 */
const rootReducer = combineReducers({
    firebase,
    auth,
    device,
    global,
    server,
    network
})

export default rootReducer