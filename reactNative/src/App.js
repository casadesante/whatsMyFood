import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  NavigatorIOS,
  StatusBar
} from 'react-native';
import Signin from './containers/Signin';
import { isSignedIn } from './lib/Auth';

var styles = StyleSheet.create({
  container:{
    flex: 1,
  },
});


export default class App extends Component {

  componentDidMount() {
    if(isSignedIn()) {
      console.log('not logged innnn');
    }
    else {
      console.log('not logged in');
    }
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
