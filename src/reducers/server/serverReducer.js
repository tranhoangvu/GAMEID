const {
    SET_USER_PROFILE,
    GET_GAME_LIST,
    GET_GAME_H5_LIST,
    GET_ADS_LIST,
    GET_NEWS_LIST,
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
            if (userLogin === null);
            var userLoginData = state.set('userLogin', userLogin)
                .set('isUserLogin', isUserLogin);
            return userLogin;

        case GET_NEWS_LIST:
            let newsList = action.payload;
            var isNewsList = true;
            if (newsList === null);
            var newsListData = state.set('newsList', newsList)
                .set('isNewsList', isNewsList);
            return newsListData;

        case GET_ADS_LIST:
            let adsList = action.payload;
            var isAdsList = true;
            if (adsList === null);
            var adsListData = state.set('adsList', adsList)
                .set('isAdsList', isAdsList);
            return adsListData;

        case GET_GAME_LIST:
            let gameList = action.payload;
            var isGameList = true;
            if (gameList === null);
            var gameListData = state.set('gameList', gameList)
                .set('isGameList', isGameList);
            return gameListData;

        case GET_GAME_H5_LIST:
            let gameH5List = action.payload;
            var isGameH5List = true;
            if (gameH5List === null);
            var gameH5ListData = state.set('gameH5List', gameH5List)
                .set('isGameH5List', isGameH5List);
            return gameH5ListData;

        case GET_GAME_GIFT_LIST:
            let gameGiftList = action.payload;
            var isGameGiftList = true;
            if (gameGiftList === null);
            var gameGiftListData = state.set('gameGiftList', gameGiftList)
                .set('isGameGiftList', isGameGiftList);
            return gameGiftListData;

        case GET_GIFT_LIST:
            let giftList = action.payload;
            var isGiftList = true;
            if (giftList === null);
            var giftListData = state.set('giftList', giftList)
                .set('isGiftList', isGiftList);
            return giftListData;

        case GET_USER_GIFT_LIST:
            let userGiftList = action.payload;
            var isUserGiftList = true;
            if (userGiftList === null);
            var userGiftListData = state.set('userGiftList', userGiftList)
                .set('isUserGiftList', isUserGiftList);
            return userGiftListData;

        case GET_USER_CARD_LIST:
            let userCardList = action.payload;
            var isUserCardList = true;
            if (userCardList === null);
            var userCardListData = state.set('userCardList', userCardList)
                .set('isUserCardList', isUserCardList);
            return userCardListData;

        case GET_USER_TRANSACTION_LIST:
            let userTransactionList = action.payload;
            var isUserTransactionList = true;
            if (userTransactionList === null);
            var userTransactionListData = state.set('userTransactionList', userTransactionList)
                .set('isUserTransactionList', isUserTransactionList);
            return userTransactionListData;

        case GET_NOTIFICATION_LIST:
            let notificationList = action.payload;
            var isNotificationList = true;
            if (notificationList === null);
            var notificationListData = state.set('notificationList', notificationList)
                .set('isNotificationList', isNotificationList);
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