// import { GoogleSignin } from 'react-native-google-signin';
import { GoogleSignin } from '@react-native-community/google-signin';
import firebase from 'react-native-firebase';

// Calling this function will open Google for login.
export const ggLogin = () => {
    // Add configuration settings here:
    return GoogleSignin.configure({
        iosClientId: '118928617088-j2hk1sbstoneqp0tovf2vmjs85ut5iii.apps.googleusercontent.com'
    })
        .then(() => {
            GoogleSignin.signIn()
                .then((data) => {
                    // create a new firebase credential with the token
                    const credential = firebase.auth.GoogleAuthProvider.credential(data.idToken, data.accessToken)

                    // login with credential
                    return firebase.auth().signInWithCredential(credential)
                })
                .then((currentUser) => {
                    //console.info(JSON.stringify(currentUser.toJSON()))
                })
                .catch((error) => {
                    //console.error('Login fail with error')
                })
        })
}