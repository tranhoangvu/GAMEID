import React, { Component } from "react";
import { View, TouchableOpacity } from "react-native";
import TimeAgo from "react-native-timeago";
import Icon from "react-native-vector-icons/Ionicons";
import TextMedium from '../TextMedium/index';
export default class index extends Component {
  render() {
    return (
      <View
      >
        <View
          style={{
            justifyContent: "flex-end",
            flexDirection: "row",
            // marginVertical: 10,
          }}
        >
          {/* <View style={{ flex: 0.2 }}>
            <TextMedium
              extraStyle={{
                color: "#8D96A3",
                fontSize: 10,
                //justifyContent: "flex-end",
                // textTransform: "capitalize"
              }}
              Text={this.props.Author}
            />
          </View>
          <View style={{ flex: 0.85 }}>
            <TextMedium
              extraStyle={{
                color: "#8D96A3",
                fontSize: 10,
                //justifyContent: "flex-end",
                // textTransform: "capitalize"
              }}
              Text={<TimeAgo time={this.props.Time} />}
            />
          </View> */}
          <View style={{ flex: 1, flexDirection: "row" }}>
            <View style={{ flex: 1, justifyContent: "center" }}>
              <Icon
                name="ios-share-alt"
                size={18}
                style={{
                  color: "#808080",
                  // marginRight: 5,
                  alignSelf: "flex-end"
                }}
              />
            </View>
          </View>
        </View>
      </View>

    );
  }
}
