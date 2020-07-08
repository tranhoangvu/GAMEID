import React, { Component } from 'react';
import firebase from 'react-native-firebase';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import FormData from 'form-data';
import md5 from 'md5';
import { loginEvent, getGiftCodeEvent } from '../lib/appEvent';

import { fetchData } from '../reducers/firebase/firebaseActions';
import {
    getGameList,
    getGameH5List,
    getNewsList,
    getAdsList,
    getGameGiftList,
    getGiftList,
    getUserGiftList,
    getUserCardList,
    getUserTransactionList,
    getNotificationList,
    userCountMess
} from '../reducers/server/serverActions';
import { refeshData, releaseStatus } from '../index.js';

var ls = require('./localStorage');

export async function firebaseFetchData(store) {
    await firebase.config().fetch(0)
        .then(() => firebase.config().activateFetched())
        .then(() => firebase.config().getKeysByPrefix('vtcapp_'))
        .then((arr) => firebase.config().getValues(arr))
        .then((objects) => {
            let data = {};
            Object.keys(objects).forEach((key) => {
                data[key] = objects[key].val();
            });
            // console.log(data);
            store.dispatch(fetchData(data));
            // ls.clear();
            ls.set('firebaseConfig', data);
        })
        .catch((error) => {
            console.log(`Error processing config: ${error}`);
            ls.get('firebaseConfig').then((data) => {
                if (data === null) {
                    store.dispatch(fetchData(null));
                } else {
                    store.dispatch(fetchData(data));
                }
            });
        })
}

export async function getAdsListData(store) {
    var key = store.getState().firebase.firebaseConfig.vtcapp_secure_key;
    var apiURL = store.getState().firebase.firebaseConfig.vtcapp_api_url;
    var device_id = store.getState().device.uniqueId;
    var secure_key = md5(device_id + key);

    var formData = new FormData();
    formData.append('device_id', device_id);
    formData.append('secure_key', secure_key);

    await fetch(apiURL + 'adslist_react', {
        method: 'POST',
        header: {
            'Accept': 'application/json',
            'Content-type': 'application/x-www-form-urlencoded'
        },
        body: formData //JSON.stringify(body)
    })
        .then((response) => response.json())
        .then((responseJson) => {
            store.dispatch(getAdsList(responseJson));
            // ls.clear(); //remove ads
            ls.get(responseJson[0].app_ads_id).then((data) => {
                // console.log(data);
                if (data === null) {
                    ls.set(responseJson[0].app_ads_id, true);
                }
            });
        })
        .catch((err) => {
            console.log(err);
            store.dispatch(getAdsList(null));
        });
}

export async function getNewsListData(store) {
    var newsApiURL = store.getState().firebase.firebaseConfig.vtcapp_news_api_url;

    await fetch(newsApiURL, {
        method: 'GET',
    })
        .then((response) => response.json())
        .then((responseJson) => {
            const newData = [];
            for (let newVar of responseJson) {
                let temp =
                {
                    "id": newVar.id,
                    "date": newVar.date,
                    "title": newVar.title.rendered,
                    "link": newVar.link,
                    "image": newVar._embedded['wp:featuredmedia'][0].source_url,
                };
                newData.push(temp);
            }
            store.dispatch(getNewsList(newData));
        })
        .catch((err) => {
            console.log(err);
            store.dispatch(getNewsList(null));
        });
}

export async function getGameListData(store) {
    var key = store.getState().firebase.firebaseConfig.vtcapp_secure_key;
    var apiURL = store.getState().firebase.firebaseConfig.vtcapp_api_url;
    var device_id = store.getState().device.uniqueId;
    var platform = store.getState().device.platform;
    var secure_key = md5(device_id + key);

    var formData = new FormData();
    formData.append('device_id', device_id);
    formData.append('secure_key', secure_key);
    formData.append('platform', platform);

    await fetch(apiURL + 'gamelist_react', {
        method: 'POST',
        header: {
            'Accept': 'application/json',
            'Content-type': 'application/x-www-form-urlencoded'
        },
        body: formData //JSON.stringify(body)
    })
        .then((response) => response.json())
        .then((responseJson) => {
            store.dispatch(getGameList(responseJson));
            if (!releaseStatus()) store.dispatch(getGameList(null));
        })
        .catch((err) => {
            console.log(err);
            console.log(apiURL + 'gamelist_react');
            store.dispatch(getGameList(null));
        });
}

