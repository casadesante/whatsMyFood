import React, { Component } from "react";
import { StyleSheet, Text } from "react-native";
import { Row } from "react-native-easy-grid";

export default class Header extends Component {
  render() {
    return (
      <Row
        style={{
          backgroundColor: "rgb(255, 68, 68)",
          height: 44
        }}
      >
        <Text style={styles.addText}>{this.props.text}</Text>
      </Row>
    );
  }
}

const styles = StyleSheet.create({
  addText: {
    color: "white",
    fontSize: 33,
    fontWeight: "bold",
    letterSpacing: 0.5,
    marginLeft: 15
  }
});
