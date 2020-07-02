import React, { Component } from 'react';
import { AppRegistry, View, StatusBar, StyleSheet, Dimensions, Linking, DeviceEventEmitter, Platform } from "react-native";
import WebView from 'react-native-webview';
import { Container, Header, Title, Button, Icon, Content, Right, Left, Body, Card, CardItem, Text } from 'native-base';
import { connect } from "react-redux";
import firebase from 'react-native-firebase';
import md5 from 'md5';
import ramdomOrder from '../../lib/randomOrder';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    horizontal: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10
    },
})

class ScoinCard extends Component {

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

    payWebView() {
        var user = firebase.auth().currentUser;
        var orderCode = ramdomOrder({
            length: 10,
            numeric: false,
            letters: true,
            special: false,
            exclude: []
            // exclude: ['a', 'b', '1']
        });
        const {
            vtcapp_pay_url,
            vtcapp_secure_key
        } = this.props.myFirebaseConfig.firebaseConfig;
        const {
            uniqueId
        } = this.props.appDevice;
        var secure_key = md5(uniqueId + vtcapp_secure_key);
        return (
            <WebView
                source={
                    {
                        uri: vtcapp_pay_url,
                        method: 'POST',
                        // headers: {
                        //     'Content-Type': 'text/html',
                        // },
                        body: "user_uid=" + user.uid + "&device_id=" + uniqueId + "&secure_key=" + secure_key,
                    }
                }
                injectedJavaScript="window.postMessage = String(Object.hasOwnProperty).replace('hasOwnProperty', 'postMessage');"
                style={{ flex: 1 }}
                scalesPageToFit={true}
                javaScriptEnabled={true}
                renderLoading={this.renderLoading}
                startInLoadingState={true}
                automaticallyAdjustContentInsets={true}
                cacheEnabled={true}
            />
        )
    }

    payUnrelease() {
        return (
            <View style={[styles.container, styles.horizontal]}>
                <Text>Tính năng chưa mở</Text>
            </View>
        )
    }

    render() {
        var pay_release;
        const clientVersion = this.props.globalConfig.clientVersion;
        const {
            vtcapp_pay_release,
            vtcapp_ios_version,
            vtcapp_android_version
        } = this.props.myFirebaseConfig.firebaseConfig;
        // const vtcapp_pay_release = false;
        if (Platform.OS === 'ios') {
            if (clientVersion === vtcapp_ios_version) {
                pay_release = vtcapp_pay_release;
            } else {
                pay_release = true;
            }
        }
        if (Platform.OS === 'android') {
            if (clientVersion === vtcapp_android_version) {
                pay_release = vtcapp_pay_release;
            } else {
                pay_release = true;
            }
        }
        // console.log(pay_release);
        return (
            // <Container>
            //     <Header hasTabs>
            //         <Left>
            //             <Button transparent onPress={() => this.props.navigation.goBack()}>
            //                 <Icon name="arrow-back" />
            //             </Button>
            //         </Left>
            //         <Body>
            //             <Title>Mua thẻ</Title>
            //         </Body>
            //         <Right />
            //     </Header>
            <Content contentContainerStyle={{ flex: 1 }}>
                <View style={[styles.container, { width: this.state.width, height: this.state.height }]}>
                    {
                        pay_release ? (
                            this.payWebView()
                        ) : (
                                this.payUnrelease()
                            )
                    }
                </View>
            </Content>
            // </Container>
        );
    }
}

function mapStateToProps(state) {
    return {
        myFirebaseConfig: state.firebase,
        appDevice: state.device,
        globalConfig: state.global
    };
}
export default connect(mapStateToProps)(ScoinCard);
