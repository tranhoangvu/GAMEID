import axios from 'axios';
import firebase from 'react-native-firebase';
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
import { refeshData } from '../index.js';

var ls = require('./localStorage');

export async function fetchFirebaseData(store) {
    let data = {};
    await firebase.config().fetch(0)
        .then(() => firebase.config().activateFetched())
        .then(() => firebase.config().getKeysByPrefix('vtcapp_'))
        .then((arr) => firebase.config().getValues(arr))
        .then((objects) => {
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
    return data;
}

export async function fetchGameData(store) {
    // const ads_open = store.getState().firebase.firebaseConfig.vtcapp_ads_open;
    const key = store.getState().firebase.firebaseConfig.vtcapp_secure_key;
    const apiURL = store.getState().firebase.firebaseConfig.vtcapp_api_url;
    const device_id = store.getState().device.uniqueId;
    const secure_key = md5(device_id + key);
    const platform = store.getState().device.platform;

    await Promise.all([getAdsListData(apiURL, device_id, secure_key), getGameListData(apiURL, device_id, secure_key, platform), getGameH5ListData(apiURL, device_id, secure_key), getGameGiftListData(apiURL, device_id, secure_key, platform), getGiftListData(apiURL, device_id, secure_key, platform)])
        .then(function (response) {
            // const testgetAdsList = results[0];
            // const testgetAdsList2 = results[1];
            // console.log(response[0].data);
            // console.log(response[1].data);
            // console.log(response[2].data);
            // console.log(response[3].data);
            // console.log(response[4].data);
            if (response[0].data != '') {
                store.dispatch(getAdsList(response[0].data));
                ls.get(response[0].data[0].app_ads_id).then((data) => {
                    // console.log("ads_get: " + data);
                    // console.log("ads_open: " + response[0].data[0].app_ads_display);
                    if (data === null || response[0].data[0].app_ads_display == 1) {
                        ls.set(response[0].data[0].app_ads_id, true);
                        // console.log("ads_open: " + response[0].data[0].app_ads_display);
                    }
                });
            }
            if (response[1].data != '') {
                store.dispatch(getGameList(response[1].data));
                ls.set('getGameListData', response[1].data);
            }
            if (response[2].data != '') {
                store.dispatch(getGameH5List(response[2].data));
                ls.set('getGameH5ListData', response[2].data);
            }
            if (response[3].data != '') {
                store.dispatch(getGameGiftList(response[3].data));
                ls.set('getGameGiftList', response[3].data);
            }
            if (response[4].data != '') {
                store.dispatch(getGiftList(response[4].data));
                ls.set('getGiftListData', response[4].data);
            }
        })
        .catch((error) => {
            console.log(`Error in promises ${error}`);
        });
}

export async function setUserData(store) {
    await Promise.all([setUserProfileData(store), userCountMessData(store)])
        .then(function (response) {
            // const testgetAdsList = results[0];
            // const testgetAdsList2 = results[1];
            // console.log(response[0].data);
            // console.log(response[1].data);
            // console.log(response[2].data);
            // console.log(response[3].data);

            if (response[0].data != '') {
                if (response[0].data.status !== '0') {
                    loginEvent(response[0].data.status);
                }
            }
            if (response[1].data != '') {
                store.dispatch(userCountMess(response[1].data.msg));
                ls.set('userCountMessData', response[1].data.msg);
            }
            // if (response[2].data != '') {
            //     store.dispatch(getNotificationList(response[2].data));
            //     ls.set('getNotificationListData', response[2].data);
            // }
            // if (response[3].data != '') {
            //     store.dispatch(getUserGiftList(response[3].data));
            //     ls.set('getUserGiftListData', response[3].data);
            // }
        })
        .catch((error) => {
            console.log(`Error in promises ${error}`);
        });
}

export async function fetchUserData(store) {
    await Promise.all([getNotificationListData(store), getUserGiftListData(store)])
        .then(function (response) {
            // const testgetAdsList = results[0];
            // const testgetAdsList2 = results[1];
            // console.log(response[0].data);
            // console.log(response[1].data);
            // console.log(response[2].data);
            // console.log(response[3].data);

            // if (response[0].data != '') {
            //     if (response[0].data.status !== '0') {
            //         loginEvent(response[0].data.status);
            //     }
            // }
            // if (response[1].data != '') {
            //     store.dispatch(userCountMess(response[1].data.msg));
            //     ls.set('userCountMessData', response[1].data.msg);
            // }
            if (response[0].data != '') {
                store.dispatch(getNotificationList(response[0].data));
                ls.set('getNotificationListData', response[0].data);
            }
            if (response[1].data != '') {
                store.dispatch(getUserGiftList(response[1].data));
                ls.set('getUserGiftListData', response[1].data);
            }
        })
        .catch((error) => {
            console.log(`Error in promises ${error}`);
        });
}

export function getAdsListData(apiURL, device_id, secure_key) {
    // var key = store.getState().firebase.firebaseConfig.vtcapp_secure_key;
    // var apiURL = store.getState().firebase.firebaseConfig.vtcapp_api_url;
    // var imageURL = store.getState().firebase.firebaseConfig.vtcapp_image_url;
    // var ads_open = store.getState().firebase.firebaseConfig.vtcapp_ads_open;
    // var device_id = store.getState().device.uniqueId;
    // var secure_key = md5(device_id + key);

    var formData = new FormData();
    formData.append('device_id', device_id);
    formData.append('secure_key', secure_key);

    return axios({
        method: 'post',
        url: apiURL + 'adslist_react',
        data: formData,
        // headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
    // .then(function (response) {
    //     //handle success
    //     // console.log(response.data);
    //     if (response.data != '') {
    //         store.dispatch(getAdsList(response.data));
    //         ls.get(response.data[0].app_ads_id).then((data) => {
    //             console.log(data);
    //             if (data === null || ads_open === true) {
    //                 ls.set(response.data[0].app_ads_id, true);
    //             }
    //         });
    //         // if (ads_open == true) {
    //         //     ls.set(response.data[0].app_ads_id, true);
    //         //     // ls.remove(response.data[0].app_ads_id); //remove ads - alway display
    //         // } else {
    //         //     ls.set(response.data[0].app_ads_id, false);
    //         // }
    //         FastImage.preload([
    //             {
    //                 uri: imageURL + response.data[0].app_ads_image_link
    //             }
    //         ])
    //         // ls.get(response.data[0].app_ads_id).then((data) => {
    //         //     console.log(data);
    //         //     if (data === null) {
    //         //         ls.set(response.data[0].app_ads_id, true);
    //         //         FastImage.preload([
    //         //             {
    //         //                 uri: imageURL + response.data[0].app_ads_image_link
    //         //             }
    //         //         ])
    //         //     }
    //         // });
    //     }
    // })
    // .catch(function (response) {
    //     //handle error
    //     console.log(response);
    //     store.dispatch(getAdsList(null));
    // });

    // await fetch(apiURL + 'adslist_react', {
    //     method: 'POST',
    //     header: {
    //         'Accept': 'application/json',
    //         'Content-type': 'application/json'
    //     },
    //     body: formData //JSON.stringify(body)
    // })
    //     .then((response) => response.json())
    //     .then((responseJson) => {
    //         store.dispatch(getAdsList(responseJson));
    //         // ls.clear(); //remove ads
    //         ls.get(responseJson[0].app_ads_id).then((data) => {
    //             // console.log(data);
    //             if (data === null) {
    //                 ls.set(responseJson[0].app_ads_id, true);
    //                 FastImage.preload([
    //                     {
    //                         uri: imageURL + responseJson[0].app_ads_image_link
    //                     }
    //                 ])
    //             }
    //         });
    //     })
    //     .catch((err) => {
    //         console.log(err);
    //         store.dispatch(getAdsList(null));
    //     });
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
            ls.set('getNewsListData', newData);
        })
        .catch((err) => {
            console.log(err);
            store.dispatch(getNewsList(null));
        });
}

export function getGameListData(apiURL, device_id, secure_key, platform) {
    // var key = store.getState().firebase.firebaseConfig.vtcapp_secure_key;
    // var apiURL = store.getState().firebase.firebaseConfig.vtcapp_api_url;
    // var imageURL = store.getState().firebase.firebaseConfig.vtcapp_image_url;
    // var device_id = store.getState().device.uniqueId;
    // var platform = store.getState().device.platform;
    // var secure_key = md5(device_id + key);

    var formData = new FormData();
    formData.append('device_id', device_id);
    formData.append('secure_key', secure_key);
    formData.append('platform', platform);

    return axios({
        method: 'post',
        url: apiURL + 'gamelist_react',
        data: formData,
        // headers: { 'Content-Type': 'multipart/form-data' }
    })
    // .then(function (response) {
    //     //handle success
    //     if (response.data != '') {
    //         response.data.map((item) => {
    //             FastImage.preload([
    //                 {
    //                     uri: imageURL + item.game_icon_link
    //                 },
    //                 {
    //                     uri: imageURL + item.game_cover_link
    //                 }
    //             ])
    //         })
    //         store.dispatch(getGameList(response.data));
    //         ls.set('getGameListData', response.data);
    //     }
    // })
    // .catch(function (response) {
    //     //handle error
    //     console.log("getGameListData: " + response);
    //     store.dispatch(getGameList(null));
    // });

    // await fetch(apiURL + 'gamelist_react', {
    //     method: 'POST',
    //     header: {
    //         'Accept': 'application/json',
    //         'Content-type': 'application/json'
    //     },
    //     body: formData //JSON.stringify(body)
    // })
    //     .then((response) => response.json())
    //     .then((responseJson) => {
    //         console.log(responseJson);
    //         responseJson.map((item) => {
    //             // console.log(item.game_icon_link);
    //             FastImage.preload([
    //                 {
    //                     uri: imageURL + item.game_icon_link
    //                 },
    //                 {
    //                     uri: imageURL + item.game_cover_link
    //                 }
    //             ])
    //         })
    //         store.dispatch(getGameList(responseJson));
    //         ls.set('getGameListData', responseJson);
    //         // if (!releaseStatus()) store.dispatch(getGameList(null));
    //     })
    //     .catch((err) => {
    //         console.log(err);
    //         store.dispatch(getGameList(null));
    //     });
}

export function getGameH5ListData(apiURL, device_id, secure_key) {
    // var key = store.getState().firebase.firebaseConfig.vtcapp_secure_key;
    // var apiURL = store.getState().firebase.firebaseConfig.vtcapp_api_url;
    // var imageURL = store.getState().firebase.firebaseConfig.vtcapp_image_url;
    // var device_id = store.getState().device.uniqueId;
    // var secure_key = md5(device_id + key);

    var formData = new FormData();
    formData.append('device_id', device_id);
    formData.append('secure_key', secure_key);

    return axios({
        method: 'post',
        url: apiURL + 'gameh5_list_react',
        data: formData,
        // headers: { 'Content-Type': 'multipart/form-data' }
    })
    // .then(function (response) {
    //     //handle success
    //     if (response.data != '') {
    //         response.data.map((item) => {
    //             FastImage.preload([
    //                 {
    //                     uri: imageURL + item.game_icon_link
    //                 }
    //             ])
    //         })
    //         store.dispatch(getGameH5List(response.data));
    //         ls.set('getGameH5ListData', response.data);
    //     }
    // })
    // .catch(function (response) {
    //     //handle error
    //     console.log(response);
    //     store.dispatch(getGameH5List(null));
    // });

    // await fetch(apiURL + 'gameh5_list_react', {
    //     method: 'POST',
    //     header: {
    //         'Accept': 'application/json',
    //         'Content-type': 'application/json'
    //     },
    //     body: formData //JSON.stringify(body)
    // })
    //     .then((response) => response.json())
    //     .then((responseJson) => {
    //         responseJson.map((item) => {
    //             // console.log(item.game_icon_link);
    //             FastImage.preload([
    //                 {
    //                     uri: imageURL + item.game_icon_link
    //                 }
    //             ])
    //         })
    //         store.dispatch(getGameH5List(responseJson));
    //         ls.set('getGameH5ListData', responseJson);
    //         // if (!releaseStatus()) store.dispatch(getGameH5List(null));
    //     })
    //     .catch((err) => {
    //         console.log(err);
    //         store.dispatch(getGameH5List(null));
    //     });
}

export function getGiftListData(apiURL, device_id, secure_key, platform) {
    // var key = store.getState().firebase.firebaseConfig.vtcapp_secure_key;//"97fe5723139d280d50fb14d6cfd4b8d3";
    // var apiURL = store.getState().firebase.firebaseConfig.vtcapp_api_url;
    // var device_id = store.getState().device.uniqueId;
    // var platform = store.getState().device.platform;
    // var secure_key = md5(device_id + key);

    var formData = new FormData();
    formData.append('device_id', device_id);
    formData.append('secure_key', secure_key);
    formData.append('platform', platform);
    // console.log(formData);
    return axios({
        method: 'post',
        url: apiURL + 'giftlist_react',
        data: formData,
        // headers: { 'Content-Type': 'multipart/form-data' }
    })
    // .then(function (response) {
    //     //handle success
    //     store.dispatch(getGiftList(response.data));
    //     ls.set('getGiftListData', response.data);
    // })
    // .catch(function (response) {
    //     //handle error
    //     console.log(response);
    //     store.dispatch(getGiftList(null));
    // });

    // await fetch(apiURL + 'giftlist_react', {
    //     method: 'POST',
    //     header: {
    //         'Accept': 'application/json',
    //         'Content-type': 'application/json'
    //     },
    //     body: formData //JSON.stringify(body)
    // })
    //     .then((response) => response.json())
    //     .then((responseJson) => {
    //         // console.log(responseJson);
    //         store.dispatch(getGiftList(responseJson));
    //         ls.set('getGiftListData', responseJson);
    //         // if (!releaseStatus()) store.dispatch(getGiftList(null));
    //     })
    //     .catch((err) => {
    //         console.log('getGiftListData: ' + err);
    //         store.dispatch(getGiftList(null));
    //     });
}

function getNotificationListData(store) {
    var key = store.getState().firebase.firebaseConfig.vtcapp_secure_key;//"97fe5723139d280d50fb14d6cfd4b8d3";
    var apiURL = store.getState().firebase.firebaseConfig.vtcapp_api_url;
    var user_uid = store.getState().auth.userProfile.uid;
    var device_id = store.getState().device.uniqueId;
    var secure_key = md5(device_id + key);

    var formData = new FormData();
    formData.append('user_uid', user_uid);
    formData.append('device_id', device_id);
    formData.append('secure_key', secure_key);

    return axios({
        method: 'post',
        url: apiURL + 'usermesslist_react',
        data: formData,
        // headers: { 'Content-Type': 'multipart/form-data' }
    })
    // .then(function (response) {
    //     //handle success
    //     store.dispatch(getNotificationList(response.data));
    //     ls.set('getNotificationListData', response.data);
    // })
    // .catch(function (response) {
    //     //handle error
    //     console.log(response);
    //     store.dispatch(getNotificationList(null));
    // });

    // await fetch(apiURL + 'usermesslist_react', {
    //     method: 'POST',
    //     header: {
    //         'Accept': 'application/json',
    //         'Content-type': 'application/json'
    //     },
    //     body: formData //JSON.stringify(body)
    // })
    //     .then((response) => response.json())
    //     .then((responseJson) => {
    //         store.dispatch(getNotificationList(responseJson));
    //         ls.set('getNotificationListData', responseJson);
    //         // if (!releaseStatus()) store.dispatch(getNotificationList(null));
    //     })
    //     .catch((err) => {
    //         console.log(err);
    //         store.dispatch(getNotificationList(null));
    //     });
}

function getUserGiftListData(store) {
    var key = store.getState().firebase.firebaseConfig.vtcapp_secure_key;//"97fe5723139d280d50fb14d6cfd4b8d3";
    var apiURL = store.getState().firebase.firebaseConfig.vtcapp_api_url;
    var user_uid = store.getState().auth.userProfile.uid;
    var device_id = store.getState().device.uniqueId;
    var secure_key = md5(device_id + key);

    var formData = new FormData();
    formData.append('user_uid', user_uid);
    formData.append('device_id', device_id);
    formData.append('secure_key', secure_key);

    return axios({
        method: 'post',
        url: apiURL + 'usergiftlist_react',
        data: formData,
        // headers: { 'Content-Type': 'multipart/form-data' }
    })
    // .then(function (response) {
    //     //handle success
    //     store.dispatch(getUserGiftList(response.data));
    //     ls.set('getUserGiftListData', response.data);
    // })
    // .catch(function (response) {
    //     //handle error
    //     console.log(response);
    //     store.dispatch(getUserGiftList(null));
    // });

    // await fetch(apiURL + 'usergiftlist_react', {
    //     method: 'POST',
    //     header: {
    //         'Accept': 'application/json',
    //         'Content-type': 'application/json'
    //     },
    //     body: formData //JSON.stringify(body)
    // })
    //     .then((response) => response.json())
    //     .then((responseJson) => {
    //         store.dispatch(getUserGiftList(responseJson));
    //         ls.set('getUserGiftListData', responseJson);
    //     })
    //     .catch((err) => {
    //         store.dispatch(getUserGiftList(null));
    //         console.log(err);
    //     });
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

    await axios({
        method: 'post',
        url: apiURL + 'usertransactionlist_react',
        data: formData,
        // headers: { 'Content-Type': 'multipart/form-data' }
    })
        .then(function (response) {
            //handle success
            store.dispatch(getUserTransactionList(response.data));
            ls.set('getUserTransactionListData', response.data);
        })
        .catch(function (response) {
            //handle error
            console.log(response);
            store.dispatch(getUserTransactionList(null));
        });

    // await fetch(apiURL + 'usertransactionlist_react', {
    //     method: 'POST',
    //     header: {
    //         'Accept': 'application/json',
    //         'Content-type': 'application/json'
    //     },
    //     body: formData //JSON.stringify(body)
    // })
    //     .then((response) => response.json())
    //     .then((responseJson) => {
    //         store.dispatch(getUserTransactionList(responseJson));
    //         ls.set('getUserTransactionListData', responseJson);
    //         // console.log(responseJson);
    //     })
    //     .catch((err) => {
    //         store.dispatch(getUserTransactionList(null));
    //         console.log(err);
    //     });
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

    await axios({
        method: 'post',
        url: apiURL + 'usercardlist_react',
        data: formData,
        // headers: { 'Content-Type': 'multipart/form-data' }
    })
        .then(function (response) {
            //handle success
            store.dispatch(getUserCardList(response.data));
            ls.set('getUserCardListData', response.data);
        })
        .catch(function (response) {
            //handle error
            console.log(response);
            store.dispatch(getUserCardList(null));
        });

    // await fetch(apiURL + 'usercardlist_react', {
    //     method: 'POST',
    //     header: {
    //         'Accept': 'application/json',
    //         'Content-type': 'application/json'
    //     },
    //     body: formData //JSON.stringify(body)
    // })
    //     .then((response) => response.json())
    //     .then((responseJson) => {
    //         store.dispatch(getUserCardList(responseJson));
    //         ls.set('getUserCardListData', responseJson);
    //         // console.log(responseJson);
    //     })
    //     .catch((err) => {
    //         store.dispatch(getUserCardList(null));
    //         console.log(err);
    //     });
}

function userCountMessData(store) {
    var key = store.getState().firebase.firebaseConfig.vtcapp_secure_key;//"97fe5723139d280d50fb14d6cfd4b8d3";
    var apiURL = store.getState().firebase.firebaseConfig.vtcapp_api_url;
    var user_uid = store.getState().auth.userProfile.uid;
    var device_id = store.getState().device.uniqueId;
    var secure_key = md5(device_id + key);

    var formData = new FormData();
    formData.append('user_uid', user_uid);
    formData.append('device_id', device_id);
    formData.append('secure_key', secure_key);

    return axios({
        method: 'post',
        url: apiURL + 'usercountmess_react',
        data: formData,
        // headers: { 'Content-Type': 'multipart/form-data' }
    })
    // .then(function (response) {
    //     //handle success
    //     store.dispatch(userCountMess(response.data.msg));
    // })
    // .catch(function (response) {
    //     //handle error
    //     console.log(response);
    //     store.dispatch(userCountMess(null));
    // });

    // await fetch(apiURL + 'usercountmess_react', {
    //     method: 'POST',
    //     header: {
    //         'Accept': 'application/json',
    //         'Content-type': 'application/json'
    //     },
    //     body: formData //JSON.stringify(body)
    // })
    //     .then((response) => response.json())
    //     .then((responseJson) => {
    //         if (responseJson.msg < 100) {
    //             store.dispatch(userCountMess(responseJson.msg));
    //         } else {
    //             store.dispatch(userCountMess('99+'));
    //         }
    //         // if (!releaseStatus()) store.dispatch(userCountMess(null));

    //     })
    //     .catch((err) => {
    //         console.log(err);
    //         store.dispatch(userCountMess(null));
    //     });
}

function setUserProfileData(store) {
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

    return axios({
        method: 'post',
        url: apiURL + 'newuser_react',
        data: formData,
        // headers: { 'Content-Type': 'multipart/form-data' }
    })
    // .then(function (response) {
    //     //handle success
    //     if (response.data.status !== '0') {
    //         loginEvent(response.data.status);
    //     }
    // })
    // .catch(function (response) {
    //     //handle error
    //     console.log(response);
    // });

    // await fetch(apiURL + 'newuser_react', {
    //     method: 'POST',
    //     header: {
    //         'Accept': 'application/json',
    //         'Content-type': 'application/json'
    //     },
    //     body: formData //JSON.stringify(body)
    // })
    //     .then((response) => response.json())
    //     .then((responseJson) => {
    //         if (responseJson.status !== '0') {
    //             loginEvent(responseJson.status);
    //         }
    //     })
    //     .catch((err) => {
    //         console.log(err);
    //     });
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

    axios({
        method: 'post',
        url: apiURL + 'update_email_verified_react',
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' }
    })
        .then(function (response) {
            //handle success
            console.log(response.data.msg);
        })
        .catch(function (response) {
            //handle error
            console.log(response);
        });

    // fetch(apiURL + 'update_email_verified_react', {
    //     method: 'POST',
    //     header: {
    //         'Accept': 'application/json',
    //         'Content-type': 'application/json'
    //     },
    //     body: formData //JSON.stringify(body)
    // })
    //     .then((response) => response.json())
    //     .then((responseJson) => {
    //         // console.log(responseJson.msg);
    //     })
    //     .catch((err) => {
    //         console.log(err);
    //     });
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

    axios({
        method: 'post',
        url: apiURL + 'update_transaction_react',
        data: formData,
        // headers: { 'Content-Type': 'multipart/form-data' }
    })
        .then(function (response) {
            //handle success
            console.log(response.data.msg);
        })
        .catch(function (response) {
            //handle error
            console.log(response);
        });

    // fetch(apiURL + 'update_transaction_react', {
    //     method: 'POST',
    //     header: {
    //         'Accept': 'application/json',
    //         'Content-type': 'application/json'
    //     },
    //     body: formData //JSON.stringify(body)
    // })
    //     .then((response) => response.json())
    //     .then((responseJson) => {
    //         console.log(responseJson.msg);
    //     })
    //     .catch((err) => {
    //         console.log(err);
    //     });
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
        axios({
            method: 'post',
            url: apiURL + 'update_phone_number_react',
            data: formData,
            // headers: { 'Content-Type': 'multipart/form-data' }
        })
            .then(function (response) {
                //handle success
                console.log(response.data.msg);
            })
            .catch(function (response) {
                //handle error
                console.log(response);
            });

        // fetch(apiURL + 'update_phone_number_react', {
        //     method: 'POST',
        //     header: {
        //         'Accept': 'application/json',
        //         'Content-type': 'application/json'
        //     },
        //     body: formData //JSON.stringify(body)
        // })
        //     .then((response) => response.json())
        //     .then((responseJson) => {
        //         console.log(responseJson.msg);
        //     })
        //     .catch((err) => {
        //         console.log(err);
        //     });
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
        axios({
            method: 'post',
            url: apiURL + 'update_firebase_token_react',
            data: formData,
            headers: { 'Content-Type': 'multipart/form-data' }
        })
            .then(function (response) {
                //handle success
                console.log(response.data.msg);
            })
            .catch(function (response) {
                //handle error
                console.log(response);
            });

        // fetch(apiURL + 'update_firebase_token_react', {
        //     method: 'POST',
        //     header: {
        //         'Accept': 'application/json',
        //         'Content-type': 'application/json'
        //     },
        //     body: formData //JSON.stringify(body)
        // })
        //     .then((response) => response.json())
        //     .then((responseJson) => {
        //         // console.log(responseJson.msg);
        //     })
        //     .catch((err) => {
        //         console.log(err);
        //     });
    }
}

function getGameGiftListData(apiURL, device_id, secure_key, platform) {
    // var key = store.getState().firebase.firebaseConfig.vtcapp_secure_key;//"97fe5723139d280d50fb14d6cfd4b8d3";
    // var apiURL = store.getState().firebase.firebaseConfig.vtcapp_api_url;
    // var device_id = store.getState().device.uniqueId;
    // var platform = store.getState().device.platform;
    // var secure_key = md5(device_id + key);

    var formData = new FormData();
    formData.append('device_id', device_id);
    formData.append('secure_key', secure_key);
    formData.append('platform', platform);

    return axios({
        method: 'post',
        url: apiURL + 'gamegiftlist_react',
        data: formData,
        // headers: { 'Content-Type': 'multipart/form-data' }
    })
    // .then(function (response) {
    //     //handle success
    //     store.dispatch(getGameGiftList(response.data));
    //     ls.set('getGameGiftList', response.data);
    // })
    // .catch(function (response) {
    //     //handle error
    //     console.log(response);
    //     store.dispatch(getGameGiftList(null));
    // });

    // await fetch(apiURL + 'gamegiftlist_react', {
    //     method: 'POST',
    //     header: {
    //         'Accept': 'application/json',
    //         'Content-type': 'application/json'
    //     },
    //     body: formData //JSON.stringify(body)
    // })
    //     .then((response) => response.json())
    //     .then((responseJson) => {
    //         store.dispatch(getGameGiftList(responseJson));
    //         // if (!releaseStatus()) store.dispatch(getGameGiftList(null));
    //     })
    //     .catch((err) => {
    //         console.log(err);
    //         store.dispatch(getGameGiftList(null));
    //     });
}

export async function getGiftCode(user_uid, giftcode_event_id, key, device_id, apiURL) {
    var secure_key = md5(device_id + key);
    var apiURL = apiURL;
    var formData = new FormData();

    formData.append('user_uid', user_uid);
    formData.append('giftcode_event_id', giftcode_event_id);
    formData.append('device_id', device_id);
    formData.append('secure_key', secure_key);

    axios({
        method: 'post',
        url: apiURL + 'getgift_react',
        data: formData,
        // headers: { 'Content-Type': 'multipart/form-data' }
    })
        .then(function (response) {
            //handle success
            refeshData("2");
            getGiftCodeEvent();
            // return response.data.msg;
            alert(response.data.msg);
        })
        .catch(function (response) {
            //handle error
            console.log(response);
        });

    // fetch(apiURL + 'getgift_react', {
    //     method: 'POST',
    //     header: {
    //         'Accept': 'application/json',
    //         'Content-type': 'application/json'
    //     },
    //     body: formData
    // })
    //     .then((response) => response.json())
    //     .then((responseJson) => {
    //         refeshData("2");
    //         getGiftCodeEvent();
    //         alert(responseJson.msg);
    //     })
    //     .catch((err) => {
    //         console.log(err);
    //     });
}

export function readNotifi(user_uid, key, device_id, apiURL) {
    var secure_key = md5(device_id + key);
    var apiURL = apiURL;
    var formData = new FormData();

    formData.append('user_uid', user_uid);
    formData.append('device_id', device_id);
    formData.append('secure_key', secure_key);

    axios({
        method: 'post',
        url: apiURL + 'update_mess_react',
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' }
    })
        .then(function (response) {
            //handle success
            refeshData("5");
            alert(response.data.msg);
        })
        .catch(function (response) {
            //handle error
            console.log(response);
        });

    // fetch(apiURL + 'update_mess_react', {
    //     method: 'POST',
    //     header: {
    //         'Accept': 'application/json',
    //         'Content-type': 'application/json'
    //     },
    //     body: formData
    // })
    //     .then((response) => response.json())
    //     .then((responseJson) => {
    //         alert(responseJson.msg);
    //         refeshData("5");
    //     })
    //     .catch((err) => {
    //         console.log(err);
    //     });
}