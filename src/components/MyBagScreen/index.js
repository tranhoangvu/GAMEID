import React, { Component } from 'react';
import { Platform, ActivityIndicator, ListView, TouchableOpacity, StyleSheet, Alert, RefreshControl, Clipboard } from 'react-native';
import { Container, Header, Title, Left, Icon, Right, Button, Body, Content, Text, Card, CardItem, Tabs, Tab, ScrollableTab, List, ListItem, Thumbnail, View } from "native-base";
import { connect } from "react-redux";
import { refeshData } from '../../index.js';
import { Dimensions } from 'react-native';
import MyGiftcode from './MyGiftcode';
import MyCard from './MyCard';

const screen = Dimensions.get('window');
export class MyBagScreen extends Component {

    constructor(props) {
        super(props);
        // this.state = {
        //     refreshing: false,
        // };
    }

    // _onRefresh() {
    //     this.setState({ refreshing: true });
    //     setTimeout(() => {
    //         refeshData("4");
    //         this.setState({ refreshing: false });
    //     }, 1500);
    // }

    // _refreshControl() {
    //     return (
    //         <RefreshControl
    //             refreshing={this.state.refreshing}
    //             onRefresh={this._onRefresh.bind(this)}
    //         />
    //     )
    // }

    // async writeToClipboard (giftcode) {
    //     await Clipboard.setString(giftcode);
    //     Alert.alert(
    //         'Thông báo',
    //         'Đã copy code vào bộ nhớ!',
    //         [
    //             { text: 'OK', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
    //         ],
    //         { cancelable: false }
    //     )
    // }

    componentDidMount() {
    }

    // loading() {
    //     return (
    //         <View style={[styles.container, styles.horizontal]}>
    //             <ActivityIndicator size="small" color="#0000ff" />
    //         </View>
    //     )
    // }

    // not_login(){
    //     Alert.alert(
    //         'Thông báo',
    //         'Bạn chưa đăng nhập, vui lòng đăng nhập!',
    //         [
    //             { text: 'OK', onPress: () => this.props.navigation.navigate('Login') }
    //         ],
    //         { cancelable: false }
    //     )
    //     return (
    //         <View style={[styles.container, styles.horizontal]}>
    //             <Text>Chưa đăng nhập</Text>
    //         </View>
    //     )
    // }

    // userGifftcodeList() {
    //     return (
    //         <View>
    //             <List dataArray={this.props.appGameList.userGiftList}
    //                 renderRow={rowData =>
    //                     <ListItem thumbnail style={{ paddingTop: 0, paddingBottom: 0 }}>
    //                         <TouchableOpacity
    //                             style={styles.row}
    //                             onPress={() => this.writeToClipboard(rowData.giftcode_code)}
    //                             activeOpacity={0.7}
    //                         >
    //                         <Left>
    //                             <Thumbnail square size={50} style={{ width: 64, height: 64 }} source={{ uri: this.props.appFire.firebaseConfig.vtcapp_image_url + rowData.game_icon_link }} />
    //                         </Left>
    //                         <Body>
    //                             <Text style={{ fontSize: 16 }}>{rowData.giftcode_event_name}</Text>
    //                             <Text style={{ fontSize: 14 }}>Code: {rowData.giftcode_code}</Text>
    //                             <Text style={{ fontSize: 14 }}>{rowData.user_giftcode_date}</Text>
    //                         </Body>
    //                         <Right>
    //                                 <Button transparent onPress={() => this.writeToClipboard(rowData.giftcode_code)}>
    //                                 <Text style={{ fontSize: 14 }}>Copy</Text>
    //                             </Button>
    //                         </Right>
    //                         </TouchableOpacity>
    //                     </ListItem>
    //                 }
    //             />
    //         </View>
    //     )
    // }

    // userGiftListNull() {
    //     return (
    //         <View style={[styles.container, styles.horizontal]}>
    //             <Text>Chưa có danh sách Giftcode</Text>
    //         </View>
    //     )
    // }

    // userGiftListView() {
    //     const userGiftListData = this.props.appGameList.userGiftList;
    //     if (userGiftListData !== null) {
    //         return this.userGifftcodeList();
    //     }
    //     return this.userGiftListNull()
    // }

    render() {
        // const isUserGiftList = this.props.appGameList.isUserGiftList;
        // const isAuth = this.props.myUserProfile.isAuth;
        return (
            <Container style={{ backgroundColor: 'white' }}>
                {/* <Header hasTabs> */}
                < Header >
                    <Left>
                        <Button transparent onPress={() => this.props.navigation.goBack()}>
                            <Icon name="arrow-back" />
                        </Button>
                    </Left>
                    <Body>
                        <Title>Túi đồ</Title>
                    </Body>
                    <Right />
                </Header>
                <Tabs>
                    <Tab heading="Giftcode">
                        <MyGiftcode />
                    </Tab>
                    <Tab heading="Mã thẻ Scoin">
                        < MyCard />
                    </Tab>
                </Tabs>

                {/* <Content refreshControl={this._refreshControl()} >
                    {isAuth ? (
                        isUserGiftList ? (
                            this.userGiftListView()
                        ) : (
                                this.loading()
                        )
                    ) : (
                            this.not_login()
                    )}
                </Content> */}
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
        flexDirection: 'row',
    },
})

function mapStateToProps(state) {
    return {
        appGameList: state.server,
        myUserProfile: state.auth,
        // appFire: state.firebase
    };
}

export default connect(mapStateToProps)(MyBagScreen);