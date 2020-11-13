/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import firebase from 'react-native-firebase';
import { ActivityIndicator, StyleSheet, Platform, Alert, BackHandler, Image, ImageBackground, Dimensions, Linking } from 'react-native'
import { Root } from "native-base";
import { View, Text } from 'native-base';
import AppNavigator from "../src/config/routes.js";
import { Provider } from 'react-redux';

import { setPlatform, setUniqueId, setOneSignal, setNetwork } from './reducers/device/deviceActions';

import { logout } from './reducers/auth/authActions';
import { setStore } from './reducers/global/globalActions';
import { fetchData } from './reducers/firebase/firebaseActions';

import configureStore from './lib/configureStore';
import { checkInternetConnection, offlineActionCreators, ReduxNetworkProvider } from 'react-native-offline';

import FireInitialState from './reducers/firebase/firebaseInitialState';
import AutInitialState from './reducers/auth/authInitialState';
import DeviceInitialState from './reducers/device/deviceInitialState';
import GlobalInitialState from './reducers/global/globalInitialState';
import DeviceInfo from 'react-native-device-info';
import NetInfo from '@react-native-community/netinfo';
import OneSignal from 'react-native-onesignal';
import {
    fetchFirebaseData,
    fetchNewsData,
    fetchGameData,
    fetchUserData,
    setUserProfileData,
    // getNewsListData,
    // getAdsListData,
    // getGameListData,
    // getGameH5ListData,
    // getGameGiftListData,
    // getGiftListData,
    // setUserProfileData,
    // userCountMessData,
    // getNotificationListData,
    // getUserGiftListData,
    // getUserCardListData,
    // getUserTransactionListData,
    updateFirebaseTokenData,
    updatePhoneNumberData,
    updateEmailVerifiedData,
    updateTransactionData
} from './lib/fetchData';
import {
    getGameList,
    getGameH5List,
    getNewsList,
    getFeatureNewsList,
    getLatestNewsList,
    getAdsList,
    getGameGiftList,
    getGiftList,
    getUserGiftList,
    getUserCardList,
    getUserTransactionList,
    getNotificationList,
    userCountMess
} from './reducers/server/serverActions';
import * as authActions from './reducers/auth/authActions';
import LinkRoutes from './utils/linkRoutes'

var ls = require('./lib/localStorage');

const drawerCover = require("../src/assets/images/background.jpg");
const logoGameID = require("../src/assets/images/logo_gameid.png");
const store = configureStore(getInitialState());
const uniqueId = DeviceInfo.getUniqueId();

function getInitialState() {
    const _initState = {
        firebase: new FireInitialState(),
        auth: new AutInitialState(),
        device: (new DeviceInitialState()).set('isMobile', true),
        global: (new GlobalInitialState()),
    }
    return _initState
}

function updateUserToken() {
    firebase.messaging().getToken()
        .then(function (idToken) {
            // console.log("aaaaaa: " + idToken);
            store.dispatch(authActions.firebaseToken(idToken));
            updateFirebaseTokenData(store);
        }).catch(function (error) {
            if (error) throw error
        });
}

function updateEmailVerified() {
    var user = firebase.auth().currentUser;
    if (user.emailVerified) {
        updateEmailVerifiedData(store);
        // console.log(user.emailVerified);
    }
}

export function updateTransaction(transactionID) {
    var user = firebase.auth().currentUser;
    // console.log(transactionID);
    if (user) {
        updateTransactionData(store, transactionID);
        setTimeout(() => {
            refeshData("4");
        }, 100);
        // console.log(user.emailVerified);
    }
}

export function updatePhoneNumber() {
    var user = firebase.auth().currentUser;
    if (user.phoneNumber !== null) {
        updatePhoneNumberData(store, user.phoneNumber);
    }
}

