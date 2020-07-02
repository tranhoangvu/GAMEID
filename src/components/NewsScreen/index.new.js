import React from "react";
import { Platform, AppRegistry, View, StatusBar, StyleSheet, Dimensions, Linking, DeviceEventEmitter, ScrollView, Image, TouchableOpacity, TouchableHighlight, ActivityIndicator, RefreshControl, Alert, Modal } from "react-native";
import { Container, Header, Title, Left, Icon, Right, Button, Body, Content, Text, Card, CardItem, Tabs, Tab, ScrollableTab, Badge, Thumbnail, List, ListItem } from "native-base";
import { connect } from "react-redux";
import Timestamp from '../../lib/timestamp';
import { refeshData } from '../../index.js';

var ls = require('../../lib/localStorage');

const screen = Dimensions.get('window');
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
        backgroundColor: 'transparent'
    },
    MainContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
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
        // marginTop: Platform.OS === "android" ? 5 : 15,
        // margin: 6,
        // alignItems: 'flex-end',
    },
})

class NewsScreen extends React.Component {

    constructor() {
        super();
        this.state = {
            refreshing: false,
            ModalVisibleStatus: false,
            ads_image_link: '',
            ads_link: '',
        };
    }

    componentDidMount() {
        this.checkAds();
    }

    componentWillMount() {
    }

    componentWillUnmount() {
    }

    _onRefresh() {
        this.setState({ refreshing: true });
        setTimeout(() => {
            refeshData("4");
            this.setState({ refreshing: false });
        }, 3000);
    }

    _refreshControl() {
        return (
            <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this._onRefresh.bind(this)}
            />
        )
    }

    ShowModalFunction(visible) {
        this.setState({ ModalVisibleStatus: visible });
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

    newsList() {
        return (
            <View style={{ flex: 1 }}>
                <List
                    dataArray={this.props.myServerData.newsList}
                    renderRow={rowData =>
                        <ListItem style={{ paddingTop: 5, paddingBottom: 5, marginLeft: 5, paddingRight: 5, }}>
                            <TouchableOpacity
                                style={styles.row}
                                onPress={() => this.openNews(rowData.link)}
                                activeOpacity={0.7}>
                                <Card>
                                    <CardItem cardBody>
                                        <Image source={{ uri: rowData.image }} style={{ height: 150, width: null, flex: 1, resizeMode: 'cover', }} />
                                    </CardItem>
                                    <CardItem>
                                        <Left>
                                            <Text style={{ flexDirection: 'row', marginLeft: -5 }}>{rowData.title}</Text>
                                        </Left>
                                        <Right>
                                            <Timestamp time={rowData.date} component={Text} format='date' />
                                        </Right>
                                    </CardItem>
                                </Card>
                            </TouchableOpacity>
                        </ListItem>
                    }
                />
                <Right>
                    <TouchableOpacity
                        style={styles.row}
                        onPress={() => this.openNews(this.props.myFirebaseConfig.firebaseConfig.vtcapp_news_url + 'page/2/')}
                        activeOpacity={0.7}
                    >
                        <Text style={{ marginTop: 10, marginBottom: 10, }} onPress={() => this.openNews(this.props.myFirebaseConfig.firebaseConfig.vtcapp_news_url + 'page/2/')}>Xem thêm</Text>
                    </TouchableOpacity>
                </Right>
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
        if (this.props.myServerData.isAdsList) {
            ls.get(this.props.myServerData.adsList[0].app_ads_id).then((data) => {
                //console.log("aaaaa "+data);
                this.setState({
                    ads_image_link: this.props.myFirebaseConfig.firebaseConfig.vtcapp_image_url + this.props.myServerData.adsList[0].app_ads_image_link,
                    ads_link: this.props.myServerData.adsList[0].app_ads_link
                });
                this.ShowModalFunction(data)
            });
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
        // var ads_image_link = '';
        // var ads_link = '';
        // if (this.props.myServerData.isAdsList){
        //     ads_image_link = this.props.myFirebaseConfig.firebaseConfig.vtcapp_image_url + this.props.myServerData.adsList[0].app_ads_image_link;
        //     ads_link = this.props.myServerData.adsList[0].app_ads_link
        // }

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
                    <View style={[styles.containerModal, modalBackgroundStyle]}>
                        <View style={styles.ModalInsideView}>
                            <View style={[styles.closeView, { zIndex: 999 }]}>
                                <TouchableOpacity onPress={() => this.closeAds()}>
                                    <Icon name="close-circle" style={{ color: '#ffffff' }} />
                                </TouchableOpacity>
                            </View>
                            <Image source={{ uri: this.state.ads_image_link }} style={{
                                height: '100%',
                                width: '100%',
                                resizeMode: 'stretch',
                                borderRadius: 10,
                            }} />
                            <View style={styles.ModalButton}>
                                <Button rounded onPress={() => { this.openAdsLink(this.state.ads_link) }}>
                                    <Text>Xem</Text>
                                </Button>
                            </View>
                        </View>
                    </View>
                </Modal>
            </View>
        )
    }

    render() {
        const newsData = this.props.myServerData.newsList;
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
                            onPress={() => this.checkLogin()}>
                            <Icon name="notifications" style={styles.icon_mb} />
                        </Button>
                    </Right>
                </Header>
                <Content style={{ backgroundColor: 'white' }} refreshControl={this._refreshControl()} >
                    {
                        this.showAds()
                    }
                    {newsData ? (
                        this.newsList()
                    ) : (
                            this.loading()
                        )}
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