import React from "react";
import { AppRegistry, View, StatusBar, StyleSheet, Dimensions, Linking, DeviceEventEmitter, ScrollView, Image, TouchableOpacity, RefreshControl, Alert, Modal } from "react-native";
import { Container, Header, Title, Left, Icon, Right, Button, Body, Content, Text, Card, CardItem, Tabs, Tab, ScrollableTab, Badge } from "native-base";
import WebView from 'react-native-webview';
import { connect } from "react-redux";
import Timestamp from '../../lib/timestamp';
import { releaseStatus } from '../../index';

var ls = require('../../lib/localStorage');

const screen = Dimensions.get('window');
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        // position: 'absolute',
    },
    horizontal: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10
    },
    mb: {
        right: 0,
        flex: 1,
        position: 'absolute'
    },
    icon_mb: {
        right: 10
    },
    row: {
        // width: screen.width - 30,
        flexDirection: 'row',
    },
    containerModal: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
        // position: 'relative',
    },
    MainContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
    },
    ModalInsideView: {
        alignItems: 'center',
        backgroundColor: "#fff",
        height: '75%',
        width: '90%',
        borderRadius: 10,
        borderWidth: 0.1,
        borderColor: '#000',
    },
    TextStyle: {
        marginTop: 10,
        fontSize: 16,
        color: "#000",
    },
    ModalButton: {
        flexDirection: 'row',
        position: 'absolute',
        bottom: 0,
    },
    closeView: {
        position: 'absolute',
        top: 0,
        right: 2,
    },
})

export class NewsScreen extends React.Component {

    constructor() {
        super();
        this.state = {
            width: Dimensions.get('window').width,
            height: Dimensions.get('window').height,
            ModalVisibleStatus: false,
            ads_image_link: '',
            ads_link: '',
            url: ''
        }
    }
    componentDidMount() {
        this.checkAds();
        this.setState({
            url: this.props.myFirebaseConfig.firebaseConfig.vtcapp_news_url
        });
    }

    componentWillUnmount() {
    }

    _onNavigationStateChange(webViewState) {
        const weburl = webViewState.url;
        const uri = this.props.myFirebaseConfig.firebaseConfig.vtcapp_news_url;
        if (weburl !== uri && weburl.toString().substring(0, 4) === 'http') {
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

    ShowModalFunction(visible) {
        this.setState({ ModalVisibleStatus: visible });
    }

    openNews(newsURL) {
        if (newsURL !== '') {
            Linking.canOpenURL(newsURL).then(supported => {
                if (supported) {
                    this.props.navigation.navigate("Webview", { weblink: newsURL });
                } else {
                    console.log("link error");
                }
            }).catch(err => console.error('An error occurred', err));
        }
    }

    loading() {
        return (
            <View style={[styles.container, styles.horizontal]}>
                <ActivityIndicator size="small" color="#0000ff" />
            </View>
        )
    }

    checkLogin() {
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
            this.props.navigation.navigate("Notifi");
        }
    }

    openAdsLink(linkURL) {
        this.closeAds();
        if (linkURL !== '') {
            Linking.canOpenURL(linkURL).then(supported => {
                if (supported) {
                    return Linking.openURL(linkURL);
                } else {
                    console.log("link error");
                }
            }).catch(err => console.error('An error occurred', err));
        }
    }

    checkAds() {
        if (releaseStatus()) {
            // console.log(this.props.myServerData.adsList)
            if (this.props.myServerData.isAdsList) {
                if (this.props.myServerData.adsList != null) {
                    ls.get(this.props.myServerData.adsList[0].app_ads_id).then((data) => {
                        this.setState({
                            ads_image_link: this.props.myFirebaseConfig.firebaseConfig.vtcapp_image_url + this.props.myServerData.adsList[0].app_ads_image_link,
                            ads_link: this.props.myServerData.adsList[0].app_ads_link
                        });
                        this.ShowModalFunction(data)
                    });
                }
            }
        }
    }

    closeAds() {
        ls.set(this.props.myServerData.adsList[0].app_ads_id, false)
            .then(() => {
                ls.get(this.props.myServerData.adsList[0].app_ads_id).then((data) => {
                    this.ShowModalFunction(data)
                });
            })
    }

    showAds() {
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
                    <View style={[styles.containerModal]}>
                        <View style={styles.ModalInsideView}>
                            <View style={[styles.closeView, { zIndex: 999 }]}>
                                <TouchableOpacity onPress={() => this.closeAds()}>
                                    <Icon name="close-circle" style={{ color: '#ffffff' }} />
                                </TouchableOpacity>
                            </View>
                            <View style={{ height: '100%', width: '100%', }}>
                                <TouchableOpacity onPress={() => { this.openAdsLink(this.state.ads_link) }}>
                                    <Image source={{ uri: this.state.ads_image_link }} style={{
                                        height: '100%',
                                        width: '100%',
                                        resizeMode: 'stretch',
                                        borderRadius: 10,
                                    }} />
                                </TouchableOpacity>
                            </View>
                            {/* <View style={styles.ModalButton}>
                                <Button rounded onPress={() => { this.openAdsLink(this.state.ads_link) }}>
                                    <Text>Xem</Text>
                                </Button>
                            </View> */}
                        </View>
                    </View>
                </Modal>
            </View>
        )
    }

    render() {
        const { vtcapp_news_url } = this.props.myFirebaseConfig.firebaseConfig;
        return (
            <Container>
                <Header>
                    <Left>
                        <Button
                            transparent
                            onPress={() => this.props.navigation.openDrawer()}>
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
                            onPress={() => this.checkLogin()}>
                            <Icon name="notifications" style={styles.icon_mb} />
                        </Button>
                    </Right>
                </Header>
                <Content style={{ backgroundColor: 'white' }} contentContainerStyle={{ flex: 1 }}>
                    <View style={[styles.container, { width: this.state.width, height: this.state.height }]}>
                        <WebView
                            ref={(ref) => { this.webview = ref; }}
                            source={{ uri: this.state.url }}
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
                    {this.showAds()}
                </Content>
            </Container>
        );
    }
}

function mapStateToProps(state) {
    return {
        myFirebaseConfig: state.firebase,
        myUserProfile: state.auth,
        myServerData: state.server
    };
}
export default connect(mapStateToProps)(NewsScreen);