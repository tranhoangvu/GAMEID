import React, { Component } from "react";
import { View, ImageBackground } from "react-native";
import HTML from "react-native-render-html";
import truncate from 'truncate-html';
import { fonts } from "../../../utils/fonts";
import FastImage from 'react-native-fast-image';
import TextMedium from '../TextMedium/index';
import TimeAgo from "react-native-timeago";
export default class index extends Component {

  render() {
    const tagsStyles = {
      lineHeight: 15,
      maxLines: 1
    }
    const baseFontStyle = {
      fontFamily: fonts.PoppinsMedium,
      color: "#000",
      fontSize: 14,
      justifyContent: "flex-start",
    }
    return (
      <View>
        <View
          style={{ flexDirection: "row" }}
        >
          <View
            style={{
              flexDirection: "column",
              flex: 0.35,
              marginLeft: 5,
              marginTop: 5,
              height: 85
            }}
          >
            {/* <ImageBackground
              imageStyle={{ borderRadius: 5 }}
              source={this.props.source}
              style={{ flex: 1, }}
            /> */}
            <FastImage
              style={{ flex: 1, borderRadius: 5 }}
              source={{
                uri: this.props.source,
                priority: FastImage.priority.high,
                cache: FastImage.cacheControl.immutable,
              }} />
          </View>
          <View style={{ flexDirection: "column", flex: 1, marginLeft: 10 }}>
            <HTML
              html={this.props.Categories}
              tagsStyles={{
                resizeMode: "contain",
                lineHeight: 1.5,
                maxLines: 1
              }}
              baseFontStyle={{
                color: "#606369",
                fontFamily: fonts.PoppinsSemiBold,
                fontSize: 14,
                justifyContent: "flex-start",

              }}
            />
            <View style={{ flex: 1, flexDirection: 'row', marginTop: -5 }}>
              <TextMedium
                extraStyle={{
                  color: "#8D96A3",
                  fontSize: 10,
                  marginRight: 10,
                  //justifyContent: "flex-end",
                  // textTransform: "capitalize"
                }}
                Text={this.props.Author}
              />
              <TextMedium
                extraStyle={{
                  color: "#8D96A3",
                  fontSize: 10,
                  //justifyContent: "flex-end",
                  // textTransform: "capitalize"
                }}
                Text={<TimeAgo time={this.props.Time} />}
              />
            </View>
            <View style={{ flex: 1, marginTop: -10 }} >
              <HTML
                html={truncate(this.props.Title, {
                  length: 60,
                  stripTags: true
                })}
                tagsStyles={tagsStyles}
                baseFontStyle={baseFontStyle}
                numberOfLines={1}
              />
            </View>
          </View>
        </View>
      </View>
    );
  }
}