export async function getGameH5ListData(store) {
    var key = store.getState().firebase.firebaseConfig.vtcapp_secure_key;
    var apiURL = store.getState().firebase.firebaseConfig.vtcapp_api_url;
    var device_id = store.getState().device.uniqueId;
    var secure_key = md5(device_id + key);

    var formData = new FormData();
    formData.append('device_id', device_id);
    formData.append('secure_key', secure_key);

    await fetch(apiURL + 'gameh5_list_react', {
        method: 'POST',
        header: {
            'Accept': 'application/json',
            'Content-type': 'application/x-www-form-urlencoded'
        },
        body: formData //JSON.stringify(body)
    })
        .then((response) => response.json())
        .then((responseJson) => {
            store.dispatch(getGameH5List(responseJson));
            if (!releaseStatus()) store.dispatch(getGameH5List(null));
        })
        .catch((err) => {
            console.log(err);
            store.dispatch(getGameH5List(null));
        });
}

export async function getGiftListData(store) {
    var key = store.getState().firebase.firebaseConfig.vtcapp_secure_key;//"97fe5723139d280d50fb14d6cfd4b8d3";
    var apiURL = store.getState().firebase.firebaseConfig.vtcapp_api_url;
    var device_id = store.getState().device.uniqueId;
    var platform = store.getState().device.platform;
    var secure_key = md5(device_id + key);

    var formData = new FormData();
    formData.append('device_id', device_id);
    formData.append('secure_key', secure_key);
    formData.append('platform', platform);

    await fetch(apiURL + 'giftlist_react', {
        method: 'POST',
        header: {
            'Accept': 'application/json',
            'Content-type': 'application/x-www-form-urlencoded'
        },
        body: formData //JSON.stringify(body)
    })
        .then((response) => response.json())
        .then((responseJson) => {
            store.dispatch(getGiftList(responseJson));
            if (!releaseStatus()) store.dispatch(getGiftList(null));
        })
        .catch((err) => {
            console.log('getGiftListData: ' + err);
            store.dispatch(getGiftList(null));
        });
}

export async function getNotificationListData(store) {
    var key = store.getState().firebase.firebaseConfig.vtcapp_secure_key;//"97fe5723139d280d50fb14d6cfd4b8d3";
    var apiURL = store.getState().firebase.firebaseConfig.vtcapp_api_url;
    var user_uid = store.getState().auth.userProfile.uid;
    var device_id = store.getState().device.uniqueId;
    var secure_key = md5(device_id + key);

    var formData = new FormData();
    formData.append('user_uid', user_uid);
    formData.append('device_id', device_id);
    formData.append('secure_key', secure_key);

    await fetch(apiURL + 'usermesslist_react', {
        method: 'POST',
        header: {
            'Accept': 'application/json',
            'Content-type': 'application/x-www-form-urlencoded'
        },
        body: formData //JSON.stringify(body)
    })
        .then((response) => response.json())
        .then((responseJson) => {
            store.dispatch(getNotificationList(responseJson));
            if (!releaseStatus()) store.dispatch(getNotificationList(null));
        })
        .catch((err) => {
            console.log(err);
            store.dispatch(getNotificationList(null));
        });
}

export async function getUserGiftListData(store) {
    var key = store.getState().firebase.firebaseConfig.vtcapp_secure_key;//"97fe5723139d280d50fb14d6cfd4b8d3";
    var apiURL = store.getState().firebase.firebaseConfig.vtcapp_api_url;
    var user_uid = store.getState().auth.userProfile.uid;
    var device_id = store.getState().device.uniqueId;
    var secure_key = md5(device_id + key);

    var formData = new FormData();
    formData.append('user_uid', user_uid);
    formData.append('device_id', device_id);
    formData.append('secure_key', secure_key);

    await fetch(apiURL + 'usergiftlist_react', {
        method: 'POST',
        header: {
            'Accept': 'application/json',
            'Content-type': 'application/x-www-form-urlencoded'
        },
        body: formData //JSON.stringify(body)
    })
        .then((response) => response.json())
        .then((responseJson) => {
            store.dispatch(getUserGiftList(responseJson));
        })
        .catch((err) => {
            store.dispatch(getUserGiftList(null));
            console.log(err);
        });
}

