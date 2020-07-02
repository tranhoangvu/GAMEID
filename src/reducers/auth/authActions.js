const {
    LOG_IN,
    FIREBASE_TOKEN,
    LOG_OUT
} = require('../../lib/constants').default

export function login(userProfile) {
    return {
        type: LOG_IN,
        payload: userProfile
    }
}
export function firebaseToken(firebaseToken) {
    return {
        type: FIREBASE_TOKEN,
        payload: firebaseToken
    }
}
export function logout() {
    return {
        type: LOG_OUT
    }
}