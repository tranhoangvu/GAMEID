import React from "react";
import { AppRegistry, Image, ImageBackground, StatusBar, TouchableOpacity, Alert } from "react-native";
import { Content, Text, List, ListItem, Icon, Container, Left, Right, Badge, Button, View, StyleProvider, getTheme, variables, Thumbnail } from "native-base";
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import firebase from 'react-native-firebase';
import { refeshData, releaseStatus } from '../../index.js';
import * as authActions from '../../reducers/auth/authActions';
// import { GoogleSignin } from 'react-native-google-signin';
import { GoogleSignin } from '@react-native-community/google-signin';
import { LoginManager } from 'react-native-fbsdk';

import styles from "./styles";

const drawerCover = require("../../assets/images/cover.jpg");
const profileAvatar = require("../../assets/images/profile_avatar.png");

const routesRelease = [
    {
        name: "Trang chủ",
        route: "Main",
        icon: "home",
        bg: "#C5F442",
    },
    {
        name: "Túi Giftcode",
        route: "MyBag",
        icon: "basket",
        bg: "#C5F442",
    },
    // {
    //     name: "Nạp Scoin",
    //     route: "Recharge",
    //     icon: "logo-euro",
    //     bg: "#C5F442",
    // },
    // {
    //     name: "Mua thẻ Scoin",
    //     route: "Card",
    //     icon: "cart",
    //     bg: "#C5F442",
    // },
    // {
    //     name: "Lịch sử mua thẻ",
    //     route: "Transaction",
    //     icon: "md-list",
    //     bg: "#C5F442",
    // },
    // {
    //     name: "Sự kiện",
    //     route: "Event",
    //     icon: "logo-dropbox",
    //     bg: "#C5F442",
    // },
    // {
    //     name: "Hỗ trợ Game",
    //     route: "Support",
    //     icon: "chatboxes",
    //     bg: "#C5F442",
    // },
    {
        name: "Điều khoản",
        route: "Policy",
        icon: "hand",
        bg: "#C5F442",
    },
    {
        name: "Giới thiệu",
        route: "Info",
        icon: "information-circle",
        bg: "#C5F442",
    },
    {
        name: "Đăng nhập/Thoát",
        route: "Login",
        icon: "log-in",
        bg: "#C5F442",
    },
];

const routesReView = [
    {
        name: "Trang chủ",
        route: "Main",
        icon: "home",
        bg: "#C5F442",
    },
    // {
    //     name: "Hỗ trợ",
    //     route: "Support",
    //     icon: "chatboxes",
    //     bg: "#C5F442",
    // },
    {
        name: "Điều khoản",
        route: "Policy",
        icon: "hand",
        bg: "#C5F442",
    },
    {
        name: "Giới thiệu",
        route: "Info",
        icon: "information-circle",
        bg: "#C5F442",
    },
    {
        name: "Đăng nhập/Thoát",
        route: "Login",
        icon: "log-in",
        bg: "#C5F442",
    },
];

