import React, { Component } from 'react';
import { Platform, ActivityIndicator, TouchableOpacity, StyleSheet, RefreshControl, Image, Alert} from 'react-native';
import { Container, Header, Title, Left, Icon, Right, Button, Body, Content, Text, Card, CardItem, Tabs, Tab, ScrollableTab, List, ListItem, Thumbnail, View, Badge } from "native-base";
import { connect } from "react-redux";
import AppLink from '../../lib/appLink.js';
import { refeshData } from '../../index.js';
import { Dimensions } from 'react-native';

const starChecked = require("../../assets/images/start_checked.png");
const starUnchecked = require("../../assets/images/start_unchecked.png");

const screen = Dimensions.get('window');
class MobileGame extends Component {

    constructor(props) {
        super(props);
        this.state = {
            refreshing: false,
        };
    }

    _onRefresh() {
        this.setState({ refreshing: true });
        setTimeout(() => { 
            refeshData("4");
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
    
    componentDidMount() {
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

    openApp(game_ios_link, game_ios_scheme, game_android_link){
        AppLink.openApp(game_ios_link, game_ios_scheme, game_android_link).then(() => {
            console.log('Open URL');
        })
        .catch((err) => {
            console.log('Error: ' + err);
        });
    }

    starRating(star){
        const temp = [];
        for (let i = 0; i < star; i++) {
            temp.push(
                <Image key={i}
                    source={starChecked }
                    style={styles.star}
                />
            )
        }
        if(star < 5 ){
            for (let j = 0; j < 5 - star; j++) {
                temp.push(
                    <Image key={star+1-j}
                        source={starUnchecked}
                        style={styles.star}
                    />
                )
            }

        }
        return (<View style={{ flexDirection: 'row'}}>
            { temp}
        </View>
        )
    }

    gameList() {
        return (
            <View style={{ flex: 1 }}>
                <List
                    dataArray={this.props.appGameList.gameList}
                    renderRow={rowData =>
                        <ListItem thumbnail style={{ paddingTop: 0, paddingBottom: 0}}>
                            <TouchableOpacity
                                style={styles.row}
                                onPress={() => this.openApp(rowData.game_ios_link, rowData.game_ios_scheme, rowData.game_android_link)}
                                activeOpacity={0.7}
                            >
                            <Left>
                                <Thumbnail square size={50} style={{ width: 64, height: 64 }} source={{ uri: this.props.appFire.firebaseConfig.vtcapp_image_url + rowData.game_icon_link }} />
                            </Left>
                            <Body>
                                <Text style={{ fontSize: 16 }}>{rowData.game_name}</Text>
                                <Text style={{ fontSize: 14 }}>Lượt tải: {rowData.game_total_download}</Text>
                                    {this.starRating(rowData.game_rating)}
                            </Body>
                            <Right>
                                    <Button transparent onPress={() => this.openApp(rowData.game_ios_link, rowData.game_ios_scheme, rowData.game_android_link)}>
                                    <Text style={{ fontSize: 14 }}>Tải game</Text>
                                </Button>
                            </Right>
                            </TouchableOpacity>
                        </ListItem>
                        }
                />
            </View>
        )
    }

    gameListView(){
        const gameData = this.props.appGameList.gameList;
        if (gameData !== null){
            return this.gameList();
        }
        return this.gameNull()
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
        const isGameListLoading = this.props.appGameList.isGameList;
        return (
                <Content refreshControl={this._refreshControl()} >
                    {isGameListLoading ? (
                        this.gameListView()
                    ) : (
                        this.loading()
                    )}
                </Content>
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