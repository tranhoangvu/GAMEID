import React, { Component } from 'react';
import { ScrollView, FlatList, Platform, ActivityIndicator, ListView, TouchableOpacity, StyleSheet, Alert, RefreshControl, Clipboard } from 'react-native';
import { Container, Header, Title, Left, Icon, Right, Button, Body, Content, Text, Card, CardItem, Tabs, Tab, ScrollableTab, List, ListItem, Thumbnail, View } from "native-base";
import { connect } from "react-redux";
import { refeshData } from '../../index.js';
import { Dimensions } from 'react-native';
import Timestamp from '../../lib/timestamp';

const screen = Dimensions.get('window');
class MyGiftcode extends Component {

    constructor(props) {
        super(props);
        this.state = {
            refreshing: false,
            isLoading: false,
        };
    }

    componentDidMount() {
        const isGiftList = this.props.appGameList.isGiftList;
        this.setState({ isLoading: isGiftList })
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

    async writeToClipboard(giftcode) {
        await Clipboard.setString(giftcode);
        Alert.alert(
            'Thông báo',
            'Đã copy code vào bộ nhớ!',
            [
                { text: 'OK', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
            ],
            { cancelable: false }
        )
    };

    loading() {
        return (
            <View style={[styles.container, styles.horizontal]}>
                <ActivityIndicator size="small" color="#0000ff" />
            </View>
        )
    }

    not_login() {
        // Alert.alert(
        //     'Thông báo',
        //     'Bạn chưa đăng nhập, vui lòng đăng nhập!',
        //     [
        //         { text: 'OK', onPress: () => this.props.navigation.navigate('Login') }
        //     ],
        //     { cancelable: false }
        // )
        return (
            <View style={[styles.container, styles.horizontal]}>
                <Text>Chưa đăng nhập</Text>
            </View>
        )
    }

    userGifftcodeList() {
        const renderMyGiftList = ({ item }) => (
            <ListItem thumbnail style={{ paddingTop: 0, paddingBottom: 0 }}>
                <TouchableOpacity
                    style={styles.row}
                    onPress={() => this.writeToClipboard(item.giftcode_code)}
                    activeOpacity={0.7}
                >
                    <Left>
                        <Thumbnail square size={50} style={{ width: 64, height: 64 }} source={{ uri: this.props.appFire.firebaseConfig.vtcapp_image_url + item.game_icon_link }} />
                    </Left>
                    <Body>
                        <Text style={{ fontSize: 16 }}>{item.giftcode_event_name}</Text>
                        <Text style={{ fontSize: 14 }}>Code: <Text style={{ color: 'red' }}>{item.giftcode_code}</Text></Text>
                        <Text style={{ fontSize: 14 }}>{item.user_giftcode_date}</Text>
                        {/* <Timestamp time={rowData.user_giftcode_date} utc={false} component={Text} format='full' style={{ fontSize: 14 }}/> */}
                    </Body>
                    <Right>
                        <Button transparent onPress={() => this.writeToClipboard(item.giftcode_code)}>
                            <Text style={{ fontSize: 14 }}>Sao chép</Text>
                        </Button>
                    </Right>
                </TouchableOpacity>
            </ListItem>
        );
        return (
            <View>
                <FlatList
                    data={this.props.appGameList.userGiftList}
                    renderItem={renderMyGiftList}
                    keyExtractor={item => item.id}
                />
            </View>
        )
    }

    userGiftListNull() {
        return (
            <View style={[styles.container, styles.horizontal]}>
                <Text>Chưa có danh sách Giftcode</Text>
            </View>
        )
    }

    userGiftListView() {
        const userGiftListData = this.props.appGameList.userGiftList;
        if (userGiftListData !== null) {
            return this.userGifftcodeList();
        }
        return this.loading()
    }

    render() {
        const isUserGiftList = this.props.appGameList.isUserGiftList;
        const isAuth = this.props.myUserProfile.isAuth;
        return (
            // <Container style={{ backgroundColor: 'white' }}>
            //     <Header hasTabs>
            //         <Left>
            //             <Button transparent onPress={() => this.props.navigation.goBack()}>
            //                 <Icon name="arrow-back" />
            //             </Button>
            //         </Left>
            //         <Body>
            //             <Title>Túi đồ</Title>
            //         </Body>
            //         <Right />
            //     </Header>
            <ScrollView style={{ flex: 1 }} refreshControl={this._refreshControl()} >
                {isAuth ? (
                    this.state.isLoading ? (
                        this.userGiftListView()
                    ) : (
                            this.userGiftListNull()
                        )
                ) : (
                        this.not_login()
                    )}
            </ScrollView>
            // </Container>
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
})

function mapStateToProps(state) {
    return {
        appGameList: state.server,
        myUserProfile: state.auth,
        appFire: state.firebase
    };
}

export default connect(mapStateToProps)(MyGiftcode);