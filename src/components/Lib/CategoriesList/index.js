import React, { Component } from "react";
import { Text, View, ListView, TouchableOpacity } from "react-native";
import List from "../../Components/List/index";
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
      "http://itechnotion.in/wp-news/wp-json/wp/v2/categories?per_page=100"
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

  // OpenSecondActivity(rowData) {
  //   this.props.onPressed({
  //     ListViewClickItemHolder: rowData
  //   });
  // }
  OpenSecondActivity(rowData) {
    this.props.onPressed({ rowData });
  }
  render() {
    return (
      <View
        cornerRadius={5}
        cardElevation={2}
        cardMaxElevation={2}
        style={{ marginBottom: 50 }}
      >
        <ListView
          dataSource={this.state.dataSource}
          showsVerticalScrollIndicator={false}
          renderRow={rowData => (
            <List
              Title={rowData.name}
              onPress={this.OpenSecondActivity.bind(this, rowData.id)}
            />
          )}
        />
      </View>
    );
  }
}
