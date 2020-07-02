import React, { Component } from 'react';
import { AppRegistry, View, StatusBar, StyleSheet, Dimensions, Linking, DeviceEventEmitter, Platform, TouchableOpacity } from "react-native";
import WebView from 'react-native-webview';
import { Container, Header, Title, Button, Icon, Content, Right, Left, Body, Card, CardItem, Text } from 'native-base';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: Platform.OS === "android" ? 0 : 20,
        justifyContent: 'center',
        // position: 'absolute',
    },
    closeView: {
        // marginTop: Platform.OS === "android" ? 5 : 20,
        // margin: 6,
        // alignItems: 'flex-end',
        position: 'absolute',
        right: 10,
        bottom: 5,
    },
})

class H5PlayScreen extends Component {

    constructor() {
        super();
        this.state = {
            width: Dimensions.get('window').width,
            height: Dimensions.get('window').height - 20
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
                <Content style={{ flex: 1 }} scrollEnabled={false}>
                    <View style={[styles.closeView, { zIndex: 999 }]}>
                        <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                            <Icon name="close-circle" style={{ color: '#001eff' }} />
                        </TouchableOpacity>
                    </View>
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

            // <Container>
            //     <Header hasTabs>
            //         <Left>
            //             <Button transparent onPress={() => this.props.navigation.goBack()}>
            //                 <Icon name="arrow-back" />
            //             </Button>
            //         </Left>
            //         <Body>
            //             <Title>play game</Title>
            //         </Body>
            //         <Right />
            //     </Header>
            //     <Content contentContainerStyle={{ flex: 1 }}>
            //         <View style={[styles.container, { width: this.state.width, height: this.state.height }]}>
            //             <WebView
            //                 source={{ uri: weblink}}
            //                 startInLoadingState={true}
            //                 injectedJavaScript="window.postMessage = String(Object.hasOwnProperty).replace('hasOwnProperty', 'postMessage');"
            //                 style={{ flex: 1 }}
            //                 scalesPageToFit={true}
            //                 javaScriptEnabled={true}
            //                 renderLoading={this.renderLoading}
            //                 automaticallyAdjustContentInsets={true}
            //                 onNavigationStateChange={this._onNavigationStateChange.bind(this)}
            //                 cacheEnabled={true}
            //             />
            //         </View>
            //     </Content>
            // </Container>
        );
    }
}

export default H5PlayScreen;
