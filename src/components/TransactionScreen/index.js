import React, { Component } from 'react';
import { Platform, ActivityIndicator, ListView, TouchableOpacity, StyleSheet, Alert, RefreshControl, Linking } from 'react-native';
import { Container, Header, Title, Left, Icon, Right, Button, Body, Content, Text, Card, CardItem, Tabs, Tab, ScrollableTab, List, ListItem, Thumbnail, View } from "native-base";
import { connect } from "react-redux";
import { refeshData, updateTransaction } from '../../index.js';
import { readNotifi } from '../../lib/fetchData.js';
import { Dimensions } from 'react-native';
import Timestamp from '../../lib/timestamp';

const screen = Dimensions.get('window');
class TransactionScreen extends Component {

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

    loading() {
        return (
            <View style={[styles.container, styles.horizontal]}>
                <ActivityIndicator size="small" color="#0000ff" />
            </View>
        )
    }

    // readNotifi(){
    //     if(this.props.myUserProfile.userProfile.uid !== ''){
    //         readNotifi(this.props.myUserProfile.userProfile.uid, this.props.appFire.firebaseConfig.vtcapp_secure_key, this.props.appDevice.uniqueId, this.props.appFire.firebaseConfig.vtcapp_api_url)
    //     }
    // }

    confirmTransaction(status, app_card_order_code) {
        // console.log(app_card_order_code);
        switch (status) {
            case '1':
                Alert.alert(
                    'Thông báo',
                    'Bạn chắc chắn xác nhận đã chuyển khoản thanh toán mua thẻ?', [{
                            text: 'OK',
                            onPress: () => updateTransaction(app_card_order_code)
                        },
                        {
                            text: 'Cancel',
                            onPress: () => console.log('Cancel Pressed'),
                            style: 'cancel'
                        },
                    ], {
                        cancelable: false
                    }
                )
                break;
        
            case '2':
                Alert.alert('Thông báo!', 'Bạn đã xác nhận chuyển khoản thanh toán, vui lòng đợi hệ thống xác nhận thanh toán');
                break;

            case '3':
                Alert.alert('Thông báo!', 'Hệ thống đã xác nhận thanh toán, vui lòng đợi cung cấp mã thẻ Scoin');
                break;

            case '4':
                Alert.alert('Thông báo!', 'Mã thẻ Scoin của bạn đã được xuất, vui lòng xem trong Túi đồ');
                break;

            default:
                break;
        }

    }

    not_login() {
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

    // openTransaction(linkURL) {
    //     if (linkURL !== '') {
    //         Linking.canOpenURL(linkURL).then(supported => {
    //             if (supported) {
    //                 return Linking.openURL(linkURL);
    //             } else {
    //                 console.log("link error");
    //             }
    //         }).catch(err => console.error('An error occurred', err));
    //     }
    // }

    transactionList() {
        return (
            <View>
                <List dataArray={this.props.appGameList.userTransactionList}
                    renderRow={rowData =>
                        <ListItem thumbnail style={{ paddingTop: 0, paddingBottom: 0 }}>
                            <TouchableOpacity
                                style={styles.row}
                                onPress = {
                                    () => this.confirmTransaction(rowData.app_card_order_status, rowData.app_card_order_code)
                                }
                                activeOpacity={0.7}
                            >
                            <Left>
                                <Thumbnail size={55} style={{ width: 55, height: 55 }} source={{ uri: this.props.appFire.firebaseConfig.vtcapp_image_url + 'scoin_icon.png' }} />
                            </Left>
                            <Body>
                                <Text style={{ fontSize: 15 }}>Mã đặt hàng: <Text style={{color: 'red'}}>{rowData.app_card_order_code}</Text></Text>
                                <Text style={{ fontSize: 15 }}>Thanh toán: {rowData.app_bank_info_name}</Text>
                                <Text style={{ fontSize: 15 }}>Mệnh giá: {rowData.app_card_order_value}VNĐ</Text>
                                <Text style={{ fontSize: 15 }}>Số lượng: {rowData.app_card_order_amount}</Text>
                                <Text style={{ fontSize: 15 }}>Tổng thanh toán: {parseInt(rowData.app_card_order_value) * parseInt(rowData.app_card_order_amount)}VNĐ</Text>
                                <Text style={{ fontSize: 15 }}>Tình trạng: 
                                    {rowData.app_card_order_status == 1 && <Text style={{color: 'red'}}> Chưa chuyển khoản</Text>}
                                    {rowData.app_card_order_status == 2 && <Text style={{color: 'red'}}> Xác nhận đã chuyển khoản</Text>}
                                    {rowData.app_card_order_status == 3 && <Text style={{color: 'red'}}> Đã nhận chuyển khoản</Text>}
                                    {rowData.app_card_order_status == 4 && <Text style={{color: 'red'}}> Đã xuất mã Scoin</Text>}
                                </Text>
                                {/* <Text style={{ fontSize: 14 }}>{rowData.app_card_order_time}</Text> */}
                                <Timestamp time={rowData.app_card_order_time} utc={false} component={Text} format='full' style={{ fontSize: 15 }}/>
                            </Body>
                            {/* <Right>
                                <Button transparent onPress={() => }>
                                    <Text style={{ fontSize: 14 }}>Xác nhận</Text>
                                </Button>
                            </Right> */}
                            </TouchableOpacity>
                        </ListItem>
                    }
                />
            </View>
        )
    }

    transactionListNull() {
        return (
            <View style={[styles.container, styles.horizontal]}>
                <Text>Chưa có lịch sử giao dịch</Text>
            </View>
        )
    }

    transactionListView() {
        const userTransactionListData = this.props.appGameList.userTransactionList;
        if (userTransactionListData !== null) {
            return this.transactionList();
        }
        return this.transactionListNull()
    }

    render() {
        const isUserTransactionList = this.props.appGameList.isUserTransactionList;
        const isAuth = this.props.myUserProfile.isAuth;
        return (
            <Container style={{ backgroundColor: 'white' }}>
                <Header hasTabs>
                    <Left>
                        <Button transparent onPress={() => this.props.navigation.goBack()}>
                            <Icon name="arrow-back" />
                        </Button>
                    </Left>
                    <Body>
                        <Title>Lịch sử giao dịch</Title>
                    </Body>
                    <Right>
                        <Button
                            transparent
                            onPress={() => refeshData("4")}>
                            < Icon name = "md-refresh" />
                        </Button>
                    </Right>
                </Header>
                <Content refreshControl={this._refreshControl()} >
                    {isAuth ? (
                        isUserTransactionList ? (
                            this.transactionListView()
                        ) : (
                                this.loading()
                            )
                    ) : (
                            this.not_login()
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
        flexDirection: 'row',
    },
})

function mapStateToProps(state) {
    return {
        appGameList: state.server,
        myUserProfile: state.auth,
        appDevice: state.device,
        appFire: state.firebase
    };
}

export default connect(mapStateToProps)(TransactionScreen);