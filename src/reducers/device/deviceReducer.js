import InitialState from './deviceInitialState'

const {
    SET_PLATFORM,
    SET_UNIQUEID,
    SET_ONESIGNAL,
    SET_NETWORK
} = require('../../lib/constants').default

const initialState = new InitialState()

/**
 * ## deviceReducer function
 * @param {Object} state - initialState
 * @param {Object} action - type and payload
 */
export default function deviceReducer(state = initialState, action) {
    if (!(state instanceof InitialState)) return initialState.merge(state)

    switch (action.type) {
        case SET_PLATFORM: {
            const platform = action.payload
            return state.set('platform', platform)
        }
        case SET_UNIQUEID: {
            const uniqueId = action.payload
            return state.set('uniqueId', uniqueId)
        }
        case SET_ONESIGNAL: {
            const onesignal = action.payload
            return state.set('onesignal', onesignal)
        }
        case SET_NETWORK: {
            const network = action.payload
            return state.set('isConnected', network)
        }
    }

    return state
}