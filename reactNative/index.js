import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  NavigatorIOS,
  StatusBar
} from 'react-native';
import Signin from './src/containers/Signin';

var styles = StyleSheet.create({
  container:{
    flex: 1,
  },
});


export default class whatsMyFood extends Component {
  componentDidMount() {
    StatusBar.setHidden(false);
  }

  render() {
    return (
      <NavigatorIOS
        initialRoute={{
          component: Signin,
          title: 'App\'s first page.',
          navigationBarHidden: true
       }}
        style={styles.container}
      />

    );
  }
}


AppRegistry.registerComponent('whatsMyFood', () => whatsMyFood);
