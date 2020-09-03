import React, { Component } from 'react';
import { ScrollView, FlatList, Platform, ActivityIndicator, ListView, TouchableOpacity, StyleSheet, Alert, RefreshControl, Linking } from 'react-native';
import { Container, Header, Title, Left, Icon, Right, Button, Body, Content, Text, Card, CardItem, Tabs, Tab, ScrollableTab, List, ListItem, Thumbnail, View } from "native-base";
import { connect } from "react-redux";
import { refeshData } from '../../index.js';
import { readNotifi } from '../../lib/fetchData.js';
import { Dimensions } from 'react-native';
import Timestamp from '../../lib/timestamp';

const screen = Dimensions.get('window');
class Notifi extends Component {

    constructor(props) {
        super(props);
        this.state = {
            refreshing: false,
        };
    }

    componentDidMount() {
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

    loading() {
        return (
            <View style={[styles.container, styles.horizontal]}>
                <ActivityIndicator size="small" color="#0000ff" />
            </View>
        )
    }

    readNotifi() {
        if (this.props.myUserProfile.userProfile.uid !== '') {
            readNotifi(this.props.myUserProfile.userProfile.uid, this.props.appFire.firebaseConfig.vtcapp_secure_key, this.props.appDevice.uniqueId, this.props.appFire.firebaseConfig.vtcapp_api_url)
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

    openNotifi(linkURL) {
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

    notificationList() {
        const renderNotiList = ({ item }) => (
            <ListItem thumbnail style={{ paddingTop: 0, paddingBottom: 0 }}>
                <TouchableOpacity
                    style={styles.row}
                    onPress={() => this.openNotifi(item.app_messenger_link)}
                    activeOpacity={0.7}
                >
                    <Left>
                        <Thumbnail size={55} style={{ width: 55, height: 55 }} source={{ uri: this.props.appFire.firebaseConfig.vtcapp_image_url + item.app_messenger_icon }} />
                    </Left>
                    <Body>
                        <Text style={{ fontSize: 14 }}>{item.app_messenger_content}</Text>
                        <Timestamp time={item.app_messenger_date} utc={false} component={Text} format='full' style={{ fontSize: 13 }} />
                    </Body>
                </TouchableOpacity>
            </ListItem>
        );

        return (
            <View>
                <FlatList
                    data={this.props.appGameList.notificationList}
                    renderItem={renderNotiList}
                    keyExtractor={item => item.id}
                />
            </View>
        )
    }

    notificationListNull() {
        return (
            <View style={[styles.container, styles.horizontal]}>
                <Text>Chưa có danh sách thông báo</Text>
            </View>
        )
    }

    notificationListView() {
        const notificationListData = this.props.appGameList.notificationList;
        if (notificationListData !== null) {
            return this.notificationList();
        }
        return this.loading()
    }

    render() {
        const isNotificationList = this.props.appGameList.isNotificationList;
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
                        <Title>Thông báo</Title>
                    </Body>
                    <Right>
                        <Button
                            transparent
                            onPress={() => this.readNotifi()}>
                            <Icon name="md-done-all" />
                        </Button>
                    </Right>
                </Header>
                <ScrollView style={{ flex: 1 }} refreshControl={this._refreshControl()} >
                    {isAuth ? (
                        isNotificationList ? (
                            this.notificationListView()
                        ) : (
                                this.notificationListNull()
                            )
                    ) : (
                            this.not_login()
                        )}
                </ScrollView>
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

export default connect(mapStateToProps)(Notifi);