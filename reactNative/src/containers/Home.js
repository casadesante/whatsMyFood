import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button
} from 'react-native';

export default class Home extends Component {
    //if restaurant list is empty, show add button else show the list of restaurants
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Add Restaurant !
        </Text>
          <Button
              onPress={() => this.props.navigation.navigate('Newentry')}
              title="Add"
              color="#841584"
          />
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
