import OneSignal from 'react-native-onesignal'; // Import package from node modules
// var _navigator; // If applicable, declare a variable for accessing your navigator object to handle payload.
import { AppRegistry, YellowBox } from 'react-native';
import App from './src/index';
import { name as appName } from './app.json';

// YellowBox.ignoreWarnings([
//     'VirtualizedLists should never be nested', // TODO: Remove when fixed
// ])
console.disableYellowBox = true;

// OneSignal.configure({
//     onIdsAvailable: function (device) {
//         console.log('UserId = ', device.userId);
//         console.log('PushToken = ', device.pushToken);
//     },
//     onNotificationReceived: function (notification) {
//         console.log('MESSAGE RECEIVED: ', notification["notification"]["notificationID"]);
//     },
//     onNotificationOpened: function (openResult) {
//         console.log('MESSAGE: ', openResult["notification"]["payload"]["body"]);
//         console.log('DATA: ', openResult["notification"]["payload"]["additionalData"]);
//         console.log('ISACTIVE: ', openResult["notification"]["isAppInFocus"]);
//         // Do whatever you want with the objects here
//         // _navigator.to('main.post', data.title, { // If applicable
//         //  article: {
//         //    title: openResult["notification"]["payload"]["body"],
//         //    link: openResult["notification"]["payload"]["launchURL"],
//         //    action: data.openResult["notification"]["action"]["actionSelected"]
//         //  }
//         // });
//     }
// });

AppRegistry.registerComponent(appName, () => App);
