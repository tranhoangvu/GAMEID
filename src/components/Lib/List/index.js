import React, { Component } from "react";
import {View, TouchableOpacity } from "react-native";
//import HTML from "react-native-render-html";
//import { fonts } from "../../utils/fonts";
import Text from "../../Components/HTMLText/index";
export default class index extends Component {
  render() {
    return (
      <View
        style={{
          borderRadius: 25,
          flex: 1,
          marginVertical: 6,
          marginHorizontal: 15,
          shadowColor: "#95B2D2",
          shadowOffset: {
            width: 0,
            height: 0.3
          },
          shadowRadius: 5,
          backgroundColor: "#fff",
          elevation: 2,
          shadowOpacity: 0.8
        }}
      >
        <TouchableOpacity style={{ flex: 1 }} onPress={this.props.onPress}>        
            <Text Text={this.props.Title}/>
        </TouchableOpacity>
      </View>
    );
  }
}
