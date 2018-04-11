import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  StatusBar,
  TextInput
} from "react-native";
import { Row, Grid } from "react-native-easy-grid";
import Icon from "react-native-vector-icons/MaterialIcons";

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
        <Grid>
          <Row
            style={{
              backgroundColor: "rgb(255, 68, 68)",
              height: 44
            }}
          >
            <Text style={styles.addText}>Add restaurant</Text>
          </Row>
          <View style={styles.searchSection}>
            <Icon
              name="restaurant"
              style={styles.searchIcon}
              size={23}
              color="rgb(105, 105, 105)"
            />
            <TextInput style={styles.input} placeholder="Restaurant name" />
          </View>
        </Grid>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  searchSection: {
    flexDirection: "row",
    borderBottomColor: "rgb(188, 187, 193)",
    borderBottomWidth: 1
  },
  searchIcon: {
    padding: 15
  },
  input: {
    flex: 1,
    backgroundColor: "white",
    color: "#424242",
    fontSize: 20
  },
  addText: {
    color: "white",
    fontSize: 33,
    fontWeight: "bold",
    letterSpacing: 0.5,
    marginLeft: 15
  },
  container: {
    flex: 1,
    // justifyContent: "center",
    // alignItems: "center",
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
