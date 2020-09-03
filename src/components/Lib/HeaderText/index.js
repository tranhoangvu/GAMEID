import React, { Component } from "react";
import { View, Image, TouchableOpacity, Platform } from "react-native";
import style from "./style";
import Text from "../../Components/TextMedium/index";
import HTML from "react-native-render-html";
import { fonts } from "../../utils/fonts";
import Icon from "react-native-vector-icons/Ionicons";
export default class index extends Component {
  render() {
    return (
      <View
        style={[
          style.mainView,
          this.props.extraStyle,
          { marginTop: Platform.OS == "ios" ? 20 : 0 }
        ]}
      >
        <View style={{ flex: 0.1, justifyContent: "center" }}>
          <TouchableOpacity onPress={this.props.onPressSearch}>
            <Image
              source={this.props.source}
              style={[
                {
                  height: 17,
                  width: 17,
                  marginLeft: 15,
                  tintColor: "#787D81"
                },
                this.props.iconStyle
              ]}
            />
            {/* <Icon name="ios-search" color="#787D81" size={20} style={[
                {
                  marginLeft: 15,
                },
                this.props.iconStyle
              ]}/> */}
          </TouchableOpacity>
        </View>
        <View style={{ flex: 0.9, alignSelf: "center" }}>
          {/* <Text
          Text={this.props.Title}
            extraStyle={[
              {
                color: "#787D81",
                alignSelf: "center",
                fontSize: 15,
                justifyContent: "center",
                fontWeight: "500"
              },
              this.props.textStyle
            ]}
          /> */}
          <View style={{alignSelf:'center'}}>
          <HTML
            html={this.props.Title}
            tagsStyles={{
              resizeMode: "contain"
            }}
            baseFontStyle={{
              color: "#787D81",
              fontFamily: fonts.PoppinsMedium,
              fontSize: 15,
              justifyContent: "center",
              fontWeight: "500",
          
            }}
          />
          </View>
        </View>
        <View style={{ flex: 0.1, alignSelf: "center" }}>
          {/* <TouchableOpacity onPress={this.props.onPressRight}>
        <Image
          source={this.props.sourceRight}
          color="#fff"
          style={{
            height: 25,
            width: 25,
            marginRight: 10,
            alignSelf: "center",
            tintColor: "#fff"
          }}
        />
      </TouchableOpacity> */}
        </View>
      </View>
    );
  }
}
