import { Record } from 'immutable';

var InitialState = Record({
    currentUser: null,
    showState: false,
    currentState: null,
    store: null,
    clientVersion: '3.1.4'
})
export default InitialState