export async function getUserTransactionListData(store) {
    var key = store.getState().firebase.firebaseConfig.vtcapp_secure_key; //"97fe5723139d280d50fb14d6cfd4b8d3";
    var apiURL = store.getState().firebase.firebaseConfig.vtcapp_api_url;
    var user_uid = store.getState().auth.userProfile.uid;
    var device_id = store.getState().device.uniqueId;
    var secure_key = md5(device_id + key);

    var formData = new FormData();
    formData.append('user_uid', user_uid);
    formData.append('device_id', device_id);
    formData.append('secure_key', secure_key);

    await fetch(apiURL + 'usertransactionlist_react', {
        method: 'POST',
        header: {
            'Accept': 'application/json',
            'Content-type': 'application/x-www-form-urlencoded'
        },
        body: formData //JSON.stringify(body)
    })
        .then((response) => response.json())
        .then((responseJson) => {
            store.dispatch(getUserTransactionList(responseJson));
            // console.log(responseJson);
        })
        .catch((err) => {
            store.dispatch(getUserTransactionList(null));
            console.log(err);
        });
}

export async function getUserCardListData(store) {
    var key = store.getState().firebase.firebaseConfig.vtcapp_secure_key; //"97fe5723139d280d50fb14d6cfd4b8d3";
    var apiURL = store.getState().firebase.firebaseConfig.vtcapp_api_url;
    var user_uid = store.getState().auth.userProfile.uid;
    var device_id = store.getState().device.uniqueId;
    var secure_key = md5(device_id + key);

    var formData = new FormData();
    formData.append('user_uid', user_uid);
    formData.append('device_id', device_id);
    formData.append('secure_key', secure_key);

    await fetch(apiURL + 'usercardlist_react', {
        method: 'POST',
        header: {
            'Accept': 'application/json',
            'Content-type': 'application/x-www-form-urlencoded'
        },
        body: formData //JSON.stringify(body)
    })
        .then((response) => response.json())
        .then((responseJson) => {
            store.dispatch(getUserCardList(responseJson));
            // console.log(responseJson);
        })
        .catch((err) => {
            store.dispatch(getUserCardList(null));
            console.log(err);
        });
}

export async function userCountMessData(store) {
    var key = store.getState().firebase.firebaseConfig.vtcapp_secure_key;//"97fe5723139d280d50fb14d6cfd4b8d3";
    var apiURL = store.getState().firebase.firebaseConfig.vtcapp_api_url;
    var user_uid = store.getState().auth.userProfile.uid;
    var device_id = store.getState().device.uniqueId;
    var secure_key = md5(device_id + key);

    var formData = new FormData();
    formData.append('user_uid', user_uid);
    formData.append('device_id', device_id);
    formData.append('secure_key', secure_key);

    await fetch(apiURL + 'usercountmess_react', {
        method: 'POST',
        header: {
            'Accept': 'application/json',
            'Content-type': 'application/x-www-form-urlencoded'
        },
        body: formData //JSON.stringify(body)
    })
        .then((response) => response.json())
        .then((responseJson) => {
            if (responseJson.msg < 100) {
                store.dispatch(userCountMess(responseJson.msg));
            } else {
                store.dispatch(userCountMess('99+'));
            }
            if (!releaseStatus()) store.dispatch(userCountMess(null));

        })
        .catch((err) => {
            console.log(err);
            store.dispatch(userCountMess(null));
        });
}

