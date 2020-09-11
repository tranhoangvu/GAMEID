import React, { Component } from "react";
import { Share, FlatList, View, Linking, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl, Alert, Modal } from "react-native";
import { Container, Header, Title, Left, Icon, Right, Button, Body, Text, Badge } from "native-base";
import { connect } from "react-redux";
import { refeshData } from '../../index.js';
import HTML from "react-native-render-html";
import axios from 'axios';
import { fonts } from "../../utils/fonts";
import truncate from "truncate-html";
import styles from "./style";
import BookMarkShare from "../Lib/BookMarkShare/index";
import ListViews from "../Lib/ListView/index";
import TextBold from "../Lib/TextBold/index";
import FastImage from 'react-native-fast-image';
import { releaseStatus } from '../../index';

let moment = require('moment'); //load moment module to set local language
require('moment/locale/vi'); //for import moment local language file during the application build
moment.locale('vi');//set moment local language to zh-cn

var ls = require('../../lib/localStorage');

class NewsScreen extends Component {

    constructor(props) {
        super(props);
        this.page = 1;
        this.onEndReachedCalledDuringMomentum = true;
        this.state = {
            loading: false, // user list loading
            refreshing: false,
            ModalVisibleStatus: false,
            ads_image_link: '',
            ads_link: '',
            latestNewURL: this.props.myFirebaseConfig.firebaseConfig.vtcapp_latest_news_api_url || "",
            newsData: this.props.myServerData.newsList || "",
            featureNewsData: this.props.myServerData.featureNewsList || "",
            latestNewsData: this.props.myServerData.latestNewsList || "",
            adsData: this.props.myServerData.adsList || "",
            isNewsList: this.props.myServerData.isNewsList || false,
            isFeatureNewsList: this.props.myServerData.isFeatureNewsList || false,
            isLatestNewsList: this.props.myServerData.isLatestNewsList || false,
            isAdsList: this.props.myServerData.isAdsList || false,

        };
    }

    componentDidMount() {
        this.checkAds();
        // console.log("isNewsList: " + this.state.isNewsList);
        // console.log("isAdsList: " + this.state.isAdsList);
    }

    UNSAFE_componentWillMount() {
    }

    componentWillUnmount() {
        console.log("news componentWillUnmount");
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (this.props.myServerData.featureNewsList !== nextProps.myServerData.featureNewsList) {
            this.setState({ featureNewsData: nextProps.myServerData.featureNewsList });
        }
        if (this.props.myServerData.latestNewsList !== nextProps.myServerData.latestNewsList) {
            this.setState({ latestNewsData: nextProps.myServerData.latestNewsList });
        }
    }

    async _onRefresh() {
        this.setState({ refreshing: true });
        refeshData("newsData");
        const url = this.state.latestNewURL + "&page=1";
        return axios.get(url)
            .then(res => {
                let data = res.data
                this.setState({ refreshing: false, latestNewsData: data }) // false isRefreshing flag for disable pull to refresh indicator, and clear all data and store only first page data
            })
            .catch(error => {
                this.setState({ refreshing: false, error: 'Something just went wrong' }) // false isRefreshing flag for disable pull to refresh
            });
        // this.setState({ refreshing: false });
        // setTimeout(() => {
        //     refeshData("newsData");
        //     this.setState({ refreshing: false });
        // }, 3000);
    }

