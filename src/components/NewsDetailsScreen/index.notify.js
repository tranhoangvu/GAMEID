import React, { Component } from "react";
import {
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Share,
  StatusBar,
  AsyncStorage,
  ActivityIndicator,
  Dimensions,
  Linking,
  RefreshControl,
  StyleSheet
} from "react-native";
import { Icon } from "native-base";
import { fonts } from "../../utils/fonts";
import Text from "../Lib/TextSemiBold/index";
import TimeAgo from "react-native-timeago";
// import Icon from "react-native-vector-icons/Ionicons";
import HTML from "react-native-render-html";
import FastImage from 'react-native-fast-image';
import axios from 'axios';

let moment = require('moment'); //load moment module to set local language
require('moment/locale/vi'); //for import moment local language file during the application build
moment.locale('vi');//set moment local language to zh-cn

const container = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1,
  },
  marginHorizontal: {
    marginHorizontal: 15
  },
  indicator: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    color: '#041A33',
    height: 80
  }
})

export default class index extends Component {
  static navigationOptions = {
    header: null
  };
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      dataSource: "",
      status: "No Page Loaded",
      backButtonEnabled: false,
      forwardButtonEnabled: false,
      scalesPageToFit: true,
      url: "",
      wpid: this.props.navigation.state.params.postid || 0,
      isLiked: "",
      refreshing: false,
      isFocused: false
    };
  }
  fetchDetails = () => {
    console.log("fetchDetails: " + this.props.navigation.state.params.postid);
    this.setState({
      wpid: this.props.navigation.state.params.postid
    });
    // console.log(this.props.navigation.state.params.item.id);
    return axios.get("https://news.gameid.vn/" +
      "wp-json/wp/v2/posts/" +
      this.state.wpid + "?_embed"
    )
      .then(res => {
        this.setState({
          isLoading: false,
          dataSource: res.data,
          url: res.data.link,
          isFocused: true
        });
      })
      .catch(error => {
        console.error(error);
      });
    // return fetch(
    //   "https://news.gameid.vn/" +
    //   "wp-json/wp/v2/posts/" +
    //   this.props.navigation.state.params.item.id + "?_embed"
    // )
    //   .then(response => response.json())
    //   .then(responseJson => {
    //     // console.log(responseJson);
    //     // console.log(responseJson.title.rendered);
    //     // console.log(responseJson.link);
    //     this.setState({
    //       isLoading: false,
    //       dataSource: responseJson,
    //       url: responseJson.link
    //     });
    //     //console.log(this.state.wpid);
    //   })
    //   .catch(error => {
    //     console.error(error);
    //   });
  };
  _storeData = async () => {
    try {
      var newArr = [];
      newArr.push(this.state.dataSource.id);
      console.log("Set");
      console.log(newArr);
      await AsyncStorage.setItem("favorites", JSON.stringify(newArr));
    } catch (error) {
      // Error saving data
    }
  };
  async _updateList() {
    const response = await AsyncStorage.getItem("favorites");
    const listOfLikes = (await JSON.parse(response)) || [];
    console.log("_updateList");
    this.setState({
      favorites: listOfLikes
    });
    // console.log("-------");
    // console.log(this.state.favorites);
    if (listOfLikes.includes(this.state.dataSource.id)) {
      this.setState({ isLiked: true });
    } else {
      this.setState({ isLiked: false });
    }
    // console.log(this.state.isLiked);
  }
  async _addToFavorites() {
    await AsyncStorage.getItem("favorites").then(favs => {
      var id = this.state.wpid;
      // console.log(id);
      console.log("sdfdsfsfsfdsfddfdfsdfsdfsdfsdfs");
      console.log(JSON.parse(favs));

      var array = JSON.parse(favs);
      if (array == null) {
        this._storeData();
        this.setState({ isLiked: true });
      } else {
        console.log(array);
        console.log("-------");
        // console.log(array.indexOf(id));
        var index = array.indexOf(id);
        if (index > -1) {
          array.splice(index, 1);
          this.setState({ isLiked: false });
        } else {
          array.push(id);
          this.setState({ isLiked: true });
        }
        // console.log("-------");
        // console.log(array);
        // console.log(this.state.isLiked);
        return AsyncStorage.setItem("favorites", JSON.stringify(array));
      }
    });
  }
  _onPressHeartButton = id => {
    // add to favorites
    this._addToFavorites();
  };
  componentDidMount() {
    this.subs = [
      this.props.navigation.addListener("didFocus", () => this.fetchDetails().then(() => {
        this.setState({ isFocused: true });
      })),
      this.props.navigation.addListener("willBlur", () => this.setState({ isFocused: false }))
    ];
    // console.log(this.props.navigation.state.params.item);
    // setTimeout(() => {
    //   this.setState({ isLoading: false })
    // }, 1000)
    this.fetchDetails();
    // this._updateList();
    // AdMobInterstitial.setAdUnitID('ca-app-pub-7770856719889795/1700809691');
    // AdMobInterstitial.showAd().catch((e) => {
    //   console.log(e)
    // });
    //  AdMobInterstitial.requestAd().then(() => AdMobInterstitial.showAd());
  }

  componentWillUnmount() {
    console.log("detail componentWillUnmount");
    this.subs.forEach(sub => sub.remove());
  }

  _onRefresh = () => {
    this.setState({ refreshing: true });
    this.fetchDetails().then(() => {
      this.setState({ refreshing: false });
    });
    this._updateList().then(() => {
      this.setState({ refreshing: false });
    });
  };
  _showResult(result) {
    console.log(result);
  }
  _shareTextWithTitle = () => {
    Share.share(
      {
        message: this.state.url
      },
      {
        dialogTitle: "This is share dialog title",
        excludedActivityTypes: [
          "com.apple.UIKit.activity.PostToTwitter",
          "com.apple.uikit.activity.mail"
        ],
        tintColor: "green"
      }
    )
      .then(this._showResult)
      .catch(err => console.log(err));
  };
  render() {
    console.log("isFocused: " + this.state.isFocused);
    if (!this.state.isFocused) {
      return (
        <View style={container.container}>
          <ActivityIndicator
            animating={true}
            style={container.indicator}
            size="large"
          />
        </View>
      );
    }
    return (
      <View style={container.container}>
        <StatusBar hidden={true} />
        <ScrollView
          style={{ flex: 1 }}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh.bind(this)}
            />
          }
        >
          <View style={{ height: 250 }}>
            <FastImage
              style={{ flex: 1 }}
              source={{
                uri: this.state.dataSource.featured_media != 0 ? this.state.dataSource._embedded["wp:featuredmedia"]["0"].source_url : require("../../assets/images/img_not_found.jpg"),
                priority: FastImage.priority.high,
                cache: FastImage.cacheControl.immutable,
              }} >
              {/* <ImageBackground
              // uri:this.props.navigation.state.params.item.featured_media !=0 ? this.props.navigation.state.params.item._embedded["wp:featuredmedia"]["0"].source_url : " "
              source={
                this.props.navigation.state.params.item.featured_media != 0
                  ? {
                    uri: this.props.navigation.state.params.item._embedded[
                      "wp:featuredmedia"
                    ]["0"].source_url
                  }
                  : require("../../assets/images/img_not_found.jpg")
              }
              style={{ flex: 1 }}
            > */}
              <TouchableOpacity
                onPress={() => this.props.navigation.goBack()}
              >
                <Image
                  source={require("../../assets/images/arrowBack.png")}
                  style={{
                    width: 20,
                    height: 20,
                    marginHorizontal: 10,
                    marginVertical: 15
                    // tintColor: "#787D81"
                  }}
                />
              </TouchableOpacity>
            </FastImage>
            {/* </ImageBackground> */}
          </View>

          <View style={container.marginHorizontal}>
            <View
              style={{ flex: 1, flexDirection: "column", marginVertical: 10 }}
            >
              {/* <Text
                extraStyle={{ fontSize: 18, color: "#041A33" }}
                Text={dataSource.title.rendered}
              /> */}
              <HTML
                html={this.state.dataSource.title.rendered}
                tagsStyles={{
                  resizeMode: "contain"
                }}
                baseFontStyle={{
                  color: "#041A33",
                  fontFamily: fonts.PoppinsSemiBold,
                  fontSize: 18
                }}
              />
              <View
                style={{
                  flexDirection: "row",
                  marginTop: 12,
                  justifyContent: "center"
                }}
              >
                <View style={{ flexDirection: "column", flex: 0.7 }}>
                  <View style={{ marginRight: 5 }}>
                    <HTML
                      html={
                        this.state.dataSource._embedded[
                        "wp:term"
                        ][0][0]["name"]
                      }
                      tagsStyles={{
                        resizeMode: "contain"
                      }}
                      baseFontStyle={{
                        color: "#6E7886",
                        fontFamily: fonts.PoppinsSemiBold,
                        fontSize: 14,
                        justifyContent: "center"
                      }}
                    />
                  </View>
                  <View style={{ flex: 1, flexDirection: 'row' }}>
                    <Text
                      extraStyle={{
                        color: "#B5B9BD",
                        fontSize: 11,
                        justifyContent: "center",
                        // marginTop: 2
                        marginRight: 5
                      }}
                      Text={this.state.dataSource._embedded["author"]["0"].name}
                    />
                    <Text
                      extraStyle={{
                        color: "#B5B9BD",
                        fontSize: 11,
                        justifyContent: "center",
                        // marginTop: 2
                      }}
                      Text={
                        <TimeAgo
                          time={this.state.dataSource.date}
                        />
                      }
                    />
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    flex: 0.3,
                    justifyContent: "center"
                  }}
                >
                  <TouchableOpacity
                    onPress={this._onPressHeartButton.bind(this.state.wpid)}
                  >
                    <View>
                      {this.state.isLiked ? (
                        <Icon
                          name="bookmark"
                          size={22}
                          style={{
                            color: "#0099FA",
                            marginRight: 15,
                            alignSelf: "flex-end"
                          }}
                        />
                      ) : (
                          <Icon
                            name="bookmark"
                            size={22}
                            style={{
                              color: "#808080",
                              marginRight: 15,
                              alignSelf: "flex-end"
                            }}
                          />
                        )}
                    </View>
                  </TouchableOpacity>
                  <TouchableWithoutFeedback
                    onPress={this._shareTextWithTitle}
                  >
                    <View>
                      <Icon
                        name="ios-share-alt"
                        size={22}
                        style={{
                          color: "#808080",
                          marginRight: 5,
                          alignSelf: "flex-end"
                        }}
                      />
                    </View>
                  </TouchableWithoutFeedback>
                </View>
              </View>
            </View>
            <HTML
              //set Video width
              alterChildren={node => {
                if (node.name === "iframe") {
                  delete node.attribs.width;
                  delete node.attribs.height;
                }
                return node.children;
              }}
              html={this.state.dataSource.content.rendered}
              staticContentMaxWidth={Dimensions.get("window").width}
              imagesMaxWidth={Dimensions.get("window").width - 30}
              onLinkPress={(evt, href) => {
                Linking.openURL(href);
              }}
              tagsStyles={{
                resizeMode: "contain"
              }}
              baseFontStyle={{
                color: "#041A33",
                fontFamily: fonts.PoppinsRegular
              }}
              ignoredStyles={["height", "width"]}
            />
          </View>
        </ScrollView>
      </View >
    );
  }
}
