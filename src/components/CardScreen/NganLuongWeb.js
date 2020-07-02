import React, { Component } from 'react';
import { AppRegistry, View, StatusBar, StyleSheet, Dimensions, Linking, DeviceEventEmitter } from "react-native";
import WebView from 'react-native-webview';
import { Container, Header, Title, Button, Icon, Content, Right, Left, Body, Card, CardItem, Text, Toast } from 'native-base';
import { connect } from "react-redux";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    horizontal: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10
    },
})

class NganLuongWeb extends Component {

    constructor() {
        super();
        this.state = {
            showToast: false,
            width: Dimensions.get('window').width,
            height: Dimensions.get('window').height
        }
    }

    componentDidMount() {
        Toast.show({
            text: "Mua thẻ qua hệ thống Ngân Lượng!",
            duration: 3000
        });
        this._orientationSubscription = DeviceEventEmitter.addListener(
            'namedOrientationDidChange', this._onOrientationChange,
        );
    }

    componentWillUnmount() {
        this._orientationSubscription.remove();
    }

    _onOrientationChange = (orientation: Object) => {
        this.setState({
            width: Dimensions.get('window').width,
            height: Dimensions.get('window').height
        })
    }

    render() {
        const { vtcapp_card_url } = this.props.myFirebaseConfig.firebaseConfig;
        return (
            // <Container>
            //     <Header hasTabs>
            //         <Left>
            //             <Button transparent onPress={() => this.props.navigation.goBack()}>
            //                 <Icon name="arrow-back" />
            //             </Button>
            //         </Left>
            //         <Body>
            //             <Title>Mua thẻ</Title>
            //         </Body>
            //         <Right />
            //     </Header>
            <Content contentContainerStyle={{ flex: 1 }}>
                {/* <View style={[styles.horizontal]}>
                        <Text>Phương thức thanh toán này được mua qua hệ thống Ngân Lượng, sẽ không có lịch sử giao dịch của Lazagame</Text>
                    </View> */}
                <View style={[styles.container, { width: this.state.width, height: this.state.height }]}>
                    <WebView
                        source={{ uri: vtcapp_card_url }}
                        injectedJavaScript="window.postMessage = String(Object.hasOwnProperty).replace('hasOwnProperty', 'postMessage');"
                        style={{ flex: 1 }}
                        scalesPageToFit={true}
                        javaScriptEnabled={true}
                        renderLoading={this.renderLoading}
                        startInLoadingState={true}
                        automaticallyAdjustContentInsets={true}
                        cacheEnabled={true}
                    />
                </View>
            </Content>
            // </Container>
        );
    }
}

function mapStateToProps(state) {
    return {
        myFirebaseConfig: state.firebase
    };
}
export default connect(mapStateToProps)(NganLuongWeb);
