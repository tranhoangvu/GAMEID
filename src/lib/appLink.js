import { Linking, Platform } from 'react-native';

export const openApp = async (game_ios_link, game_ios_scheme, game_android_link) => {
    if (Platform.OS === 'ios') {
        const ios_scheme_url = game_ios_scheme + '://';
        const ios_url = 'https://itunes.apple.com/app/id' + game_ios_link +'?ls=1&mt=81';
        Linking.canOpenURL(ios_scheme_url).then(supported => {
            if (!supported) {
                return Linking.openURL(ios_url);
            } else {
                return Linking.openURL(ios_scheme_url);
            }
        }).catch(err => console.error('An error occurred', err));
    } else {
        const android_url = 'market://details?id=' + game_android_link;
        // const android_scheme_url = game_android_link + '://';
        const android_scheme_url = "https://play.google.com/store/apps/details?id="+game_android_link;
        Linking.canOpenURL(android_scheme_url).then(supported => {
            if (!supported) {
                return Linking.openURL(android_url);
            } else {
                return Linking.openURL(android_scheme_url); 
            }
        }).catch(err => console.error('An error occurred', err));
    }
};

export default {
    openApp
};