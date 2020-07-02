import React, { Component } from 'react';
import { AppRegistry, View, StatusBar, StyleSheet, Dimensions, Linking, DeviceEventEmitter } from "react-native";
import WebView from 'react-native-webview';
import { Container, Header, Title, Button, Icon, Content, Right, Left, Body, Card, CardItem, Text } from 'native-base';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    }
})

class WebviewScreen extends Component {

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

    _onNavigationStateChange(webViewState) {
        const weburl = webViewState.url;
    }

    render() {
        const weblink = this.props.navigation.state.params.weblink;
        return (
            <Container>
                <Header hasTabs>
                    <Left>
                        <Button transparent onPress={() => this.props.navigation.goBack()}>
                            <Icon name="arrow-back" />
                        </Button>
                    </Left>
                    <Body>
                        <Title>Trang tin</Title>
                    </Body>
                    <Right />
                </Header>
                <Content contentContainerStyle={{ flex: 1 }}>
                    <View style={[styles.container, { width: this.state.width, height: this.state.height }]}>
                        <WebView
                            source={{ uri: weblink }}
                            startInLoadingState={true}
                            injectedJavaScript="window.postMessage = String(Object.hasOwnProperty).replace('hasOwnProperty', 'postMessage');"
                            style={{ flex: 1 }}
                            scalesPageToFit={true}
                            javaScriptEnabled={true}
                            renderLoading={this.renderLoading}
                            automaticallyAdjustContentInsets={true}
                            onNavigationStateChange={this._onNavigationStateChange.bind(this)}
                            cacheEnabled={true}
                        />
                    </View>
                </Content>
            </Container>
        );
    }
}

export default WebviewScreen;