export async function setUserProfileData(store) {
    var key = store.getState().firebase.firebaseConfig.vtcapp_secure_key;//"97fe5723139d280d50fb14d6cfd4b8d3";
    var apiURL = store.getState().firebase.firebaseConfig.vtcapp_api_url;
    var device_id = store.getState().device.uniqueId;
    var platform = store.getState().device.platform;
    var secure_key = md5(device_id + key);

    var user_uid = store.getState().auth.userProfile.uid;
    var user_name = store.getState().auth.userProfile.displayName;
    var user_sid = store.getState().auth.userProfile.providerData[0].uid;
    var user_phone_number = store.getState().auth.userProfile.phoneNumber;
    var user_email = store.getState().auth.userProfile.email;
    var user_provider = store.getState().auth.userProfile.providerData[0].providerId;
    var user_email_verified = store.getState().auth.userProfile.emailVerified;
    // var onesign_push_token = store.getState().device.onesignal.pushToken;
    var user_onesign_id = store.getState().device.onesignal.userId;

    var formData = new FormData();
    formData.append('platform', platform);
    formData.append('user_uid', user_uid);
    formData.append('user_name', user_name);
    formData.append('user_sid', user_sid);
    formData.append('user_phone_number', user_phone_number);
    formData.append('user_email', user_email);
    formData.append('user_provider', user_provider);
    formData.append('user_email_verified', user_email_verified);
    // formData.append('onesign_push_token', onesign_push_token);
    formData.append('user_onesign_id', user_onesign_id);
    formData.append('device_id', device_id);
    formData.append('secure_key', secure_key);


    await fetch(apiURL + 'newuser_react', {
        method: 'POST',
        header: {
            'Accept': 'application/json',
            'Content-type': 'application/x-www-form-urlencoded'
        },
        body: formData //JSON.stringify(body)
    })
        .then((response) => response.json())
        .then((responseJson) => {
            if (responseJson.status !== '0') {
                loginEvent(responseJson.status);
            }
        })
        .catch((err) => {
            console.log(err);
        });
}

export function updateEmailVerifiedData(store) {
    var key = store.getState().firebase.firebaseConfig.vtcapp_secure_key; //"97fe5723139d280d50fb14d6cfd4b8d3";
    var apiURL = store.getState().firebase.firebaseConfig.vtcapp_api_url;
    var device_id = store.getState().device.uniqueId;
    var secure_key = md5(device_id + key);
    var user_uid = store.getState().auth.userProfile.uid;

    var formData = new FormData();
    formData.append('user_uid', user_uid);
    formData.append('device_id', device_id);
    formData.append('secure_key', secure_key);

    fetch(apiURL + 'update_email_verified_react', {
        method: 'POST',
        header: {
            'Accept': 'application/json',
            'Content-type': 'application/x-www-form-urlencoded'
        },
        body: formData //JSON.stringify(body)
    })
        .then((response) => response.json())
        .then((responseJson) => {
            // console.log(responseJson.msg);
        })
        .catch((err) => {
            console.log(err);
        });
}

export function updateTransactionData(store, transactionID) {
    var key = store.getState().firebase.firebaseConfig.vtcapp_secure_key; //"97fe5723139d280d50fb14d6cfd4b8d3";
    var apiURL = store.getState().firebase.firebaseConfig.vtcapp_api_url;
    var device_id = store.getState().device.uniqueId;
    var secure_key = md5(device_id + key);
    var user_uid = store.getState().auth.userProfile.uid;
    var transaction_status = '2';
    // console.log(transactionID);
    var formData = new FormData();
    formData.append('user_uid', user_uid);
    formData.append('device_id', device_id);
    formData.append('secure_key', secure_key);
    formData.append('transaction_status', transaction_status);
    formData.append('order_code', transactionID);

    fetch(apiURL + 'update_transaction_react', {
        method: 'POST',
        header: {
            'Accept': 'application/json',
            'Content-type': 'application/x-www-form-urlencoded'
        },
        body: formData //JSON.stringify(body)
    })
        .then((response) => response.json())
        .then((responseJson) => {
            console.log(responseJson.msg);
        })
        .catch((err) => {
            console.log(err);
        });
}

export function updatePhoneNumberData(store, phoneNumber) {
    var key = store.getState().firebase.firebaseConfig.vtcapp_secure_key; //"97fe5723139d280d50fb14d6cfd4b8d3";
    var apiURL = store.getState().firebase.firebaseConfig.vtcapp_api_url;
    var device_id = store.getState().device.uniqueId;
    var secure_key = md5(device_id + key);
    var user_uid = store.getState().auth.userProfile.uid;

    var formData = new FormData();
    formData.append('user_uid', user_uid);
    formData.append('device_id', device_id);
    formData.append('secure_key', secure_key);
    formData.append('phone_number', phoneNumber);

    if (phoneNumber !== null) {
        fetch(apiURL + 'update_phone_number_react', {
            method: 'POST',
            header: {
                'Accept': 'application/json',
                'Content-type': 'application/x-www-form-urlencoded'
            },
            body: formData //JSON.stringify(body)
        })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson.msg);
            })
            .catch((err) => {
                console.log(err);
            });
    }
}

