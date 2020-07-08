import React, { Component } from 'react';
import { Platform, ActivityIndicator, TouchableOpacity, StyleSheet, RefreshControl, ImageBackground, Image, Alert } from 'react-native';
import { Container, Header, Title, Left, Icon, Right, Button, Body, Content, Text, Card, CardItem, Tabs, Tab, ScrollableTab, List, ListItem, Thumbnail, View, Badge } from "native-base";
import { connect } from "react-redux";
import { refeshData } from '../../index.js';
import { Dimensions } from 'react-native';

const screen = Dimensions.get('window');

class GiftcodeScreen extends Component {

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

    gameGiftcodeList() {
        return (
            <View style={{ flex: 1 }}>
                <List
                    dataArray={this.props.appGameList.gameGiftList}
                    renderRow={rowData =>
                        <ListItem style={{ paddingTop: 0, paddingBottom: 0, height: 150 }}>
                            <TouchableOpacity
                                style={styles.row}
                                onPress={() => this.giftcodeDetail(rowData.game_id, rowData.game_name)}
                                activeOpacity={0.7}
                            >
                                <ImageBackground source={{ uri: this.props.appFire.firebaseConfig.vtcapp_image_url + rowData.game_cover_link }} style={styles.imageBackground} imageStyle={{ borderRadius: 5 }}>
                                </ImageBackground>
                            </TouchableOpacity>
                        </ListItem>
                    }
                />
            </View>
        )
    }

    giftcodeDetail(game_id, game_name) {
        this.props.navigation.navigate("GiftcodeDetail", { game_id: game_id, game_name: game_name });
    }

    gameGiftListNull() {
        return (
            <View style={[styles.container, styles.horizontal]}>
                <Text>Chưa có danh sách Giftcode</Text>
            </View>
        )
    }

    gameGiftListView() {
        const gameGiftListData = this.props.appGameList.gameGiftList;
        if (gameGiftListData !== null) {
            return this.gameGiftcodeList();
        }
        return this.gameGiftListNull()
    }

    render() {
        const isGameGiftList = this.props.appGameList.isGameGiftList;
        return (
            <Container style={{ backgroundColor: 'white' }}>
                <Header>
                    <Left>
                        <Button
                            transparent
                            onPress={() => this.props.navigation.openDrawer()}>
                            <Icon name="menu" />
                        </Button>
                    </Left>
                    <Body>
                        <Title>Giftcode</Title>
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
                <Content refreshControl={this._refreshControl()} >
                    {isGameGiftList ? (
                        this.gameGiftListView()
                    ) : (
                            this.loading()
                        )}
                </Content>
            </Container>
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
    },
    imageBackground: {
        height: 125,                        // Divide screen height by 3
        justifyContent: 'center',           // Center vertically
        alignItems: 'stretch',               // Center horizontally
        // alignItems: 'stretch'
    },
    text: {
        color: '#fff',                      // White text color
        backgroundColor: 'transparent',     // No background
        fontWeight: 'bold',                 // Bold font
    },
    title: {
        fontSize: 16,                       // Bigger font size
    },
    rating: {
        flexDirection: 'row',               // Arrange icon and rating in one line
    },
    icon: {
        width: 36,                          // Set width
        height: 36,                         // Set height
        marginRight: 5,                     // Add some margin between icon and rating
    },
    value: {
        fontSize: 16,                       // Smaller font size
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

export default connect(mapStateToProps)(GiftcodeScreen);