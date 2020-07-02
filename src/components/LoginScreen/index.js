import React, { Component, PropTypes } from 'react';
import { AppRegistry, Image, ImageBackground, StatusBar, TouchableOpacity, StyleSheet, Alert, Dimensions, DeviceEventEmitter, ActivityIndicator, Modal, Platform } from "react-native";
import { Container, Header, Title, Button, Icon, Content, Right, Left, Body, Card, CardItem, Text, View } from 'native-base';

import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import * as authActions from '../../reducers/auth/authActions';
import firebase from 'react-native-firebase';

// import { GoogleSignin } from 'react-native-google-signin';
import { GoogleSignin } from '@react-native-community/google-signin';
import { AccessToken, LoginManager } from 'react-native-fbsdk';

import { refeshData } from '../../index.js';

const logoLaza = require("../../assets/images/logo_laza.png");
const drawerCover = require("../../assets/images/background.jpg");
const btFacebook = require("../../assets/images/facebook_login.png");
const btGoogle = require("../../assets/images/google_login.png");
const btLogout = require("../../assets/images/logout.png");


class LoginScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            width: Dimensions.get('window').width,
            height: Dimensions.get('window').height,
            ModalVisibleStatus: false,
        }
    }

    componentDidMount() {
        this._orientationSubscription = DeviceEventEmitter.addListener(
            'namedOrientationDidChange', this._onOrientationChange,
        );
    }
    componentWillUnmount() {
        this._orientationSubscription.remove();
    }

    _onOrientationChange = (orientation: Object) => {
        this.setState({
            width: Dimensions.get('window').width,
            height: Dimensions.get('window').height
        })
    }

    ShowModalFunction(visible) {
        this.setState({ ModalVisibleStatus: visible });
    }

    loading() {
        var modalBackgroundStyle = {
            backgroundColor: this.state.ModalVisibleStatus ? 'rgba(0, 0, 0, 0.5)' : '#f5fcff',
        };
        return (
            <View style={styles.MainContainer}>
                <Modal
                    transparent={true}
                    animationType={"fade"}
                    visible={this.state.ModalVisibleStatus}
                    supportedOrientations={['portrait', 'landscape']}
                    onRequestClose={() => { this.ShowModalFunction(!this.state.ModalVisibleStatus) }} >
                    <View style={[styles.containerModal, modalBackgroundStyle]}>
                        <View style={styles.ModalInsideView}>
                            <ActivityIndicator size="large" color="#fff" />
                            <Text style={styles.TextStyle}>Đang đăng nhập...</Text>
                        </View>
                    </View>
                </Modal>
            </View>
        )
    }

    logout() {
        Alert.alert(
            'Thông báo',
            'Bạn chắc chắn muốn thoát tài khoản?',
            [
                { text: 'OK', onPress: () => this.userLogout() },
                { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
            ],
            { cancelable: false }
        )
    }

    userLogout() {
        if (this.props.myUserProfile.userProfile.providerData[0].providerId === 'facebook.com') {
            LoginManager.logOut();
        } else {
            GoogleSignin.signOut();
        }
        firebase.auth().signOut();
        this.props.actions.logout();
        refeshData("3");
        Alert.alert(
            'Thông báo',
            'Đăng xuất thành công, quay về trang chính',
            [
                { text: 'OK', onPress: () => this.props.navigation.goBack() }
            ],
            { cancelable: false }
        )
    }

    facebookLogin() {
        this.ShowModalFunction(true);
        return LoginManager
            .logInWithReadPermissions(['public_profile', 'email'])
            .then((result) => {
                if (!result.isCancelled) {
                    return AccessToken.getCurrentAccessToken()
                } else {
                    Alert.alert(
                        'Thông báo',
                        'Bạn đã hủy đăng nhập, vui lòng đăng nhập lại!',
                        [{
                            text: 'OK',
                            onPress: () => console.log('Cancel Pressed'),
                            style: 'cancel'
                        },], {
                        cancelable: false
                    }
                    )
                    this.ShowModalFunction(false);
                }
            })
            .then(data => {
                if (data) {
                    const credential = firebase.auth.FacebookAuthProvider.credential(data.accessToken)
                    return firebase.auth().signInAndRetrieveDataWithCredential(credential)
                }
            })
            .then((currentUser) => {
                if (currentUser) {
                    this.props.actions.login(currentUser.user);
                    refeshData("1");
                    this.ShowModalFunction(false);
                    this.props.navigation.goBack();
                }
            })
            .catch((error) => {
                Alert.alert(
                    'Thông báo',
                    'Đăng nhập lỗi, vui lòng kiểm tra lại thông tin email. Có thể email Facebook và Google giống nhau không thể cùng login vào ứng dụng!',
                    [
                        { text: 'OK', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                    ],
                    { cancelable: false }
                )
                this.ShowModalFunction(false);
                console.log(`Login fail with error: ${error}`)
            })
    }

    googleLogin() {
        this.ShowModalFunction(true);
        return GoogleSignin.configure({
            iosClientId: '118928617088-j2hk1sbstoneqp0tovf2vmjs85ut5iii.apps.googleusercontent.com'
        })
            .then(() => {
                GoogleSignin.signIn()
                    .then((data) => {
                        const credential = firebase.auth.GoogleAuthProvider.credential(data.idToken, data.accessToken)
                        return firebase.auth().signInAndRetrieveDataWithCredential(credential)
                    })
                    .then((currentUser) => {
                        this.props.actions.login(currentUser.user);
                        refeshData("1");
                        this.ShowModalFunction(false);
                        this.props.navigation.goBack();
                    })
                    .catch((error) => {
                        this.ShowModalFunction(false);
                    })
            })
    }

    login_container() {
        return (
            <View style={styles.container}>
                <Image source={logoLaza} style={{
                    height: 125,
                    width: 204,
                }} />
                <Text style={styles.textTitle}>Vui lòng chọn đăng nhập tài khoản!</Text>
                < TouchableOpacity onPress={
                    () => this.facebookLogin()
                } >
                    <Image source={btFacebook} style={styles.imageLogin_out} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.googleLogin()}>
                    <Image source={btGoogle} style={styles.imageLogin_out} />
                </TouchableOpacity>
            </View>
        )
    }

    logout_container() {
        return (
            <View style={styles.container}>
                <Image source={logoLaza} style={{
                    height: 125,
                    width: 204,
                }} />
                <Text style={styles.textTitle}>Vui lòng chọn thoát tài khoản!</Text>
                <TouchableOpacity onPress={() => this.logout()}>
                    <Image source={btLogout} style={styles.imageLogin_out} />
                </TouchableOpacity>
            </View>
        )
    }

    render() {
        const isAuth = this.props.myUserProfile.isAuth;
        return (
            <Container>
                <Content style={{ flex: 1 }} scrollEnabled={false}>
                    {this.loading()}
                    <ImageBackground source={drawerCover} style={[styles.backgroundImage, { width: this.state.width, height: this.state.height }]}>
                        <View style={[styles.closeView, { zIndex: 999 }]}>
                            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                                <Icon name="close-circle" style={{ color: '#001eff' }} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.container}>
                            {isAuth ? (
                                this.logout_container()
                            ) : (
                                    this.login_container()
                                )}
                        </View>
                    </ImageBackground>
                </Content>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        top: -60
    },
    backgroundImage: {
        flex: 1,
        alignItems: 'stretch',
    },
    imageLogin_out: {
        height: 35,
        resizeMode: 'contain',
        marginTop: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeView: {
        marginTop: Platform.OS === "android" ? 5 : 15,
        margin: 6,
        alignItems: 'flex-end',
    },
    closeTitle: {
        color: '#fff',                      // White text color
        fontWeight: 'bold',                 // Bold font
        fontSize: 16,
        textAlign: "center",
    },
    textTitle: {
        color: '#fff',                      // White text color
        fontWeight: 'bold',                 // Bold font
        fontSize: 16,
        textAlign: "center",
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageBackground: {
        justifyContent: 'center',           // Center vertically
        alignItems: 'center',               // Center horizontally
        position: 'absolute',
        top: 0,
        left: 0,
        resizeMode: 'stretch'
    },
    rightContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: 'red',
    },
    MainContainer: {
        flex: 1,
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 999,
    },
    ModalInsideView: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
        height: 75,
        width: 150,
    },
    TextStyle: {
        fontSize: 14,
        color: "#fff",
    },
    containerModal: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
});

function mapStateToProps(state) {
    return {
        myFirebaseConfig: state.firebase.firebaseConfig,
        myUserProfile: state.auth
    };
}
function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(authActions, dispatch)
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);
