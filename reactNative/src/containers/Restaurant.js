import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default class Restaurant extends Component {
  render() {
    const { navigation } = this.props;
    const restaurantId = navigation.getParam('id');
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Restaurant page !{restaurantId}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
