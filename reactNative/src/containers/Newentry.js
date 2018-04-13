import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Button,
  StatusBar,
  TouchableOpacity
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { Row, Grid } from "react-native-easy-grid";

import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";

import Header from "../componenets/Header";
import Textbox from "../componenets/Textbox";

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

  onPress = () => {
    alert("on pressed");
  };

  render() {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <Grid>
          <Header text="Add restaurant" />
          <Textbox icon="restaurant" placeholder="Restaurant name" />
          <View style={styles.optionalText}>
            <Text style={styles.optional}>Optional</Text>
          </View>
          <Textbox icon="location" placeholder="Restaurant location" />
          <Row>
            <View>
              <Image
                source={require("../assets/img/tgif.png")}
                resizeMode="cover"
                style={{
                  marginTop: 40,
                  marginLeft: 40,
                  height: 200,
                  width: 300,
                  borderRadius: 10
                }}
              />
            </View>
            {/*<View style={{ flex: 1, padding: 40 }}>*/}
            {/*<TouchableOpacity onPress={this.onPress}>*/}
            {/*<LinearGradient*/}
            {/*style={{ height: 200, borderRadius: 10 }}*/}
            {/*colors={["rgb(255, 152, 99)", "rgb(253, 89, 89)"]}*/}
            {/*>*/}
            {/*<SimpleLineIcons*/}
            {/*style={{*/}
            {/*paddingTop: 70,*/}
            {/*alignSelf: "center"*/}
            {/*}}*/}
            {/*name="camera"*/}
            {/*size={40}*/}
            {/*color="white"*/}
            {/*/>*/}
            {/*<Text style={{ color: "white", textAlign: "center" }}>*/}
            {/*Add photo*/}
            {/*</Text>*/}
            {/*</LinearGradient>*/}
            {/*</TouchableOpacity>*/}
            {/*</View>*/}
          </Row>
        </Grid>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  optionalText: {
    padding: 20,
    backgroundColor: "rgb(249, 249, 249)"
  },
  optional: {
    color: "rgb(105, 105, 105)",
    fontSize: 20,
    letterSpacing: 0.5
  },
  container: {
    flex: 1,
    backgroundColor: "white"
  }
});
