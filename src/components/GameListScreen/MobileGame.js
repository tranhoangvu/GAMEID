import React, { Component } from 'react';
import { ScrollView, FlatList, Platform, ActivityIndicator, TouchableOpacity, StyleSheet, RefreshControl, Image, Alert } from 'react-native';
import { Container, Header, Title, Left, Icon, Right, Button, Body, Content, Text, Card, CardItem, Tabs, Tab, ScrollableTab, List, ListItem, Thumbnail, View, Badge } from "native-base";
import { connect } from "react-redux";
import AppLink from '../../lib/appLink.js';
import { refeshData } from '../../index.js';
import { Dimensions } from 'react-native';
import FastImage from 'react-native-fast-image';
import Orientation from 'react-native-orientation';
import TextMedium from '../../components/Lib/TextMedium';

const starChecked = require("../../assets/images/start_checked.png");
const starUnchecked = require("../../assets/images/start_unchecked.png");

const screen = Dimensions.get('window');
class MobileGame extends Component {

    constructor(props) {
        super(props);
        this.state = {
            refreshing: false,
            isLoading: this.props.appGameList.isGameList || false,
            gameData: this.props.appGameList.gameList || "",
            width: Dimensions.get('window').width,
            height: Dimensions.get('window').height - 20,
        };
    }

    componentDidMount() {
        Orientation.addOrientationListener(this._orientationDidChange);
    }

    componentWillUnmount() {
        Orientation.getOrientation((err, orientation) => {
            console.log(`Current Device Orientation: ${orientation}`);
        });
        // Remember to remove listener
        Orientation.removeOrientationListener(this._orientationDidChange);
    }

    _orientationDidChange = (orientation) => {
        console.log(orientation);
        this.setState({
            width: Dimensions.get('window').width,
            height: Dimensions.get('window').height
        })
        if (orientation === 'LANDSCAPE') {
        } else {
        }
    }
    _onRefresh() {
        this.setState({
            refreshing: true
        });
        setTimeout(() => {
            refeshData("gameData");
            this.setState({
                refreshing: false
            });
        }, 1500);
    }

