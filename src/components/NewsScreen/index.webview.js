import React from "react";
import { AppRegistry, View, StatusBar, StyleSheet, Dimensions, Linking, DeviceEventEmitter, ScrollView } from "react-native";
import WebView from 'react-native-webview';
import { Container, Header, Title, Left, Icon, Right, Button, Body, Content, Text, Card, CardItem, Tabs, Tab, ScrollableTab, Badge } from "native-base";
import { connect } from "react-redux";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    mb: {
        right: 0,
        flex: 1,
        position: 'absolute'
    },
    icon_mb: {
        right: 10
    }
})

class NewsScreen extends React.Component {

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
        const uri = this.props.myFirebaseConfig.firebaseConfig.vtcapp_news_url;
        if (weburl !== uri) {
            Linking.canOpenURL(webViewState.url).then(supported => {
                if (supported) {
                    this.webview.stopLoading();
                    this.props.navigation.navigate("Webview", { weblink: weburl });
                } else {
                    console.log("link error");
                }
            }).catch(err => console.error('An error occurred', err));
        }
    }

    badgeNotification() {
        const userCountMess = this.props.myServerData.userCountMess;
        if (userCountMess !== null) {
            return (
                <Badge style={styles.mb}>
                    <Text style={{ fontSize: 10 }}>{userCountMess}</Text>
                </Badge>
            )
        }
    }

    render() {
        const { vtcapp_news_url } = this.props.myFirebaseConfig.firebaseConfig;
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
                        <Title>Tin tức</Title>
                    </Body>
                    <Right>
                        {
                            this.badgeNotification()
                        }
                        <Button
                            transparent
                            onPress={() => this.props.navigation.navigate("Notifi")}>
                            <Icon name="notifications" style={styles.icon_mb} />
                        </Button>
                    </Right>
                </Header>
                <Content contentContainerStyle={{ flex: 1 }}>
                    <View style={[styles.container, { width: this.state.width, height: this.state.height }]}>
                        <WebView
                            ref={(ref) => { this.webview = ref; }}
                            source={{ uri: vtcapp_news_url }}
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

function mapStateToProps(state) {
    return {
        myFirebaseConfig: state.firebase,
        myServerData: state.server
    };
}
export default connect(mapStateToProps)(NewsScreen);