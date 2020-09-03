import React, { Component } from "react";
import { Text, View, Image, TouchableOpacity, Platform } from "react-native";
import style from "./style";
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
            {/* <Image
              source={require("../../image/search.png")}
              style={[
                {
                  height: 17,
                  width: 17,
                  marginLeft: 15,
                  tintColor: "#787D81"
                },
                this.props.iconStyle
              ]}
            /> */}
            <Icon name="ios-search" color="#787D81" size={20} style={[
                {
                  marginLeft: 15,
                },
                this.props.iconStyle
              ]}/>
          </TouchableOpacity>
        </View>
        <View style={{ flex: 0.9, alignSelf: "center" }}>
          <Text
            style={[
              {
                color: "#787D81",
                alignSelf: "center",
                fontSize: 15,
                justifyContent: "center",
                fontWeight: "500"
              },
              this.props.textStyle
            ]}
          >
            <Text style={{ color: "#4A84FC" }}>W</Text>
            <Text style={{ color: "#E64D37" }}>e</Text>
            <Text style={{ color: "#FAC700" }}>b</Text>
            <Text style={{ color: "#508DFC" }}>i</Text>
            <Text style={{ color: "#4AB24D" }}>l</Text>
            <Text style={{ color: "#E64D37" }}>e</Text>
            <Text style={{ color: "#606369" }}> News</Text>
          </Text>
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
