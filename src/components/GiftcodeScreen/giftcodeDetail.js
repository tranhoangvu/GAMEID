import React, { Component } from 'react';
import {
    Platform,
    ActivityIndicator,
    ListView,
    TouchableOpacity,
    StyleSheet,
    Navigator,
    Modal,
    Alert,
    RefreshControl,
    Image
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
            refreshing: false,
        };
        this.showSlideAnimationDialog = this.showSlideAnimationDialog.bind(this);
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

    ShowModalFunction(visible) {
        this.setState({ ModalVisibleStatus: visible });
    }

    componentDidMount() {
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

    getCode() {
        this.ShowModalFunction(!this.state.ModalVisibleStatus)
        switch (this.state.giftcodeData.event_type_id) {
            case "1":
                console.log("case 1")
                getGiftCode(this.state.uid, this.state.giftcodeData.giftcode_event_id, this.state.key, this.state.uniqueId, this.props.appFire.firebaseConfig.vtcapp_api_url);
                break;

            case "2":
                this.shareLinkWithShareDialog();
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

    shareLinkWithShareDialog() {
        var tmp = this;
        const uid = this.state.uid;
        const giftcode_event_id = this.state.giftcodeData.giftcode_event_id;
        const key = this.state.key;
        const uniqueId = this.state.uniqueId;
        const apiURL = this.props.appFire.firebaseConfig.vtcapp_api_url;

        ShareDialog.canShow(this.state.shareLinkContent).then(
            function (canShow) {
                if (canShow) {
                    return ShareDialog.show(tmp.state.shareLinkContent);
                }
            }
        ).then(
            function (result) {
                if (result.isCancelled) {
                    alert('Bạn đã hủy chia sẽ, hãy chia sẽ thông tin và nhận ngay Giftcode');
                } else {
                    getGiftCode(uid, giftcode_event_id, key, uniqueId, apiURL);
                }
            },
            function (error) {
                alert('Lỗi chia sẽ, vui lòng thử lại');
            }
        );
        return
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
        return (
            <View>
                <List dataArray={newData}
                    renderRow={rowData =>
                        <ListItem thumbnail style={{ paddingTop: 0, paddingBottom: 0 }}>
                            <TouchableOpacity
                                style={styles.row}
                                onPress={() => { this.showSlideAnimationDialog(rowData); }}
                                activeOpacity={0.7}
                            >
                                <Left>
                                    {/* <Thumbnail square size={50} style={{ width: 64, height: 64 }} source={{ uri: this.props.appFire.firebaseConfig.vtcapp_image_url + rowData.game_icon_link }} /> */}
                                    <FastImage
                                        style={{ width: 64, height: 64 }}
                                        source={{
                                            uri: this.props.appFire.firebaseConfig.vtcapp_image_url + rowData.game_icon_link,
                                            // headers: { Authorization: '9876543210' },
                                            priority: FastImage.priority.normal,
                                            cache: FastImage.cacheControl.immutable,
                                            //cache: FastImage.cacheControl.web,
                                            //cache: FastImage.cacheControl.cacheOnly,
                                        }}
                                    />
                                </Left>
                                <Body>
                                    <Text style={{ fontSize: 16 }}>{rowData.giftcode_event_name}</Text>
                                    <Text style={{ fontSize: 14 }}>Thời hạn: {rowData.giftcode_event_end_date}</Text>
                                    <Text style={{ fontSize: 14 }}>Còn lại: {rowData.remain_giftcode}/{rowData.total_giftcode}</Text>
                                </Body>
                                <Right>
                                    <Button transparent onPress={() => { this.showSlideAnimationDialog(rowData); }}>
                                        <Text style={{ fontSize: 14 }}>Nhận</Text>
                                    </Button>
                                </Right>
                            </TouchableOpacity>
                        </ListItem>
                    }
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
        return this.giftListNull()
    }

    render() {
        const isGiftList = this.props.appGameList.isGiftList;
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
                <Content refreshControl={this._refreshControl()} >
                    <View style={styles.giftview}>
                        {this.giftcodeDialog()}
                        {isGiftList ? (
                            this.giftListView()
                        ) : (
                                this.loading()
                            )}
                    </View>
                </Content>
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
    ModalInsideView: {
        alignItems: 'center',
        backgroundColor: "#fff",
        height: 320,
        width: '90%',
        borderRadius: 10,
        borderWidth: 0.1,
        borderColor: '#000',
    },
    TextStyle: {
        marginTop: 10,
        fontSize: 16,
        color: "#000",
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
