import React, { Component } from 'react';
import {
    FlatList,
    Platform,
    ActivityIndicator,
    ListView,
    TouchableOpacity,
    StyleSheet,
    Navigator,
    Modal,
    Alert,
    RefreshControl,
    Image,
    ScrollView
} from 'react-native';
import { Container, Header, Title, Left, Icon, Right, Button, Body, Content, Text, Card, CardItem, Tabs, Tab, ScrollableTab, List, ListItem, Thumbnail, View } from "native-base";
import { connect } from "react-redux";
// import PopupDialog, {
//     DialogTitle,
//     DialogButton,
//     SlideAnimation
// } from 'react-native-popup-dialog';
import { ShareDialog } from 'react-native-fbsdk';
import { getGiftCode } from '../../lib/fetchData.js';
import { refeshData } from '../../index.js';
import { Dimensions } from 'react-native';
import FastImage from 'react-native-fast-image';

const screen = Dimensions.get('window');
// const slideAnimation = new SlideAnimation({
//     slideFrom: 'bottom'
// });

class GiftcodeDetailScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            dialogShow: false,
            shareLinkContent: '',
            giftcodeData: '',
            uid: '',
            key: '',
            uniqueId: '',
            ModalVisibleStatus: false,
            LoadingModalVisibleStatus: false,
            refreshing: false,
            isLoading: false,
        };
        this.showSlideAnimationDialog = this.showSlideAnimationDialog.bind(this);
    }

    componentDidMount() {
        const isGiftList = this.props.appGameList.isGiftList;
        this.setState({ isLoading: isGiftList })
    }

    _onRefresh() {
        this.setState({ refreshing: true });
        setTimeout(() => {
            refeshData("giftData");
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

    ShowModalFunction(visible) {
        this.setState({ ModalVisibleStatus: visible });
    }

    GetCodeModalFunction(visible) {
        this.setState({ LoadingModalVisibleStatus: visible });
    }

    showSlideAnimationDialog(rowData) {
        if (this.props.appUser.isAuth) {
            const shareLinkContent = {
                contentType: 'link',
                contentUrl: rowData.game_link_share,
                contentDescription: rowData.game_name,
            };
            this.setState({
                giftcodeData: rowData,
                shareLinkContent: shareLinkContent,
                uid: this.props.appUser.userProfile.uid,
                key: this.props.appFire.firebaseConfig.vtcapp_secure_key,
                uniqueId: this.props.appDevice.uniqueId
            });
            this.ShowModalFunction(true);
        } else {
            console.log("Chưa đăng nhập");
            this.error_login();
        }
    }

    error_login() {
        Alert.alert(
            'Thông báo',
            'Bạn chưa đăng nhập, vui lòng đăng nhập để nhận Code!',
            [
                { text: 'OK', onPress: () => this.props.navigation.navigate('Login') }
            ],
            { cancelable: false }
        )
    }

    giftcodeDialog() {
        var modalBackgroundStyle = {
            backgroundColor: this.state.ModalVisibleStatus ? 'rgba(0, 0, 0, 0.5)' : '#f5fcff',
        };
        return (
            <View style={styles.MainContainer}>
                <Modal
                    transparent={true}
                    animationType={"fade"}
                    visible={this.state.ModalVisibleStatus}
                    supportedOrientations={['portrait', 'landscape']}
                    onRequestClose={() => { this.ShowModalFunction(!this.state.ModalVisibleStatus) }} >
                    <View style={[styles.containerModal, modalBackgroundStyle]}>
                        <View style={styles.ModalInsideView}>
                            {/* <Image source={{ uri: this.props.appFire.firebaseConfig.vtcapp_image_url + this.state.giftcodeData.game_cover_link }} style={{
                                height: 125,
                                width: '100%',
                                borderRadius: 10,
                            }} /> */}
                            <FastImage
                                style={{ height: 125, width: '100%', borderRadius: 10 }}
                                source={{
                                    uri: this.props.appFire.firebaseConfig.vtcapp_image_url + this.state.giftcodeData.game_cover_link,
                                    // headers: { Authorization: '9876543210' },
                                    priority: FastImage.priority.high,
                                    cache: FastImage.cacheControl.immutable,
                                    //cache: FastImage.cacheControl.web,
                                    //cache: FastImage.cacheControl.cacheOnly,
                                }}
                            />
                            <Text style={styles.TextStyle}>{this.state.giftcodeData.giftcode_des}</Text>
                            <View style={styles.ModalButton}>
                                <Button transparent onPress={() => { this.ShowModalFunction(!this.state.ModalVisibleStatus) }}>
                                    <Text>Đóng</Text>
                                </Button>
                                <Button transparent onPress={() => { this.getCode() }}>
                                    <Text>Nhận code</Text>
                                </Button>
                            </View>
                        </View>
                    </View>
                </Modal>
            </View>
        )
    }

    async getCode() {
        this.ShowModalFunction(!this.state.ModalVisibleStatus)
        console.log(this.state.giftcodeData.event_type_id);
        switch (this.state.giftcodeData.event_type_id) {
            case "1":
                console.log("case 1");
                this.GetCodeModalFunction(!this.state.LoadingModalVisibleStatus)
                await getGiftCode(this.state.uid, this.state.giftcodeData.giftcode_event_id, this.state.key, this.state.uniqueId, this.props.appFire.firebaseConfig.vtcapp_api_url)
                    .then((msg) => {
                        console.log(msg);
                        this.GetCodeModalFunction(!this.state.LoadingModalVisibleStatus)
                        alert(msg);
                    });
                break;

            case "2":
                console.log("case 2");
                await this.shareLinkWithShareDialog().then((result) => {
                    if (result) {
                        this.GetCodeModalFunction(!this.state.LoadingModalVisibleStatus);
                        getGiftCode(this.state.uid, this.state.giftcodeData.giftcode_event_id, this.state.key, this.state.uniqueId, this.props.appFire.firebaseConfig.vtcapp_api_url)
                            .then((msg) => {
                                console.log(msg);
                                this.GetCodeModalFunction(!this.state.LoadingModalVisibleStatus)
                                alert(msg);
                            });
                    }
                });
                break;

            case "3":
                console.log("case 3")
                break;

            case "4":
                console.log("case 4")
                break;

            default:
                break;
        }
    }

    async shareLinkWithShareDialog() {
        var tmp = this;
        // const uid = this.state.uid;
        // const giftcode_event_id = this.state.giftcodeData.giftcode_event_id;
        // const key = this.state.key;
        // const uniqueId = this.state.uniqueId;
        // const apiURL = this.props.appFire.firebaseConfig.vtcapp_api_url;
        var isShare = false;

        await ShareDialog.canShow(this.state.shareLinkContent).then(
            function (canShow) {
                if (canShow) {
                    return ShareDialog.show(tmp.state.shareLinkContent);
                }
            }
        ).then(
            function (result) {
                if (result.isCancelled) {
                    alert('Bạn đã hủy chia sẽ, hãy chia sẽ thông tin và nhận ngay Giftcode');
                    isShare = false;
                } else {
                    isShare = true;
                    // this.GetCodeModalFunction(!this.state.LoadingModalVisibleStatus);
                    // getGiftCode(uid, giftcode_event_id, key, uniqueId, apiURL)
                    //     .then((result) => {
                    //         console.log(result);
                    //         this.GetCodeModalFunction(!this.state.LoadingModalVisibleStatus)
                    //         alert("Giftcode của bạn là " + result.trim() + ". Được lưu vào trong Túi Giftcode!");
                    //     });
                }
            },
            function (error) {
                alert('Lỗi chia sẽ, vui lòng thử lại');
                isShare = false;
            }
        );
        return isShare;
    }

    loadingGetCode() {
        var modalBackgroundStyle = {
            backgroundColor: this.state.LoadingModalVisibleStatus ? 'rgba(0, 0, 0, 0.5)' : '#f5fcff',
        };
        return (
            <View style={styles.LoadingMainContainer}>
                <Modal
                    transparent={true}
                    animationType={"fade"}
                    visible={this.state.LoadingModalVisibleStatus}
                    supportedOrientations={['portrait', 'landscape']}
                    onRequestClose={() => { this.GetCodeModalFunction(!this.state.LoadingModalVisibleStatus) }} >
                    <View style={[styles.containerModal, modalBackgroundStyle]}>
                        <View style={styles.LoadingModalInsideView}>
                            <ActivityIndicator size="large" color="#fff" />
                            <Text style={styles.LoadngTextStyle}>Đang nhận code...</Text>
                        </View>
                    </View>
                </Modal>
            </View>
        )
    }

    loading() {
        return (
            <View style={[styles.container, styles.horizontal]}>
                <ActivityIndicator size="small" color="#0000ff" />
            </View>
        )
    }

    giftcodeList() {
        const newData = [];
        if (this.props.appGameList.giftList !== null) {
            for (let newVar of this.props.appGameList.giftList) {
                if (newVar.game_id === this.props.navigation.state.params.game_id) {
                    newData.push(newVar)
                }
            }
        }
        if (newData.length === 0) {
            return this.giftListNull()
        }
        const renderGiftList = ({ item }) => (
            <ListItem thumbnail style={{ paddingTop: 0, paddingBottom: 0 }}>
                <TouchableOpacity
                    style={styles.row}
                    onPress={() => { this.showSlideAnimationDialog(item); }}
                    activeOpacity={0.7}
                >
                    <Left>
                        {/* <Thumbnail square size={50} style={{ width: 64, height: 64 }} source={{ uri: this.props.appFire.firebaseConfig.vtcapp_image_url + rowData.game_icon_link }} /> */}
                        <FastImage
                            style={{ width: 64, height: 64 }}
                            source={{
                                uri: this.props.appFire.firebaseConfig.vtcapp_image_url + item.game_icon_link,
                                // headers: { Authorization: '9876543210' },
                                priority: FastImage.priority.normal,
                                cache: FastImage.cacheControl.immutable,
                                //cache: FastImage.cacheControl.web,
                                //cache: FastImage.cacheControl.cacheOnly,
                            }}
                        />
                    </Left>
                    <Body>
                        <Text style={{ fontSize: 16 }}>{item.giftcode_event_name}</Text>
                        <Text style={{ fontSize: 14 }}>Thời hạn: {item.giftcode_event_end_date}</Text>
                        <Text style={{ fontSize: 14 }}>Còn lại: {item.remain_giftcode}/{item.total_giftcode}</Text>
                    </Body>
                    <Right>
                        <Button transparent onPress={() => { this.showSlideAnimationDialog(item); }}>
                            <Text style={{ fontSize: 14 }}>Nhận</Text>
                        </Button>
                    </Right>
                </TouchableOpacity>
            </ListItem>
        );
        return (
            <View>
                <FlatList
                    data={newData}
                    renderItem={renderGiftList}
                    keyExtractor={item => item.id}
                />
            </View>
        )
    }

    giftListNull() {
        return (
            <View style={[styles.container, styles.horizontal]}>
                <Text>Chưa có danh sách Giftcode</Text>
            </View>
        )
    }

    giftListView() {
        const giftListData = this.props.appGameList.giftList;
        if (giftListData !== null) {
            return this.giftcodeList();
        }
        return this.loading()
    }

    render() {
        return (
            <Container style={{ backgroundColor: '#fff' }}>
                <Header hasTabs>
                    <Left>
                        <Button transparent onPress={() => this.props.navigation.goBack()}>
                            <Icon name="arrow-back" />
                        </Button>
                    </Left>
                    <Body>
                        <Title>{this.props.navigation.state.params.game_name}</Title>
                    </Body>
                    <Right />
                </Header>
                <ScrollView style={{ flex: 1 }} refreshControl={this._refreshControl()} >
                    <View style={styles.giftview}>
                        {this.giftcodeDialog()}
                        {this.loadingGetCode()}
                        {this.state.isLoading ? (
                            this.giftListView()
                        ) : (
                                this.giftListNull()
                            )}
                    </View>
                </ScrollView>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff'
    },
    containerModal: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    giftview: {
        flex: 1,
        justifyContent: 'center',
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
    dialogContentView: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    MainContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    LoadingMainContainer: {
        flex: 1,
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 999,
    },
    ModalInsideView: {
        alignItems: 'center',
        backgroundColor: "#fff",
        height: 320,
        width: '90%',
        borderRadius: 10,
        borderWidth: 0.1,
        borderColor: '#000',
    },
    LoadingModalInsideView: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
        height: 75,
        width: 150,
    },
    TextStyle: {
        marginTop: 10,
        fontSize: 16,
        color: "#000",
    },
    LoadngTextStyle: {
        fontSize: 14,
        color: "#fff",
    },
    ModalButton: {
        flexDirection: 'row',
        position: 'absolute',
        bottom: 0,
    }
})

function mapStateToProps(state) {
    return {
        appGameList: state.server,
        appDevice: state.device,
        appUser: state.auth,
        appFire: state.firebase
    };
}

export default connect(mapStateToProps)(GiftcodeDetailScreen);