class MenuBar extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
    }

    UNSAFE_componentWillMount() {
    }

    localAvatar() {
        return (
            <Image
                source={profileAvatar}
                style={styles.avatar}
            />
        )
    }

    userAvatar() {
        const userProfile = this.props.myUserProfile.userProfile;
        var userAvatar = '';
        if (userProfile !== null) {
            userAvatar = this.props.myUserProfile.userProfile.providerData[0].photoURL;
            if (this.props.myUserProfile.userProfile.providerData[0].providerId === 'facebook.com') {
                userAvatar = this.props.myUserProfile.userProfile.providerData[0].photoURL + '?type=large';
            }
        }
        return (
            <Thumbnail
                source={{ uri: userAvatar }}
                style={styles.avatar}
            />
        )
    }

    logINOUT() {
        if (!this.props.myUserProfile.isAuth) {
            this.props.navigation.navigate('Login')
        } else {
            this.logout();
        }
    }

    logout() {
        Alert.alert(
            'Thông báo',
            'Bạn chắc chắn muốn thoát tài khoản?',
            [
                { text: 'OK', onPress: () => this.userLogout() },
                { text: 'Cancel', style: 'cancel' },
            ],
            { cancelable: false }
        )
    }

    userLogout() {
        const provider = this.props.myUserProfile.userProfile.providerData[0].providerId;
        console.log('provider: ' + provider);
        switch (provider) {
            case 'facebook.com':
                LoginManager.logOut();
                break;
            case 'google.com':
                console.log('aaaa');
                GoogleSignin.revokeAccess();
                GoogleSignin.signOut();
                break;
            default:
                console.log('logout nothing')
        }
        // if (this.props.myUserProfile.userProfile.providerData[0].providerId === 'facebook.com') {
        //     LoginManager.logOut();
        // } else {
        //     GoogleSignin.signOut();
        // }
        firebase.auth().signOut();
        this.props.actions.logout();
        refeshData("3");
        Alert.alert(
            'Thông báo',
            'Đăng xuất thành công!',
            [
                { text: 'OK', style: 'cancel' },
            ],
            { cancelable: false }
        )
    }

    profileUser() {
        const userProfile = this.props.myUserProfile.userProfile;
        var loginText = 'Đăng nhập';
        var userName = 'Xin chào!';
        if (userProfile !== null) {
            loginText = 'Thoát';
            userName = this.props.myUserProfile.userProfile.displayName;
        }
        return (
            <View style={styles.profile}>
                {this.props.myUserProfile.isAuth ? (
                    this.userAvatar()
                ) : (
                        this.localAvatar()
                    )}
                <Text style={styles.textTitle}>{userName}</Text>
                <Button rounded small style={styles.buttonLogin_out} onPress={() => this.logINOUT()}>
                    <Text>{loginText}</Text>
                </Button>
            </View>
        )
    }

    checkLogin(route) {
        // var userPhoneNumber = null;
        if (route === 'MyBag' || route === 'Transaction' || route === 'Card' || route === 'Event') {
            if (!this.props.myUserProfile.isAuth) {
                Alert.alert(
                    'Thông báo',
                    'Bạn chưa đăng nhập, vui lòng đăng nhập để nhận tin tức mới nhất!',
                    [
                        { text: 'OK', onPress: () => this.props.navigation.navigate('Login') }
                    ],
                    { cancelable: false }
                )
            }
            else if (route === 'Card' && firebase.auth().currentUser.phoneNumber === null) {
                Alert.alert(
                    'Thông báo',
                    'Bạn chưa cập nhật số điện thoại, vui lòng cập nhật để chúng tôi có thể liên lạc khi có vấn đề về mua thẻ Scoin!',
                    [
                        { text: 'Cập nhật ngay', onPress: () => this.props.navigation.navigate("PhoneVerification") },
                        { text: 'Để sau', onPress: () => this.props.navigation.navigate("Card"), style: 'cancel' }
                    ],
                    {
                        cancelable: false
                    }
                )
            }
            else {
                this.props.navigation.navigate(route);
            }
        } else {
            this.props.navigation.navigate(route);
        }
    }

    render() {
        if (!releaseStatus()) {
            newRouters = routesReView;
        } else {
            newRouters = routesRelease;
        }
        return (
            <Container>
                <Content bounces={false} style={{ flex: 1, backgroundColor: "#fff", top: -1 }}>
                    <ImageBackground source={drawerCover} style={styles.drawerCover}>
                        {this.profileUser()}
                    </ImageBackground>
                    <List
                        dataArray={newRouters}
                        renderRow={data => {
                            return (
                                <ListItem button noBorder onPress={() => this.checkLogin(data.route)}>
                                    <Left>
                                        <Icon active name={data.icon} style={{ color: "#777", fontSize: 26, width: 30 }} />
                                        <Text style={styles.text}>
                                            {data.name}
                                        </Text>
                                    </Left>
                                </ListItem>
                            );
                        }}
                    />
                </Content>
            </Container>
        );
    }
}
function mapStateToProps(state) {
    return {
        myUserProfile: state.auth,
        myFirebaseConfig: state.firebase.firebaseConfig
    };
}
function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(authActions, dispatch)
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(MenuBar);
