import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
} from 'react-native';

export default class Home extends Component {
  static navigationOptions = {
    title: 'Home',
    headerStyle: {
      backgroundColor: 'white',
    },
  };
  //if restaurant list is empty, show add button else show the list of restaurants
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Add your first restaurant and dish !</Text>
        <TouchableHighlight
          onPress={() => this.props.navigation.navigate('Newentry')}
        >
          <Image
            source={require('../assets/img/add.png')}
            style={styles.logo}
          />
        </TouchableHighlight>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  welcome: {
    fontSize: 40,
    textAlign: 'center',
    margin: 10,
    padding: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  logo: {
    marginTop: '20%',
    height: 100,
    resizeMode: 'contain',
  },
});
