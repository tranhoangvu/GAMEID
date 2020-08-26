import React, { Component } from 'react';
import { AppRegistry, View, StatusBar, StyleSheet, Dimensions, Linking, WebView, DeviceEventEmitter, Platform, Image } from "react-native";
import { Container, Header, Title, Button, Icon, Content, Right, Left, Body, Card, CardItem, Text } from 'native-base';
//import MyWebView from 'react-native-webview-autoheight';
import { connect } from "react-redux";

const logoGameID = require("../../assets/images/logo_gameid.png");

const styles = StyleSheet.create({
    MainContainer: {
        flex: 1,
        // paddingTop: (Platform.OS) === 'ios' ? 20 : 0,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        width: 350,
        top: -25
    },
    textStyle: {
        color: '#000',
        fontSize: 14,
        textAlign: 'center',
    }
})
//const uri = 'https://thanhtoanonline.vn/?portal=topup&page=iframe&cmd=2&affiliate_code=706e90541a11916fea81898a3ad55496';

class InfoScreen extends Component {

    constructor() {
        super();
        this.state = {
            width: Dimensions.get('window').width,
            height: Dimensions.get('window').height
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

    render() {
        const { vtcapp_card_url, vtcapp_ios_version, vtcapp_android_version } = this.props.myFirebaseConfig.firebaseConfig;
        const clientVersion = this.props.global.clientVersion;
        return (
            <Container>
                <Header hasTabs>
                    <Left>
                        <Button transparent onPress={() => this.props.navigation.goBack()}>
                            <Icon name="arrow-back" />
                        </Button>
                    </Left>
                    <Body>
                        <Title>Giới thiệu</Title>
                    </Body>
                    <Right />
                </Header>
                <Content contentContainerStyle={{ flex: 1, backgroundColor: 'white' }} scrollEnabled={false}>
                    <View style={styles.MainContainer}>
                        <Image source={logoGameID} style={{
                            width: 250,
                            height: 125,
                            flex: 1,
                        }} resizeMode='contain' />
                        {/* <Text style={styles.textStyle}>Phiên bản {(Platform.OS) === 'ios' ? vtcapp_ios_version : vtcapp_android_version}</Text> */}
                        <Text style={styles.textStyle}>Ứng dụng GAMEID.VN do GAMEID TEAM phát triển hỗ trợ game thủ dễ dàng nhận được các thông tin mới nhất, code HOT nhất từ game mình yêu thích!</Text>
                        <Text style={styles.textStyle}>Một sản phẩm của GAMEID TEAM</Text>
                        <Text style={styles.textStyle}>{'\u00A9'}GAMEID.VN 2020</Text>
                        <Text style={styles.textStyle}>Phiên bản thử nghiệm {clientVersion}</Text>
                    </View>
                </Content>
            </Container>
        );
    }
}

function mapStateToProps(state) {
    //console.log(state.firebase.firebaseConfig);
    //console.log(state.auth.userProfile.providerData[0].photoURL);
    return {
        myFirebaseConfig: state.firebase,
        global: state.global
    };
}
export default connect(mapStateToProps)(InfoScreen);
