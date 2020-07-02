import OneSignal from 'react-native-onesignal'; // Import package from node modules
import { AppRegistry, Platform } from 'react-native';
import App from './src/index';
console.disableYellowBox = true;

var pendingNotifications = [];
// var _navigator; // If applicable, declare a variable for accessing your navigator object to handle payload.
// function handleNotificationAction (openResult) { // If you want to handle the notification with a payload.
// _navigator.to('main.post', openResult["notification"]["payload"]["title"], {
//  article: {
//    title: openResult["notification"]["payload"]["title"],
//    link: openResult["notification"]["payload"]["launchURL"],
//    action: openResult["notification"]["action"]["actionSelected"]
//  }
//});
// }

OneSignal.configure({
    onIdsAvailable: function (device) {
        console.log('UserId = ', device.userId);
        console.log('PushToken = ', device.pushToken);
    },
    onNotificationReceived: function (notification) {

    },
    onNotificationOpened: function (openResult) {
        console.log('NOTIFICATION OPENED: ', notification);
        //if (!_navigator) { // Check if there is a navigator object. If not, waiting with the notification.
        //    console.log('Navigator is null, adding notification to pending list...');
        pendingNotifications.push(notification);
        //    return;
        // }
        handleNotificationOpened(openResult);
    }
});

AppRegistry.registerComponent('GAMEID', () => App);
