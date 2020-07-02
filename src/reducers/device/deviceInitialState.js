import { Record } from 'immutable'
var InitialState = Record({
    isMobile: false,
    isConnected: null,
    platform: '',
    uniqueId: '',
    onesignal: {
        pushToken: '',
        userId: ''
    }
})

export default InitialState