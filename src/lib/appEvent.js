import React, { Component } from 'react';
import firebase from 'react-native-firebase';
import { AppEventsLogger } from 'react-native-fbsdk';   

export function loginEvent(status) {
    if (status === '1'){
        AppEventsLogger.logEvent('Complete Registration');
        firebase.analytics().logEvent('complete_registration');
    }else {
        AppEventsLogger.logEvent('Daily Login');
        firebase.analytics().logEvent('daily_login');
    }
}

export function getGiftCodeEvent() {
    AppEventsLogger.logEvent('Get Giftcode');
    firebase.analytics().logEvent('get_giftcode');
}