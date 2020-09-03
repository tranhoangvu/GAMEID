import React, { Component } from "react";
import {
  View,
  ListView,
  ImageBackground,
  TouchableOpacity
} from "react-native";
import TextSemiBold from "../../Components/TextSemiBold";
import styles from "./style";

var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

export default class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      dataSource: ds
    };
  }
  componentDidMount() {
    return fetch(
      "http://itechnotion.in/wp-news/wp-json/wp/v2/posts?categories=39"
    )
      .then(response => response.json())
      .then(responseJson => {
        console.log("response:" + responseJson);
        this.setState(
          {
            isLoading: false,
            dataSource: ds.cloneWithRows(responseJson)
          },
          function() {}
        );
      })
      .catch(error => {
        console.error(error);
      });
  }
  ListViewItemSeparatorLine = () => {
    return <View style={styles.line} />;
  };
  OpenSecondActivity(rowData) {
    onPressed = this.props.onPressed({
      rowData
    });
  }

  render() {
    return (
      <View>
        <ListView
          dataSource={this.state.dataSource}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          renderRow={rowData => (
            <View style={styles.itemContainer}>
              <TouchableOpacity
                style={{ flex: 1, flexDirection: "column" }}
                onPress={this.OpenSecondActivity.bind(
                  this,
                  rowData.id,
                  rowData.title.rendered,
                  rowData.featured_image_link
                )}
                //onPress={this.props.onPressed}
              >
                <ImageBackground
                  source={{ uri: rowData.featured_image_link }}
                  style={styles.imageWrapper}
                  imageStyle={{ borderRadius: 10 }}
                />
                <View style={{ flex: 1, justifyContent: "flex-start" }}>
                  <TextSemiBold
                    numberOfLines={2}
                    extraStyle={styles.ListContentText}
                    Text={rowData.title.rendered}
                  />
                </View>
              </TouchableOpacity>
            </View>
          )}
        />
      </View>
    );
  }
}