export function updateFirebaseTokenData(store) {
    var key = store.getState().firebase.firebaseConfig.vtcapp_secure_key;//"97fe5723139d280d50fb14d6cfd4b8d3";
    var apiURL = store.getState().firebase.firebaseConfig.vtcapp_api_url;
    var device_id = store.getState().device.uniqueId;
    var platform = store.getState().device.platform;
    var secure_key = md5(device_id + key);

    var user_uid = store.getState().auth.userProfile.uid;
    var device_firebase_token = store.getState().auth.firebaseToken;

    var formData = new FormData();
    formData.append('platform', platform);
    formData.append('user_uid', user_uid);
    formData.append('device_id', device_id);
    formData.append('secure_key', secure_key);
    formData.append('device_firebase_token', device_firebase_token);

    if (device_firebase_token !== '') {
        fetch(apiURL + 'update_firebase_token_react', {
            method: 'POST',
            header: {
                'Accept': 'application/json',
                'Content-type': 'application/x-www-form-urlencoded'
            },
            body: formData //JSON.stringify(body)
        })
            .then((response) => response.json())
            .then((responseJson) => {
                // console.log(responseJson.msg);
            })
            .catch((err) => {
                console.log(err);
            });
    }
}

export async function getGameGiftListData(store) {
    var key = store.getState().firebase.firebaseConfig.vtcapp_secure_key;//"97fe5723139d280d50fb14d6cfd4b8d3";
    var apiURL = store.getState().firebase.firebaseConfig.vtcapp_api_url;
    var device_id = store.getState().device.uniqueId;
    var platform = store.getState().device.platform;
    var secure_key = md5(device_id + key);

    var formData = new FormData();
    formData.append('device_id', device_id);
    formData.append('secure_key', secure_key);
    formData.append('platform', platform);

    await fetch(apiURL + 'gamegiftlist_react', {
        method: 'POST',
        header: {
            'Accept': 'application/json',
            'Content-type': 'application/x-www-form-urlencoded'
        },
        body: formData //JSON.stringify(body)
    })
        .then((response) => response.json())
        .then((responseJson) => {
            store.dispatch(getGameGiftList(responseJson));
            if (!releaseStatus()) store.dispatch(getGameGiftList(null));
        })
        .catch((err) => {
            console.log(err);
            store.dispatch(getGameGiftList(null));
        });
}

export function getGiftCode(user_uid, giftcode_event_id, key, device_id, apiURL) {
    var secure_key = md5(device_id + key);
    var apiURL = apiURL;
    var formData = new FormData();

    formData.append('user_uid', user_uid);
    formData.append('giftcode_event_id', giftcode_event_id);
    formData.append('device_id', device_id);
    formData.append('secure_key', secure_key);

    fetch(apiURL + 'getgift_react', {
        method: 'POST',
        header: {
            'Accept': 'application/json',
            'Content-type': 'application/x-www-form-urlencoded'
        },
        body: formData
    })
        .then((response) => response.json())
        .then((responseJson) => {
            refeshData("2");
            getGiftCodeEvent();
            alert(responseJson.msg);
        })
        .catch((err) => {
            console.log(err);
        });
}

export function readNotifi(user_uid, key, device_id, apiURL) {
    var secure_key = md5(device_id + key);
    var apiURL = apiURL;
    var formData = new FormData();

    formData.append('user_uid', user_uid);
    formData.append('device_id', device_id);
    formData.append('secure_key', secure_key);

    fetch(apiURL + 'update_mess_react', {
        method: 'POST',
        header: {
            'Accept': 'application/json',
            'Content-type': 'application/x-www-form-urlencoded'
        },
        body: formData
    })
        .then((response) => response.json())
        .then((responseJson) => {
            alert(responseJson.msg);
            refeshData("5");
        })
        .catch((err) => {
            console.log(err);
        });
}