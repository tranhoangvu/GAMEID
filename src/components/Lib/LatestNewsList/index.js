import React, { Component } from "react";
import { Text, View, ListView,TouchableOpacity } from "react-native";
import ListViews from "../../Components/ListView/index";
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
    return fetch("http://itechnotion.in/wp-news/wp-json/wp/v2/posts?=100")
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

  OpenSecondActivity(rowData) {
    onPressed=this.props.onPressed({
      ListViewClickItemHolder: rowData
    });
  }
  render() {
    return (
      <View
        cornerRadius={5}
        cardElevation={2}
        cardMaxElevation={2}
        style={{ marginTop: 15, marginBottom: 50 }}
     
      >
        <ListView
          showsVerticalScrollIndicator={false}
          dataSource={this.state.dataSource}
          renderRow={rowData => (
            <TouchableOpacity
              style={{flexDirection: "row", flex: 1 }}
              // onPress={this.OpenSecondActivity.bind(
              //   this,
              //   rowData.id,
              //   rowData.title.rendered,
              //   rowData.featured_image_link
              // )}
              onPress={this.props.onPressed}
            >
              <ListViews
                Categories={rowData.category_arr[0].name}
                Title={rowData.title.rendered}
                Time={rowData.date}
                source={{ uri: rowData.featured_image_link }}
              />
            </TouchableOpacity>
          )}
        />
      </View>
    );
  }
}