    _refreshControl() {
        return (
            <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this._onRefresh.bind(this)}
            />
        )
    }

    _showResult(result) {
        console.log(result);
    }
    // _shareTextWithTitle = () => {
    //     Share.share(
    //         {
    //             message: this.state.url
    //         },
    //         {
    //             dialogTitle: "This is share dialog title",
    //             excludedActivityTypes: [
    //                 "com.apple.UIKit.activity.PostToTwitter",
    //                 "com.apple.uikit.activity.mail"
    //             ],
    //             tintColor: "green"
    //         }
    //     )
    //         .then(this._showResult)
    //         .catch(err => console.log(err));
    // };

    handleLoadMore = async () => {
        if (!this.state.loading) {
            this.page = this.page + 1; // increase page by 1
            this.fetchMore(this.page); // method for API call 
        }
    };

    async fetchMore(page) {
        //stackexchange User API url
        const url = this.state.latestNewURL + "&page=" + page;
        this.setState({ loading: true })
        // console.log(url);
        return axios.get(url)
            .then(res => {
                let listData = this.state.latestNewsData;
                // console.log('listData');
                let data = listData.concat(res.data); //concate list with response
                this.setState({ loading: false, latestNewsData: data });
            })
            .catch(error => {
                this.setState({ loading: false, error: 'Something just went wrong' })
            });
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
        const tagsStyles = {
            lineHeight: 1.5
        };
        const baseFontStyle = {
            color: "#041A33",
            fontFamily: fonts.PoppinsSemiBold,
            fontSize: 16,
            textAlign: "justify",
            textAlignVertical: "center",
            padding: 5
        };
        const renderFeature = ({ item }) => (
            <View style={styles.itemContainer}>
                <TouchableOpacity
                    style={{ flex: 1, flexDirection: "column" }}
                    onPress={() =>
                        this.props.navigation.navigate("NewsDetails", { item })
                    }
                >
                    <FastImage
                        style={styles.imageWrapper}
                        source={{
                            uri: item.featured_media != 0 ? item._embedded["wp:featuredmedia"]["0"].source_url : require("../../assets/images/img_not_found.jpg"),
                            priority: FastImage.priority.high,
                            cache: FastImage.cacheControl.immutable,
                        }} />

                    {/* <ImageBackground
                        source={
                            item.featured_media != 0
                                ? {
                                    uri:
                                        item._embedded["wp:featuredmedia"]["0"]
                                            .source_url
                                }
                                : require("../../assets/images/img_not_found.jpg")
                        }
                        style={styles.imageWrapper}
                        imageStyle={{ borderRadius: 10 }}
                    /> */}
                    <View style={{ flex: 1, justifyContent: "flex-start" }}>
                        <View style={styles.ListContentText}>
                            <HTML
                                html={truncate(item.title.rendered, {
                                    length: 45,
                                    stripTags: true
                                })}
                                tagsStyles={tagsStyles}
                                allowFontScaling
                                baseFontStyle={baseFontStyle}
                            />
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        );
        const renderLasest = ({ item }) => (
            <View
                style={{
                    flexDirection: "column",
                    flex: 1,
                    borderBottomColor: "#E4ECF5",
                    borderBottomWidth: 0.95,
                    marginBottom: 10,

                }}
            >
                <View style={{ flex: 0.6 }}>
                    <TouchableOpacity
                        onPress={() =>
                            this.props.navigation.navigate("NewsDetails", {
                                item
                            })
                        }
                    >
                        <ListViews
                            Categories={
                                item._embedded["wp:term"][0][0]["name"]
                            }
                            Title={item.title.rendered}
                            Time={item.date}
                            Author={item._embedded["author"]["0"].name}
                            source={
                                item.featured_media != 0
                                    ?
                                    // uri:
                                    item._embedded["wp:featuredmedia"]["0"]
                                        .source_url

                                    : require("../../assets/images/img_not_found.jpg")
                            }

                        />
                    </TouchableOpacity>
                </View>
                <View style={{ flex: 0.15 }}>
                    <TouchableOpacity
                        onPress={() =>
                            Share.share(
                                {
                                    message: item.link
                                },
                                {
                                    dialogTitle: "This is share dialog title",
                                    excludedActivityTypes: [
                                        "com.apple.UIKit.activity.PostToTwitter",
                                        "com.apple.uikit.activity.mail"
                                    ],
                                    tintColor: "green"
                                }
                            )
                                .then(this._showResult)
                                .catch(err => console.log(err))
                        }
                    >
                        <BookMarkShare Time={item.date} Author={item._embedded["author"]["0"].name} />
                    </TouchableOpacity>
                </View>
            </View>
        );
        return (
            <View style={{ flex: 1, width: '100%', height: '100%' }}>
                {/* Fetch FeatureNews */}
                < View >
                    <FlatList
                        // data={this.props.myServerData.featureNewsList}
                        data={this.state.featureNewsData}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        renderItem={renderFeature}
                        keyExtractor={item => item.id}
                    />
                </ View >
                {/* Fetch LatestNews */}
                < View style={{ marginHorizontal: 15 }
                }>
                    <TextBold extraStyle={styles.Title} Text="Tin mới nhất" />
                    <View
                        cornerRadius={5}
                        cardElevation={2}
                        cardMaxElevation={2}
                        style={{ marginTop: 15, marginBottom: 5 }}
                    >
                        <FlatList
                            showsVerticalScrollIndicator={false}
                            // data={this.props.myServerData.latestNewsList}
                            data={this.state.latestNewsData}
                            renderItem={renderLasest}
                            keyExtractor={item => item.id}
                            ListFooterComponent={this.renderFooter.bind(this)}
                        />
                    </View>
                </View >
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
        // console.log("releaseStatus: " + releaseStatus());
        if (releaseStatus()) {
            if (this.props.myServerData.isAdsList) {
                // console.log("adsList: " + this.props.myServerData.adsList);
                if (this.props.myServerData.adsList != null) {
                    ls.get(this.props.myServerData.adsList[0].app_ads_id).then((data) => {
                        // console.log("ads_news: " + data);
                        if (data === true || data === null || this.props.myServerData.adsList[0].app_ads_display == 1) {
                            // console.log(this.props.myFirebaseConfig.firebaseConfig.vtcapp_image_url + this.props.myServerData.adsList[0].app_ads_image_link);
                            FastImage.preload([
                                {
                                    uri: this.props.myFirebaseConfig.firebaseConfig.vtcapp_image_url + this.props.myServerData.adsList[0].app_ads_image_link
                                }
                            ])
                            this.setState({
                                ads_image_link: this.props.myFirebaseConfig.firebaseConfig.vtcapp_image_url + this.props.myServerData.adsList[0].app_ads_image_link,
                                ads_link: this.props.myServerData.adsList[0].app_ads_link
                            });
                            setTimeout(() => {
                                this.ShowModalFunction(true);
                            }, 3500);
                        }
                    });
                }
            }
        }
    }

    closeAds() {
        if (this.props.myServerData.adsList[0].app_ads_display == 1) {
            ls.set(this.props.myServerData.adsList[0].app_ads_id, true);
        } else {
            ls.set(this.props.myServerData.adsList[0].app_ads_id, false);
        }
        this.ShowModalFunction(false)
    }

    showAds() {
        // var modalBackgroundStyle = {
        //     backgroundColor: this.state.ModalVisibleStatus ? 'rgba(0, 0, 0, 0.5)' : '#f5fcff',
        // };
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
                                    {/* <Image source={{ uri: this.state.ads_image_link }} style={{
                                        height: '100%',
                                        width: '100%',
                                        resizeMode: 'stretch',
                                        borderRadius: 10,
                                    }} /> */}
                                    <FastImage
                                        style={{
                                            height: '100%', width: '100%', borderRadius: 10
                                        }}
                                        source={{
                                            uri: this.state.ads_image_link,
                                            // headers: { Authorization: '9876543210' },
                                            priority: FastImage.priority.high,
                                            cache: FastImage.cacheControl.immutable,
                                            //cache: FastImage.cacheControl.web,
                                            //cache: FastImage.cacheControl.cacheOnly,
                                        }}
                                        resizeMode={FastImage.resizeMode.stretch}
                                    />
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

    renderFooter = () => {
        //it will show indicator at the bottom of the list when data is loading otherwise it returns null
        if (!this.state.loading) return null;
        return (
            <View style={{ flex: 1, height: 50, alignItems: 'center', justifyContent: 'center' }}>
                <ActivityIndicator
                    style={{
                        flex: 1,
                        // alignItems: 'center',
                        // justifyContent: 'center',
                        color: '#000',
                        height: 80
                    }}
                />
                <Text style={{ fontSize: 14 }}>Đang tải tin tức...</Text>
            </View>
        );
    };

    isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
        const paddingToBottom = 20
        return layoutMeasurement.height + contentOffset.y >=
            contentSize.height - paddingToBottom
    }

    render() {
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
                {/* <View style={{ flex: 1, width: '100%', height: '100%' }}> */}
                <ScrollView
                    style={{ flex: 1, backgroundColor: 'white' }}
                    refreshControl={this._refreshControl()}
                    scrollEventThrottle={16}
                    onMomentumScrollEnd={({ nativeEvent }) => {
                        if (this.isCloseToBottom(nativeEvent)) {
                            this.setState({ loading: true })
                            this.handleLoadMore();
                            // console.log('aaaaaa');
                        }
                    }}
                >
                    {
                        this.showAds()
                    }
                    {this.props.myServerData.isFeatureNewsList ? (
                        this.newsList()
                    ) : (
                            this.loading()
                        )}
                </ScrollView>
                {/* </View> */}
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