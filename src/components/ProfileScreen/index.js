import React from "react";
import { AppRegistry, View, StatusBar, StyleSheet, Image, ImageBackground, Dimensions, Alert, TouchableOpacity } from "react-native";
import { Container, Header, Title, Left, Icon, Right, Button, Body, Content, Text, Card, CardItem, Tabs, Tab, ScrollableTab, Badge, List, ListItem, Thumbnail, Separator } from "native-base";
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import firebase from 'react-native-firebase';
import { refeshData, releaseStatus } from '../../index.js';
import * as authActions from '../../reducers/auth/authActions';
import Timestamp from '../../lib/timestamp';
// import { GoogleSignin } from 'react-native-google-signin';
import { GoogleSignin } from '@react-native-community/google-signin';
import { LoginManager } from 'react-native-fbsdk';

const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;
const drawerCover = require("../../assets/images/cover.jpg");
const profileAvatar = require("../../assets/images/profile_avatar.png");

class ProfileScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            displayName: null,
            phoneNumber: null,
            email: null,
            emailVerified: null,
            creationTime: null,
            lastSignInTime: null,
        };
    }
    componentDidMount() {
        var user = firebase.auth().currentUser;
        // console.log(user);
        if (user !== null) {
            this.setState({
                displayName: user.displayName,
                phoneNumber: user.phoneNumber,
                email: user.email,
                emailVerified: user.emailVerified,
                creationTime: user.metadata.creationTime,
                lastSignInTime: user.metadata.lastSignInTime,
            });
            if (user.metadata.creationTime || user.metadata.lastSignInTime) {
                this.setState({
                    creationTime: user.metadata.creationTime.toString().substr(0, 10),
                    lastSignInTime: user.metadata.lastSignInTime.toString().substr(0, 10),
                })
            }
        }

        // if (this.props.myUserProfile.userProfile !== null) {
        //     this.setState({
        //         displayName: this.props.myUserProfile.userProfile.displayName,
        //         phoneNumber: this.props.myUserProfile.userProfile.phoneNumber,
        //         email: this.props.myUserProfile.userProfile.email,
        //         emailVerified: this.props.myUserProfile.userProfile.emailVerified,
        //         creationTime: this.props.myUserProfile.userProfile.metadata.creationTime,
        //         lastSignInTime: this.props.myUserProfile.userProfile.metadata.lastSignInTime,
        //     });
        //     if (this.props.myUserProfile.userProfile.metadata.creationTime || this.props.myUserProfile.userProfile.metadata.lastSignInTime){
        //         this.setState({
        //             creationTime: this.props.myUserProfile.userProfile.metadata.creationTime.toString().substr(0,10),
        //             lastSignInTime: this.props.myUserProfile.userProfile.metadata.lastSignInTime.toString().substr(0, 10),
        //         })
        //     }
        // }
    }

    badgeNotification() {
        const userCountMess = this.props.appGameList.userCountMess;
        if (userCountMess !== null) {
            return (
                <Badge style={styles.mb}>
                    <Text style={{ fontSize: 10 }}>{userCountMess}</Text>
                </Badge>
            )
        }
    }

    confirmEmail(){
        var user = firebase.auth().currentUser;
        if (user !== null) {
            if (!user.emailVerified) {
                user.sendEmailVerification().then(function () {
                    // Email sent.
                    Alert.alert(
                        'Thông báo',
                        'Email xác thực đã được gửi. Vui lòng kiểm tra email của bạn để xác thực!', [{
                            text: 'OK',
                            onPress: () => console.log('Cancel Pressed'),
                            style: 'cancel'
                        }], {
                            cancelable: false
                        }
                    )
                }).catch(function (error) {
                    // An error happened.
                    Alert.alert(
                        'Thông báo',
                        'Có lỗi xảy ra. Vui lòng thao tác lại!', [{
                            text: 'OK',
                            onPress: () => console.log('Cancel Pressed'),
                            style: 'cancel'
                        }], {
                            cancelable: false
                        }
                    )
                });
            } 
            // else {
            //     Alert.alert(
            //         'Thông báo',
            //         'Email của bạn đã được xác thực! ', [{
            //             text: 'OK',
            //             onPress: () => console.log('Cancel Pressed'),
            //             style: 'cancel'
            //         }], {
            //             cancelable: false
            //         }
            //     )
            // }
        }
        // else{
        //     Alert.alert(
        //         'Thông báo',
        //         'Bạn chưa đăng nhập, vui lòng đăng nhập! ', [{
        //             text: 'OK',
        //             onPress: () => this.props.navigation.navigate('Login'),
        //             style: 'cancel'
        //         }], {
        //             cancelable: false
        //         }
        //     )
        // }
    }

    phoneVerification(){
        var user = firebase.auth().currentUser;
        // var test_phoneNumber = null;
        //this.state.phoneNumber
        if (user !== null) {
            if (this.state.phoneNumber === null) {
                Alert.alert(
                    'Thông báo',
                    'Mỗi tài khoản chỉ xác nhận 1 số điện thoại và không thể thay đổi, bạn chắn chắn chứ? ', 
                    [
                        {text: 'Cập nhật',onPress: () => this.props.navigation.navigate("PhoneVerification")},
                        {text: 'Hủy',onPress: () => console.log('Cancel Pressed'),style: 'cancel'},
                    ], 
                    {
                        cancelable: false
                    }
                )
                // this.props.navigation.navigate("PhoneVerification");
            } 
            // else {
            //     Alert.alert(
            //         'Thông báo',
            //         'Số điện thoại của bạn đã được xác thực, bạn muốn cập nhật lại số điện thoại? ', 
            //         [
            //             {text: 'Cập nhật mới',onPress: () => this.props.navigation.navigate("PhoneVerification")},
            //             {text: 'Hủy',onPress: () => console.log('Cancel Pressed'),style: 'cancel'},
            //         ], 
            //         {
            //             cancelable: false
            //         }
            //     )
            // }
        }
        // else{
        //     Alert.alert(
        //         'Thông báo',
        //         'Bạn chưa đăng nhập, vui lòng đăng nhập! ', [{
        //             text: 'OK',
        //             onPress: () => this.props.navigation.navigate('Login'),
        //             style: 'cancel'
        //         }], {
        //             cancelable: false
        //         }
        //     )
        // }
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
        var userAvatar = 'Đăng nhập';
        if (userProfile !== null) {
            userAvatar = this.props.myUserProfile.userProfile.providerData[0].photoURL;
            ;
            if(this.props.myUserProfile.userProfile.providerData[0].providerId === 'facebook.com'){
                userAvatar = this.props.myUserProfile.userProfile.providerData[0].photoURL+'?type=large';
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
        this.setState({
            displayName: null,
            phoneNumber: null,
            email: null,
            emailVerified: null,
            creationTime: null,
            lastSignInTime: null,
        });
        Alert.alert(
            'Thông báo',
            'Đăng xuất thành công!',
            [
                { text: 'OK', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
            ],
            { cancelable: false }
        )
    }

    myBag(){
        return (
            <ListItem icon>
                < TouchableOpacity style = {styles.row} activeOpacity = {0.7} onPress = {() => this.checkLogin('MyBag')} >
                    <Left>
                        < Icon name = "ios-basket-outline" />
                    </Left>
                    <Body>
                        <Text style={styles.textLeft}>Túi Giftcode</Text>
                    </Body>
                    <Right>
                        <Icon name="arrow-forward" />
                    </Right>
                </TouchableOpacity>
            </ListItem>
        )
    }

    myTransaction(){
        return (
            <ListItem icon>
                < TouchableOpacity style = {styles.row} activeOpacity = { 0.7 } onPress = { () => this.checkLogin('Transaction') } >
                    <Left>
                        < Icon name = "md-list" />
                    </Left>
                    <Body>
                        <Text style={styles.textLeft}>Lịch sử mua thẻ</Text>
                    </Body>
                    <Right>
                        <Icon name="arrow-forward" />
                    </Right>
                </TouchableOpacity>
            </ListItem>
        )
    }

    checkLogin(route) {
        if (!this.props.myUserProfile.isAuth) {
            Alert.alert(
                'Thông báo',
                'Bạn chưa đăng nhập, vui lòng đăng nhập để nhận tin tức mới nhất!',
                [
                    { text: 'OK', onPress: () => this.props.navigation.navigate('Login') }
                ],
                { cancelable: false }
            )
        } else {
            this.props.navigation.navigate(route);
        }
    }

    render() {
        return (
            <Container>
                <Header>
                    <Left>
                        <Button
                            transparent
                            onPress={() => this.props.navigation.navigate("DrawerOpen")}>
                            <Icon name="menu" />
                        </Button>
                    </Left>
                    <Body>
                        <Title>Tài khoản</Title>
                    </Body>
                    <Right>
                        {
                            this.badgeNotification()
                        }
                        <Button
                            transparent
                            onPress={() => this.checkLogin('Notifi')}>
                            <Icon name="notifications" style={styles.icon_mb} />
                        </Button>
                    </Right>
                </Header>
                <Content style={{ marginTop: 0, flex: 1, backgroundColor: 'white' }}>
                    <ImageBackground source={drawerCover} style={styles.drawerCover}>
                        {this.profileUser()}
                    </ImageBackground>
                    <List>
                        <Separator bordered>
                            <Text style={styles.textLeft}>Tài khoản</Text>
                        </Separator>
                        <ListItem icon>
                            <TouchableOpacity style={styles.row} activeOpacity={0.7}>
                            <Left>
                                < Icon name = "ios-contact-outline" />
                            </Left>
                            <Body>
                                <Text style={styles.textLeft}>Họ tên</Text>
                            </Body>
                            <Right>
                                <Text style={styles.textRight}>{this.state.displayName}</Text>
                                <Icon name="arrow-forward" />
                            </Right>
                            </TouchableOpacity>
                        </ListItem>
                        <ListItem icon>
                            <TouchableOpacity style={styles.row} activeOpacity={0.7}>
                            <Left>
                                < Icon name = "ios-mail-outline" />
                            </Left>
                            <Body>
                                <Text style={styles.textLeft}>Email</Text>
                            </Body>
                            <Right>
                                <Text style={styles.textRight}>{this.state.email}</Text>
                                <Icon name="arrow-forward" />
                            </Right>
                            </TouchableOpacity>
                        </ListItem>
                        <ListItem icon>
                            <TouchableOpacity style={styles.row} activeOpacity={0.7} onPress={() => this.phoneVerification()}>
                            <Left>
                                < Icon name = "ios-call-outline" />
                            </Left>
                            <Body>
                                <Text style={styles.textLeft}>Số điện thoại</Text>
                            </Body>
                            <Right>
                                <Text style={styles.textRight}>{this.props.myUserProfile.isAuth ? this.state.phoneNumber ? this.state.phoneNumber : '(Click cập nhật)': ''}</Text>
                                <Icon name="arrow-forward" />
                            </Right>
                            </TouchableOpacity>
                        </ListItem>
                        <ListItem icon>
                            <TouchableOpacity style={styles.row} activeOpacity={0.7} onPress={() => this.confirmEmail()}>
                                <Left>
                                    < Icon name = "ios-checkmark-circle-outline" />
                                </Left>
                                <Body>
                                    <Text style={styles.textLeft}>Xác nhận Email</Text>
                                </Body>
                                <Right>
                                    <Text style={styles.textRight}>{this.props.myUserProfile.isAuth ? this.state.emailVerified ? 'Đã xác thực' : '(Click xác thực)' : '' }</Text>
                                    <Icon name="arrow-forward" />
                                </Right>
                            </TouchableOpacity>
                        </ListItem>
                        <ListItem icon>
                            <TouchableOpacity style={styles.row} activeOpacity={0.7}>
                            <Left>
                                < Icon name = "ios-clock-outline" />
                            </Left>
                            <Body>
                                <Text style={styles.textLeft}>Tạo tài khoản</Text>
                            </Body>
                            <Right>
                                <Timestamp time={this.state.creationTime} component={Text} format='full' style={styles.textRight} />
                                {/* <Text>{this.state.creationTime}</Text> */}
                                <Icon name="arrow-forward" />
                            </Right>
                            </TouchableOpacity>
                        </ListItem>
                        <ListItem icon>
                            <TouchableOpacity style={styles.row} activeOpacity={0.7}>
                            <Left>
                                < Icon name = "ios-time-outline" />
                            </Left>
                            <Body>
                                <Text style={styles.textLeft}>Đăng nhập</Text>
                            </Body>
                            <Right>
                                <Timestamp time={this.state.lastSignInTime} component={Text} format='full' style={styles.textRight} />
                                {/* <Text>{this.state.lastSignInTime}</Text> */}
                                <Icon name="arrow-forward" />
                            </Right>
                            </TouchableOpacity>
                        </ListItem>
                        <Separator bordered>
                            <Text style={styles.textLeft}>Ứng dụng</Text>
                        </Separator>
                        {releaseStatus() ? (
                            this.myBag()
                        ):(null)}
                        {/* {
                            releaseStatus() ? (
                                this.myTransaction()
                            ) : (null)
                        } */}
                        {/* <ListItem icon>
                            <TouchableOpacity style={styles.row} activeOpacity={0.7} onPress={() => this.props.navigation.navigate("Support")}>
                            <Left>
                                < Icon name = "ios-chatboxes-outline" />
                            </Left>
                            <Body>
                                <Text style={styles.textLeft}>Hỗ trợ</Text>
                            </Body>
                            <Right>
                                <Icon name="arrow-forward" />
                            </Right>
                            </TouchableOpacity>
                        </ListItem> */}
                        <ListItem icon>
                            <TouchableOpacity style={styles.row} activeOpacity={0.7} onPress={() => this.props.navigation.navigate("Policy")}>
                            <Left>
                                < Icon name = "ios-hand-outline" />
                            </Left>
                            <Body>
                                <Text style={styles.textLeft}>Điều khoản</Text>
                            </Body>
                            <Right>
                                <Icon name="arrow-forward" />
                            </Right>
                            </TouchableOpacity>
                        </ListItem>
                        <ListItem icon>
                            <TouchableOpacity style={styles.row} activeOpacity={0.7} onPress={() => this.props.navigation.navigate("Info")}>
                            <Left>
                                < Icon name = "ios-information-circle-outline" />
                            </Left>
                            <Body>
                                <Text style={styles.textLeft}>Giới thiệu</Text>
                            </Body>
                            <Right>
                                <Icon name="arrow-forward" />
                            </Right>
                            </TouchableOpacity>
                        </ListItem>
                        <Separator bordered>
                            <Text style={styles.textLeft}>Phiên bản {this.props.global.clientVersion}</Text>
                        </Separator>
                    </List>
                </Content>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center'
    },
    horizontal: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10
    },
    mb: {
        right: 0,
        flex: -1,
        position: 'absolute'
    },
    icon_mb: {
        right: 10
    },
    profile: {
        flex: 1,
        justifyContent: 'center',           // Center vertically
        alignItems: 'center',               // Center horizontally
    },
    avatar: {
        width: 76,                          // Set width
        height: 76,                         // Set height
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
    },
    textRight: {
        fontSize: 15,
    },
    textLeft: {
        fontSize: 16,
    },
    textTitle: {
        color: '#fff',                      // White text color
        backgroundColor: 'transparent',     // No background
        fontWeight: 'bold',                 // Bold font
        fontSize: 16,
        textAlign: "center",
        marginTop: 6,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
    },
    buttonLogin_out: {
        marginTop: 6,
        justifyContent: 'center',           // Center vertically
        alignItems: 'center',               // Center horizontally
        alignSelf: 'center',
    },
    drawerCover: {
        alignSelf: "stretch",
        height: deviceHeight / 4,
        width: null,
        position: "relative",
        marginBottom: 10
    },
    row: {
        flexDirection: 'row',
    },
})

function mapStateToProps(state) {
    return {
        myUserProfile: state.auth,
        appGameList: state.server,
        global: state.global
    };
}
function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(authActions, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileScreen);
