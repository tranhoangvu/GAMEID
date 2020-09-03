const {
    SET_USER_PROFILE,
    GET_GAME_LIST,
    GET_GAME_H5_LIST,
    GET_ADS_LIST,
    GET_NEWS_LIST,
    GET_FEATURE_NEWS_LIST,
    GET_LATEST_NEWS_LIST,
    GET_GIFT_LIST,
    GET_GAME_GIFT_LIST,
    GET_USER_GIFT_LIST,
    GET_USER_CARD_LIST,
    GET_USER_TRANSACTION_LIST,
    GET_NOTIFICATION_LIST,
    USER_COUNT_MESS
} = require('../../lib/constants').default

import InitialState from './serverInitialState'

const initialState = new InitialState()
/**
 * ## globalReducer function
 * @param {Object} state - initialState
 * @param {Object} action - type and payload
 */
export default function serverReducer(state = initialState, action) {
    if (!(state instanceof InitialState)) return initialState.merge(state)

    switch (action.type) {
        case SET_USER_PROFILE:
            let userLogin = action.payload;
            var isUserLogin = true;
            var userLoginData = state.set('userLogin', userLogin)
                .set('isUserLogin', isUserLogin);
            if (userLogin === null) {
                var userLoginData = state.set('userLogin', userLogin)
                    .set('isUserLogin', false);
            }
            return userLoginData;

        case GET_NEWS_LIST:
            let newsList = action.payload;
            var isNewsList = true;
            var newsListData = state.set('newsList', newsList)
                .set('isNewsList', isNewsList);
            if (newsList === '' || newsList === null) {
                var newsListData = state.set('newsList', newsList)
                    .set('isNewsList', false);
            }
            return newsListData;


        case GET_FEATURE_NEWS_LIST:
            let featureNewsList = action.payload;
            var isFeatureNewsList = true;
            var featureNewsListData = state.set('featureNewsList', featureNewsList)
                .set('isFeatureNewsList', isFeatureNewsList);
            if (featureNewsList === '' || featureNewsList === null) {
                var featureNewsListData = state.set('featureNewsList', featureNewsList)
                    .set('isFeatureNewsList', false);
            }
            return featureNewsListData;

        case GET_LATEST_NEWS_LIST:
            let latestNewsList = action.payload;
            var isLatestNewsList = true;
            var latestNewsListData = state.set('latestNewsList', latestNewsList)
                .set('isLatestNewsList', isLatestNewsList);
            if (latestNewsList === '' || latestNewsList === null) {
                var latestNewsListData = state.set('latestNewsList', latestNewsList)
                    .set('isLatestNewsList', false);
            }
            return latestNewsListData;

        case GET_ADS_LIST:
            let adsList = action.payload;
            var isAdsList = true;
            var adsListData = state.set('adsList', adsList)
                .set('isAdsList', isAdsList);
            if (adsList === '' || adsList === null) {
                var adsListData = state.set('adsList', adsList)
                    .set('isAdsList', false);
            }
            return adsListData;

        case GET_GAME_LIST:
            let gameList = action.payload;
            var isGameList = true;
            var gameListData = state.set('gameList', gameList)
                .set('isGameList', isGameList);
            if (gameList === '' || gameList === null) {
                var gameListData = state.set('gameList', gameList)
                    .set('isGameList', false);
            }
            return gameListData;

        case GET_GAME_H5_LIST:
            let gameH5List = action.payload;
            var isGameH5List = true;
            var gameH5ListData = state.set('gameH5List', gameH5List)
                .set('isGameH5List', isGameH5List);
            if (gameH5List === '' || gameH5List === null) {
                var gameH5ListData = state.set('gameH5List', gameH5List)
                    .set('isGameH5List', false);
            }
            return gameH5ListData;

        case GET_GAME_GIFT_LIST:
            let gameGiftList = action.payload;
            var isGameGiftList = true;
            var gameGiftListData = state.set('gameGiftList', gameGiftList)
                .set('isGameGiftList', isGameGiftList);
            if (gameGiftList === '' || gameGiftList === null) {
                var gameGiftListData = state.set('gameGiftList', gameGiftList)
                    .set('isGameGiftList', false);
            }
            return gameGiftListData;

        case GET_GIFT_LIST:
            let giftList = action.payload;
            var isGiftList = true;
            var giftListData = state.set('giftList', giftList)
                .set('isGiftList', isGiftList);
            if (giftList === '' || giftList === null) {
                var giftListData = state.set('giftList', giftList)
                    .set('isGiftList', false);
            }
            return giftListData;

        case GET_USER_GIFT_LIST:
            let userGiftList = action.payload;
            var isUserGiftList = true;
            var userGiftListData = state.set('userGiftList', userGiftList)
                .set('isUserGiftList', isUserGiftList);
            if (userGiftList === null) {
                var userGiftListData = state.set('userGiftList', userGiftList)
                    .set('isUserGiftList', false);
            }
            return userGiftListData;

        case GET_USER_CARD_LIST:
            let userCardList = action.payload;
            var isUserCardList = true;
            var userCardListData = state.set('userCardList', userCardList)
                .set('isUserCardList', isUserCardList);
            if (userCardList === null) {
                var userCardListData = state.set('userCardList', userCardList)
                    .set('isUserCardList', false);
            }
            return userCardListData;

        case GET_USER_TRANSACTION_LIST:
            let userTransactionList = action.payload;
            var isUserTransactionList = true;
            var userTransactionListData = state.set('userTransactionList', userTransactionList)
                .set('isUserTransactionList', isUserTransactionList);
            if (userTransactionList === null) {
                var userTransactionListData = state.set('userTransactionList', userTransactionList)
                    .set('isUserTransactionList', false);
            }
            return userTransactionListData;

        case GET_NOTIFICATION_LIST:
            let notificationList = action.payload;
            var isNotificationList = true;
            var notificationListData = state.set('notificationList', notificationList)
                .set('isNotificationList', isNotificationList);
            if (notificationList === null) {
                var notificationListData = state.set('notificationList', notificationList)
                    .set('isNotificationList', false);
            }
            return notificationListData;

        case USER_COUNT_MESS:
            let userCountMess = action.payload;
            if (userCountMess === '0') {
                userCountMess = null
            }
            return state.set('userCountMess', userCountMess);
    }

    return state;
}