    _refreshControl() {
        return (
            <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this._onRefresh.bind(this)}
            />
        )
    }


    badgeNotification() {
        const userCountMess = this.props.appGameList.userCountMess;
        if (userCountMess !== null) {
            return (
                <Badge style={styles.mb}>
                    <Text style={{ fontSize: 10 }}>{userCountMess}</Text>
                </Badge>
            )
        }
    }

    loading() {
        return (
            <View style={[styles.container, styles.horizontal]}>
                <ActivityIndicator size="small" color="#0000ff" />
            </View>
        )
    }

    gameNull() {
        return (
            <View style={[styles.container, styles.horizontal]}>
                <Text>Chưa có danh sách trò chơi</Text>
            </View>
        )
    }

    openApp(game_ios_link, game_ios_scheme, game_android_link) {
        AppLink.openApp(game_ios_link, game_ios_scheme, game_android_link).then(() => {
            console.log('Open URL');
        })
            .catch((err) => {
                console.log('Error: ' + err);
            });
    }

    starRating(star) {
        const temp = [];
        for (let i = 0; i < star; i++) {
            temp.push(
                <Image key={i}
                    source={starChecked}
                    style={styles.star}
                />
            )
        }
        if (star < 5) {
            for (let j = 0; j < 5 - star; j++) {
                temp.push(
                    <Image key={star + 1 - j}
                        source={starUnchecked}
                        style={styles.star}
                    />
                )
            }

        }
        return (<View style={{ flexDirection: 'row' }}>
            {temp}
        </View>
        )
    }

    gameList() {
        console.log(this.state.width);
        console.log(this.state.height);
        const renderGameList = ({ item }) => (
            <ListItem thumbnail style={{ paddingTop: 0, paddingBottom: 0 }}>
                <TouchableOpacity
                    style={styles.row}
                    onPress={() => this.openApp(item.game_ios_link, item.game_ios_scheme, item.game_android_link)}
                    activeOpacity={0.7}
                >
                    <Left>
                        {/* <Thumbnail square size={50} style={{ width: 64, height: 64 }} source={{ uri: this.props.appFire.firebaseConfig.vtcapp_image_url + rowData.game_icon_link }} /> */}
                        <FastImage
                            style={{ width: 64, height: 64 }}
                            source={{
                                uri: this.props.appFire.firebaseConfig.vtcapp_image_url + item.game_icon_link,
                                // headers: {Authorization: '9876543210' },
                                priority: FastImage.priority.high,
                                cache: FastImage.cacheControl.immutable,
                                //cache: FastImage.cacheControl.web,
                                //cache: FastImage.cacheControl.cacheOnly,
                            }}
                        />
                    </Left>
                    <Body>
                        <Text style={{ fontSize: 16 }}>{item.game_name}</Text>
                        <Text style={{ fontSize: 14 }}>Lượt tải: {item.game_total_download}</Text>
                        {this.starRating(item.game_rating)}
                    </Body>
                    <Right>
                        <Button transparent onPress={() => this.openApp(item.game_ios_link, item.game_ios_scheme, item.game_android_link)}>
                            <Text style={{ fontSize: 14 }}>Tải game</Text>
                        </Button>
                    </Right>
                </TouchableOpacity>
            </ListItem>
        );
        const renderGameList_temp = ({ item }) => (
            <View
                style={{
                    flexDirection: "column",
                    flex: 1,
                    borderBottomColor: "#E4ECF5",
                    borderBottomWidth: 0.95,
                    marginBottom: 10,

                }}
            >
                <View style={{ flex: 0.6, flexDirection: "column" }}>
                    <TouchableOpacity
                        onPress={() => this.openApp(item.game_ios_link, item.game_ios_scheme, item.game_android_link)}
                    >
                        <View
                            style={{ flexDirection: "row" }}
                        >
                            <View
                                style={{
                                    flexDirection: "column",
                                    flex: 0.35,
                                    marginLeft: 5,
                                    marginTop: 5,
                                    height: 85
                                }}
                            >
                                <FastImage
                                    style={{ flex: 1, borderRadius: 5 }}
                                    source={{
                                        uri: this.props.appFire.firebaseConfig.vtcapp_image_url + item.game_icon_link,
                                        priority: FastImage.priority.high,
                                        cache: FastImage.cacheControl.immutable,
                                    }} />
                            </View>
                            <View style={{ flexDirection: "column", flex: 1, marginLeft: 10 }}>
                                <TextMedium
                                    extraStyle={{
                                        color: "#8D96A3",
                                        fontSize: 14,
                                        marginRight: 10,
                                    }}
                                    Text={item.game_name}
                                />
                                <TextMedium
                                    extraStyle={{
                                        color: "#8D96A3",
                                        fontSize: 14,
                                    }}
                                    Text={item.game_total_download}
                                />
                                {this.starRating(item.game_rating)}
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
                                    <View>
                                        <View
                                            style={{
                                                justifyContent: "flex-end",
                                                flexDirection: "row",
                                            }}
                                        >
                                            <View style={{ flex: 1, flexDirection: "row" }}>
                                                <View style={{ flex: 1, justifyContent: "center" }}>
                                                    <Icon
                                                        name="ios-share-alt"
                                                        size={18}
                                                        style={{
                                                            color: "#808080",
                                                            alignSelf: "flex-end"
                                                        }}
                                                    />
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View >
            </View >
        );
        return (
            <View style={{ flex: 1, width: '100%', height: '100%' }}>
                <FlatList
                    data={this.props.appGameList.gameList}
                    renderItem={renderGameList_temp}
                    keyExtractor={item => item.id}
                />
            </View>
        )
    }

    gameListView() {
        if (this.props.appGameList.gameList !== null) {
            this.props.appGameList.gameList.map((item) => {
                FastImage.preload([
                    {
                        uri: this.props.appFire.firebaseConfig.vtcapp_image_url + item.game_icon_link
                    },
                    {
                        uri: this.props.appFire.firebaseConfig.vtcapp_image_url + item.game_cover_link
                    }
                ])
            })

            return this.gameList();
        }
        return this.loading()
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

    render() {
        return (
            <ScrollView style={{ flex: 1 }} refreshControl={this._refreshControl()} >
                {this.state.isLoading ? (
                    this.gameListView()
                ) : (
                        this.gameNull()
                    )}
            </ScrollView>
        );
    }
}

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
    row: {
        width: screen.width - 30,
        flexDirection: 'row',
    },
    star: {
        width: 16,                          // Set width
        height: 16,                         // Set height
    },
    mb: {
        right: 0,
        flex: -1,
        position: 'absolute'
    },
    icon_mb: {
        right: 10
    }
})

function mapStateToProps(state) {
    return {
        appGameList: state.server,
        myUserProfile: state.auth,
        appFire: state.firebase
    };
}

export default connect(mapStateToProps)(MobileGame);