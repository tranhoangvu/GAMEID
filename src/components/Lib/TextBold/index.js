import React, { Component } from "react";
import { Text, View } from "react-native";
import style from "./style";
export default class index extends Component {
  render() {
    return (
      <View>
        <Text
          style={[style.textStyle, this.props.extraStyle]}
          numberOfLines={this.props.numberOfLines}
        >
          {this.props.Text}
        </Text>
      </View>
    );
  }
}
