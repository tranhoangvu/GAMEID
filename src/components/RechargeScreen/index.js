import React, { Component } from 'react';
import { AppRegistry, View, StatusBar, StyleSheet, Dimensions, Linking, DeviceEventEmitter } from "react-native";
import WebView from 'react-native-webview';
import { Container, Header, Title, Button, Icon, Content, Right, Left, Body, Card, CardItem, Text } from 'native-base';
//import MyWebView from 'react-native-webview-autoheight';
import { connect } from "react-redux";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    }
})

class RechargeScreen extends Component {

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
        const { vtcapp_recharge_url } = this.props.myFirebaseConfig.firebaseConfig;
        return (
            <Container>
                <Header hasTabs>
                    <Left>
                        <Button transparent onPress={() => this.props.navigation.goBack()}>
                            <Icon name="arrow-back" />
                        </Button>
                    </Left>
                    <Body>
                        <Title>Nạp Scoin</Title>
                    </Body>
                    <Right />
                </Header>
                <Content contentContainerStyle={{ flex: 1 }}>
                    <View style={[styles.container, { width: this.state.width, height: this.state.height }]}>
                        <WebView
                            source={{ uri: vtcapp_recharge_url }}
                            injectedJavaScript="window.postMessage = String(Object.hasOwnProperty).replace('hasOwnProperty', 'postMessage');"
                            style={{ flex: 1 }}
                            scalesPageToFit={true}
                            javaScriptEnabled={true}
                            renderLoading={this.renderLoading}
                            startInLoadingState={true}
                            automaticallyAdjustContentInsets={true}
                            cacheEnabled={true}
                        />
                    </View>
                </Content>
            </Container>
        );
    }
}

function mapStateToProps(state) {
    return {
        myFirebaseConfig: state.firebase
    };
}
export default connect(mapStateToProps)(RechargeScreen);
