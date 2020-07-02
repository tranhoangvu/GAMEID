import React, { Component } from 'react';
import { AppRegistry, View, StatusBar, StyleSheet, Dimensions, Linking, WebView, DeviceEventEmitter } from "react-native";
import { Container, Header, Title, Button, Icon, Content, Right, Left, Body, Card, CardItem, Text } from 'native-base';
import { connect } from "react-redux";
import { withNavigation } from 'react-navigation';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    }
})

class GuideCard extends Component {

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
        const uri = this.props.myFirebaseConfig.firebaseConfig.vtcapp_guide_url;
        if (weburl !== uri && weburl.toString().substring(0, 4) === 'http') {
            Linking.canOpenURL(weburl).then(supported => {
                if (supported) {
                    this.webview.stopLoading();
                    return Linking.openURL(weburl);
                    // this.props.navigation.navigate("Webview", {weblink: weburl});
                } else {
                    console.log("link error");
                }
            }).catch(err => console.error('An error occurred', err));
        }
    }

    render() {
        const { vtcapp_guide_url } = this.props.myFirebaseConfig.firebaseConfig;
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
                        <WebView
                            ref={(ref) => { this.webview = ref; }}
                            source={{ uri: vtcapp_guide_url }}
                            injectedJavaScript="window.postMessage = String(Object.hasOwnProperty).replace('hasOwnProperty', 'postMessage');"
                            style={{ flex: 1 }}
                            scalesPageToFit={true}
                            javaScriptEnabled={true}
                            renderLoading={this.renderLoading}
                            startInLoadingState={true}
                            automaticallyAdjustContentInsets={true}
                            cacheEnabled={true}
                            onNavigationStateChange={this._onNavigationStateChange.bind(this)}
                        />
                    </View>
                </Content>
            // </Container>
        );
    }
}

function mapStateToProps(state) {
    return {
        myFirebaseConfig: state.firebase
    };
}
export default withNavigation(connect(mapStateToProps)(GuideCard));
