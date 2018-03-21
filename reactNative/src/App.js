import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  NavigatorIOS,
  StatusBar
} from 'react-native';
import firebase from 'firebase';
import Signin from './containers/Signin';

var styles = StyleSheet.create({
  container:{
    flex: 1,
  },
});


export default class App extends Component {

  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if(user) {
        console.log('logged in');
        console.log(user);
      } else {
        console.log('not logged in');
      }
    });
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
