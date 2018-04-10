import React, { Component } from "react";
import { StyleSheet, Text, View, Button, StatusBar } from "react-native";

export default class Newentry extends Component {
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    return {
      headerStyle: {
        backgroundColor: "rgb(255, 68, 68)"
      },
      headerTitleStyle: {
        color: "white"
      },
      headerRight: (
        <Button color="white" title="Save" onPress={() => params.save()} />
      )
    };
  };

  saveDetails() {
    alert("Save Details");
  }

  componentDidMount() {
    this.props.navigation.setParams({ save: this.saveDetails });
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <Text style={styles.welcome}>New entry !</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white"
  },
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 10
  },
  instructions: {
    textAlign: "center",
    color: "#333333",
    marginBottom: 5
  },
  headerSave: {
    color: "white",
    marginLeft: 5
  }
});
