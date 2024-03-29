import React, { Component } from 'react';
import { ScrollView, FlatList, Platform, ActivityIndicator, TouchableOpacity, StyleSheet, RefreshControl, Image, Alert, Linking } from 'react-native';
import { Container, Header, Title, Left, Icon, Right, Button, Body, Content, Text, Card, CardItem, Tabs, Tab, ScrollableTab, List, ListItem, Thumbnail, View, Badge } from "native-base";
import { connect } from "react-redux";
import AppLink from '../../lib/appLink.js';
import { refeshData } from '../../index.js';
import { Dimensions } from 'react-native';
import { withNavigation } from 'react-navigation';
import FastImage from 'react-native-fast-image';

const starChecked = require("../../assets/images/start_checked.png");
const starUnchecked = require("../../assets/images/start_unchecked.png");

const screen = Dimensions.get('window');
class H5Game extends Component {

    constructor(props) {
        super(props);
        this.state = {
            refreshing: false,
            isLoading: this.props.appGameList.isGameH5List || false,
        };
    }

    componentDidMount() {
    }

    _onRefresh() {
        this.setState({ refreshing: true });
        setTimeout(() => {
            refeshData("h5Data");
            this.setState({ refreshing: false });
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

    openApp(game_h5_link) {
        if (game_h5_link !== '') {
            Linking.canOpenURL(game_h5_link).then(supported => {
                if (supported) {
                    this.props.navigation.navigate("H5Play", {
                        weblink: game_h5_link
                    });
                } else {
                    console.log("link error");
                }
            }).catch(err => console.error('An error occurred', err));
        }
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
        const renderGameH5List = ({ item }) => (
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
                        <Text style={{ fontSize: 14 }}>Lượt chơi: {item.game_total_download}</Text>
                        {this.starRating(item.game_rating)}
                    </Body>
                    <Right>
                        <Button transparent onPress={() => this.openApp(item.game_h5_link)}>
                            <Text style={{ fontSize: 14 }}>Chơi ngay</Text>
                        </Button>
                    </Right>
                </TouchableOpacity>
            </ListItem>
        );
        return (
            <View style={{ flex: 1, width: '100%', height: '100%' }}>
                <FlatList
                    data={this.props.appGameList.gameH5List}
                    renderItem={renderGameH5List}
                    keyExtractor={item => item.id}
                />
            </View>
        )
    }

    gameListView() {
        const gameData = this.props.appGameList.gameH5List;
        if (gameData !== null) {
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
                {this.props.appGameList.isGameH5List ? (
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

export default withNavigation(connect(mapStateToProps)(H5Game));