export function releaseStatus() {
    const clientVersion = store.getState().global.clientVersion;
    const iOS_release = store.getState().firebase.firebaseConfig.vtcapp_ios_release;
    const Android_release = store.getState().firebase.firebaseConfig.vtcapp_android_release;

    if (Platform.OS === 'ios') {
        if (clientVersion === store.getState().firebase.firebaseConfig.vtcapp_ios_version) {
            return iOS_release;
        } else {
            return true;
        }
    } else if (Platform.OS === 'android') {
        if (clientVersion === store.getState().firebase.firebaseConfig.vtcapp_android_version) {
            return Android_release;
        } else {
            return true;
        }
    }
}

export function loadMoreNews(page) {
    fetchNewsData(store, "latestNewsData", page);
}

export function refeshData(flag) {
    switch (flag) {
        case "1": //login
            setUserProfileData(store).then((data) => {
                if (data) {
                    // updateUserToken();
                    updateEmailVerified();
                    fetchUserData(store);
                }
            })
            // setUserProfileData(store).then(() => {
            //     getNotificationListData(store).then(() => {
            //         userCountMessData(store);
            //     });
            // });
            // getUserGiftListData(store);
            // getUserCardListData(store);
            // getUserTransactionListData(store);
            // updateUserToken();
            // updateEmailVerified();
            break;

        case "2": //getGiftcode
            fetchUserData(store, 'userGift');
            // getUserGiftListData(store);
            // getUserCardListData(store);
            // getUserTransactionListData(store);
            break;

        case "3": //logout
            store.dispatch(getUserGiftList(null));
            store.dispatch(getNotificationList(null));
            store.dispatch(userCountMess(null));
            store.dispatch(logout());
            //getUserGiftListData(store);
            break;

        case "4": //refeshData
            // getNewsListData(store);
            // getGameListData(store);
            // getGameH5ListData(store);
            // getGameGiftListData(store);
            // getGiftListData(store);
            fetchGameData(store);
            if (store.getState().auth.isAuth) {
                fetchUserData(store);
                // getNotificationListData(store);
                // getUserGiftListData(store);
                // getUserCardListData(store);
                // getUserTransactionListData(store);
            }
            break;

        case "5": //login
            //userCountMessData(store);
            store.dispatch(userCountMess(null));
            break;
        case "gameData":
            fetchGameData(store, 'gameData');
            break;
        case "h5Data":
            fetchGameData(store, 'h5Data');
            break;
        case "newsData":
            fetchNewsData(store);
            break;
        case "gameGiftData":
            fetchGameData(store, 'gameGiftData');
            break;
        case "giftData":
            fetchGameData(store, 'giftData');
            break;

        default:
            break;
    }
}

// async function isFetchData() {
//     await fetchGameData(store);
//     return true;
// }

export default class App extends Component {

    constructor(properties) {
        super(properties);
        this.unsubscriber = null;
        this.state = {
            isLoading: true,
            isConnected: false,
            isReady: false,
            isLogin: false,
            userProfile: null,
            progress: 0,
            width: Dimensions.get('window').width,
            height: Dimensions.get('window').height,
        };
        //Remove this method to stop OneSignal Debugging 
        // OneSignal.setLogLevel(6, 0);

        // Replace 'YOUR_ONESIGNAL_APP_ID' with your OneSignal App ID.
        OneSignal.init("6595e6bc-0a1a-4d36-9cfb-39ae871b6535", { kOSSettingsKeyAutoPrompt: false, kOSSettingsKeyInAppLaunchURL: false, kOSSettingsKeyInFocusDisplayOption: 2 });
        OneSignal.inFocusDisplaying(2); // Controls what should happen if a notification is received while the app is open. 2 means that the notification will go directly to the device's notification center.

        // The promptForPushNotifications function code will show the iOS push notification prompt. We recommend removing the following code and instead using an In-App Message to prompt for notification permission (See step below)
        // OneSignal.promptForPushNotificationsWithUserResponse(myiOSPromptCallback);

        OneSignal.addEventListener('received', this.onReceived);
        OneSignal.addEventListener('opened', this.onOpened);
        OneSignal.addEventListener('ids', this.onIds);
    }

