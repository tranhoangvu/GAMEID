const {
    SET_PLATFORM,
    SET_UNIQUEID,
    SET_ONESIGNAL,
    SET_NETWORK
} = require('../../lib/constants').default

export function setPlatform(platform) {
    return {
        type: SET_PLATFORM,
        payload: platform
    }
}
export function setUniqueId(uniqueId) {
    return {
        type: SET_UNIQUEID,
        payload: uniqueId
    }
}
export function setOneSignal(onesignal) {
    return {
        type: SET_ONESIGNAL,
        payload: onesignal
    }
}
export function setNetwork(network) {
    return {
        type: SET_NETWORK,
        payload: network
    }
}