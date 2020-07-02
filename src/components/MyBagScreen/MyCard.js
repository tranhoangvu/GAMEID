import React, { Component } from 'react';
import { Platform, ActivityIndicator, ListView, TouchableOpacity, StyleSheet, Alert, RefreshControl, Clipboard } from 'react-native';
import { Container, Header, Title, Left, Icon, Right, Button, Body, Content, Text, Card, CardItem, Tabs, Tab, ScrollableTab, List, ListItem, Thumbnail, View } from "native-base";
import { connect } from "react-redux";
import { refeshData } from '../../index.js';
import { Dimensions } from 'react-native';
import Timestamp from '../../lib/timestamp';

const screen = Dimensions.get('window');
class MyCard extends Component {

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

    async writeToClipboard (cardcode) {
        await Clipboard.setString(cardcode);
        Alert.alert(
            'Thông báo',
            'Đã copy code vào bộ nhớ!',
            [
                { text: 'OK', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
            ],
            { cancelable: false }
        )
    };
    
    componentDidMount() {
    }

    loading() {
        return (
            <View style={[styles.container, styles.horizontal]}>
                <ActivityIndicator size="small" color="#0000ff" />
            </View>
        )
    }

    not_login(){
        Alert.alert(
            'Thông báo',
            'Bạn chưa đăng nhập, vui lòng đăng nhập!',
            [
                { text: 'OK', onPress: () => this.props.navigation.navigate('Login') }
            ],
            { cancelable: false }
        )
        return (
            <View style={[styles.container, styles.horizontal]}>
                <Text>Chưa đăng nhập</Text>
            </View>
        )
    }

    userCardList() {
        return (
            <View>
                <List dataArray={this.props.appGameList.userCardList}
                    renderRow={rowData =>
                        <ListItem thumbnail style={{ paddingTop: 0, paddingBottom: 0 }}>
                            <TouchableOpacity
                                style={styles.row}
                                onPress={() => this.writeToClipboard(rowData.app_user_card_code)}
                                activeOpacity={0.7}
                            >
                            <Left>
                                <Thumbnail size={50} style={{ width: 64, height: 64 }} source={{ uri: this.props.appFire.firebaseConfig.vtcapp_image_url + 'scoin_icon.png' }} />
                            </Left>
                            <Body>
                                <Text style={{ fontSize: 14 }}>Mã đặt hàng: {rowData.app_card_order_code}</Text>
                                <Text style={{ fontSize: 14 }}>Mã thẻ: <Text style={{color: 'red'}}>{rowData.app_user_card_code}</Text></Text>
                                <Text style={{ fontSize: 14 }}>Mã seri: <Text style={{color: 'red'}}>{rowData.app_user_card_seri}</Text></Text>
                                <Text style={{ fontSize: 14 }}>Mệnh giá: {rowData.app_card_order_value}</Text>
                                <Text style={{ fontSize: 14 }}>{rowData.app_user_card_time}</Text>
                                {/* <Timestamp time={rowData.app_user_card_time} utc={false} component={Text} format='full' style={{ fontSize: 14 }}/> */}
                            </Body>
                            {/* <Right>
                                <Button transparent onPress={() => this.writeToClipboard(rowData.app_user_card_code)}>
                                    <Text style={{ fontSize: 14 }}>Sao chép</Text>
                                </Button>
                            </Right> */}
                            </TouchableOpacity>
                        </ListItem>
                    }
                />
            </View>
        )
    }

    userCardListNull() {
        return (
            <View style={[styles.container, styles.horizontal]}>
                <Text>Chưa có danh sách thẻ Scoin</Text>
            </View>
        )
    }

    userCardListView() {
        const userCardListData = this.props.appGameList.userCardList;
        if (userCardListData !== null) {
            return this.userCardList();
        }
        return this.userCardListNull()
    }

    render() {
        const isUserCardList = this.props.appGameList.isUserCardList;
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
                <Content refreshControl={this._refreshControl()} >
                    {isAuth ? (
                        isUserCardList ? (
                            this.userCardListView()
                        ) : (
                                this.loading()
                        )
                    ) : (
                            this.not_login()
                    )}
                </Content>
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

export default connect(mapStateToProps)(MyCard);