    componentDidMount() {
        if (__DEV__) {
            firebase.config().enableDeveloperMode();
        }

        // var postid = '4578';
        // this.props.navigation.navigate("NewsDetailsNotify", { postid })

        store.dispatch(setPlatform(Platform.OS));
        store.dispatch(setUniqueId(uniqueId));
        store.dispatch(setStore(store));

        this.unsubscribe = firebase.auth().onUserChanged(this.onUserChanged);
        BackHandler.addEventListener('hardwareBackPress', this.backPressed);

        NetInfo.addEventListener(
            state => { this.handelConnectivityChange }
        );
        NetInfo.fetch().then(state => {
            if (state.isConnected) this.setState({ isConnected: 'true' });
        });

        setTimeout(() => {
            this.appAsync();
        }, 1000);
    }

    UNSAFE_componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.backPressed);
        NetInfo.removeEventListener(state => { this.handelConnectivityChange });
        if (this.unsubscribe) this.unsubscribe();
        OneSignal.removeEventListener('received', this.onReceived);
        OneSignal.removeEventListener('opened', this.onOpened);
        OneSignal.removeEventListener('ids', this.onIds);
    }

    backPressed = () => {
        Alert.alert(
            'Thoát ứng dụng',
            'Bạn chắc chắn muốn thoát?',
            [
                { text: 'No', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                { text: 'Yes', onPress: () => BackHandler.exitApp() },
            ],
            { cancelable: false })

        return true;
    }

    handelConnectivityChange = (isConnected) => {
        this.setState({ isConnected: 'true' });
        store.dispatch(setNetwork(this.state.isConnected));
        if (!this.state.isConnected) {
            this.error_connection();
        }
    }

    onUserChanged = (currentUser) => {
        if (currentUser) {
            if (store.getState().auth.isAuth === false) {
                store.dispatch(authActions.login(currentUser));
                // console.log('onUserChanged: ' + JSON.stringify(currentUser));
                this.setState({ isLogin: true, userProfile: currentUser });
            }
        }
    }

    appAsync() {
        if (this.state.isConnected) {
            ls.get('firebaseConfig').then((data) => {
                if (data !== null) {
                    console.log("get local firebase");
                    store.dispatch(fetchData(data));
                    if (this.state.isLogin) {
                        setUserProfileData(store).then(() => {
                            fetchUserData(store);
                            // updateUserToken();
                            updateEmailVerified();
                        });
                    }
                    // this.getNews();
                    this.getLocalNewsData();
                    this.getLocalGameData().then(() => {
                        setTimeout(() => {
                            this.setState({ isReady: true });
                        }, 1500);
                    })
                    // fetchGameData(store).then(() => {
                    //     this.setState({ isReady: true });
                    // })
                    // setTimeout(() => {
                    fetchFirebaseData(store);
                    // }, 100);
                } else {
                    console.log("get firebase");
                    fetchFirebaseData(store).then((data) => {
                        if (data != '') {
                            if (store.getState().firebase.isFetchData) {
                                if (this.state.isLogin) {
                                    setUserProfileData(store).then(() => {
                                        fetchUserData(store);
                                        // updateUserToken();
                                        updateEmailVerified();
                                    })
                                }
                                // this.getNews();
                                fetchNewsData(store);
                                fetchGameData(store).then(() => {
                                    setTimeout(() => {
                                        this.setState({ isReady: true });
                                    }, 1500);
                                })
                                // fetchGameData(store).then(() => {
                                //     this.setState({ isReady: true });
                                // })
                            } else {
                                console.log('Lỗi kết nối Firebase');
                            }
                        }
                    })
                        .catch((err) => {
                            console.log('Error: ' + err);
                        });
                }
            });
        }
    }

    // async getNews() {
    //     await ls.get('getNewsListData').then((data) => {
    //         if (data !== null) {
    //             store.dispatch(getNewsList(data));
    //         } else {
    //             getNewsListData(store);
    //         }
    //     });
    // }
    async getLocalNewsData() {
        await ls.get('getFeatureNewsListData').then((data) => {
            if (data !== null) {
                store.dispatch(getFeatureNewsList(data));
            } else {
                fetchNewsData(store, 'featureNewsData');
            }
        });
        await ls.get('getLatestNewsListData').then((data) => {
            if (data !== null) {
                store.dispatch(getLatestNewsList(data));
            } else {
                fetchNewsData(store, 'latestNewsData');
            }
        });
        fetchNewsData(store);
    }

    async getLocalGameData() {
        await ls.get('getNewsListData').then((data) => {
            if (data !== null) {
                store.dispatch(getNewsList(data));
            } else {
                fetchGameData(store, 'newsData');
            }
        });
        await ls.get('getGameListData').then((data) => {
            if (data !== null) {
                store.dispatch(getGameList(data));
            } else {
                fetchGameData(store, 'gameData');
            }
        });
        await ls.get('getGameH5ListData').then((data) => {
            if (data !== null) {
                store.dispatch(getGameH5List(data));
            } else {
                fetchGameData(store, 'h5Data');
            }
        });
        await ls.get('getGameGiftList').then((data) => {
            if (data !== null) {
                store.dispatch(getGameGiftList(data));
            } else {
                fetchGameData(store, 'gameGiftData');
            }
        });
        await ls.get('getGiftListData').then((data) => {
            if (data !== null) {
                store.dispatch(getGiftList(data));
            } else {
                fetchGameData(store, 'giftData');
            }
        });
        fetchGameData(store);
    }
    // async isFetchData() {
    //     // await getNewsListData(store);
    //     await fetchGameData(store);
    //     // await getAdsListData(store);
    //     // getGameListData(store);
    //     // getGameH5ListData(store);
    //     // getGameGiftListData(store);
    //     // getGiftListData(store);
    // }

    // async isUserFetchData() {
    // setUserProfileData(store);
    // userCountMessData(store);
    // getNotificationListData(store);
    // getUserGiftListData(store);
    // getUserCardListData(store);
    // getUserTransactionListData(store);
    // }

    onReceived(notification) {
        console.log("Notification received: ", notification);
    }

    onOpened(openResult) {
        console.log('Message: ', openResult.notification.payload.body);
        console.log('Data: ', openResult.notification.payload.additionalData);
        console.log('isActive: ', openResult.notification.isAppInFocus);
        console.log('openResult: ', openResult);
        // if (!openResult.notification.isAppInFocus) {
        var launchURL = openResult.notification.payload.launchURL;
        const path = launchURL.split(':/')[1];
        LinkRoutes(path);
        // this.handleOpenURL(launchURL);
        // }
    }

    onIds(device) {
        store.dispatch(setOneSignal(device));
        // console.log('Device info: ', device);
    }

    handleOpenURL(url) {
        // var postid_temp = launchURL.split("/");
        // var postid = postid_temp[postid_temp.length - 1];
        // console.log('postid: ' + postid);
        const path = url.split(':/')[1];
        LinkRoutes(path);
    }

    loading() {
        return (
            <ImageBackground source={drawerCover} style={[styles.backgroundImage, { width: this.state.width, height: this.state.height }]}>
                <View style={styles.container}>
                    <Image source={logoGameID} style={{
                        width: 250,
                        height: 125,
                        marginBottom: 5,
                        flex: 1,
                    }} resizeMode='contain' />
                    <ActivityIndicator size="small" color="#fff" />
                    <Text style={{ position: 'absolute', bottom: -60, fontSize: 14, color: '#fff' }}>{'\u00A9'}GAMEID.VN 2020</Text>
                </View>
            </ImageBackground>
        )
    }

    checkConnection() {
        if (!this.state.isConnected) {
            this.error_connection();
        } else {
            this.appAsync();
        }
    }

    error_connection() {
        Alert.alert(
            'Thông báo',
            'Mạng kết nối có lỗi, vui lòng kiểm tra lại!',
            [
                { text: 'OK', onPress: () => this.checkConnection() }
            ],
            { cancelable: false }
        )
    }

    render() {
        if (this.state.isReady) {
            return (
                <Provider store={store}>
                    <Root>
                        <ReduxNetworkProvider>
                            <AppNavigator />
                        </ReduxNetworkProvider>
                    </Root>
                </Provider>
            );
        }
        return this.loading()
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        top: -65,
    },
    backgroundImage: {
        flex: 1,
        alignItems: 'stretch'
    },
});