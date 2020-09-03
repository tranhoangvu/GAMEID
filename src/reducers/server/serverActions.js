const {
    SET_USER_PROFILE,
    GET_NEWS_LIST,
    GET_FEATURE_NEWS_LIST,
    GET_LATEST_NEWS_LIST,
    GET_ADS_LIST,
    GET_GAME_LIST,
    GET_GAME_H5_LIST,
    GET_GAME_GIFT_LIST,
    GET_GIFT_LIST,
    GET_USER_GIFT_LIST,
    GET_USER_CARD_LIST,
    GET_USER_TRANSACTION_LIST,
    GET_NOTIFICATION_LIST,
    USER_COUNT_MESS
} = require('../../lib/constants').default

export function setUserProfile(userLogin) {
    return {
        type: SET_USER_PROFILE,
        payload: userLogin
    }
}
export function getAdsList(adsList) {
    return {
        type: GET_ADS_LIST,
        payload: adsList
    }
}
export function getNewsList(newsList) {
    return {
        type: GET_NEWS_LIST,
        payload: newsList
    }
}
export function getFeatureNewsList(featureNewsList) {
    return {
        type: GET_FEATURE_NEWS_LIST,
        payload: featureNewsList
    }
}
export function getLatestNewsList(latestNewsList) {
    return {
        type: GET_LATEST_NEWS_LIST,
        payload: latestNewsList
    }
}
export function getGameList(gameList) {
    return {
        type: GET_GAME_LIST,
        payload: gameList
    }
}
export function getGameH5List(gameH5List) {
    return {
        type: GET_GAME_H5_LIST,
        payload: gameH5List
    }
}
export function getGameGiftList(gameGiftList) {
    return {
        type: GET_GAME_GIFT_LIST,
        payload: gameGiftList
    }
}
export function getGiftList(giftList) {
    return {
        type: GET_GIFT_LIST,
        payload: giftList
    }
}
export function getUserGiftList(userGiftList) {
    return {
        type: GET_USER_GIFT_LIST,
        payload: userGiftList
    }
}
export function getUserCardList(userCardList) {
    return {
        type: GET_USER_CARD_LIST,
        payload: userCardList
    }
}
export function getUserTransactionList(userTransactionList) {
    return {
        type: GET_USER_TRANSACTION_LIST,
        payload: userTransactionList
    }
}
export function getNotificationList(notificationList) {
    return {
        type: GET_NOTIFICATION_LIST,
        payload: notificationList
    }
}
export function userCountMess(userCountMess) {
    return {
        type: USER_COUNT_MESS,
        payload: userCountMess
    }
}