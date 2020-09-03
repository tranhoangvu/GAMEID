import React, { Component } from "react";
import { Text, View } from "react-native";
import HTML from "react-native-render-html";
import { fonts } from "../../utils/fonts";
export default class index extends Component {
  render() {
    return (
      <View
        style={[{
          marginHorizontal: 20,
          justifyContent: "center",
          marginVertical: 10
        },this.props.extraStyle]}
      >
        <HTML
          html={this.props.Text}
          tagsStyles={{
            resizeMode: "contain"
          }}
          baseFontStyle={{
            color: "#041A33",
            fontFamily: fonts.PoppinsMedium,
            fontSize: 14
          }}
         
        />
      </View>
    );
  }
}
