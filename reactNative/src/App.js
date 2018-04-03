import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  NavigatorIOS,
  StatusBar
} from 'react-native';
import { createRootNavigator } from './Routes';
import Signin from './containers/Signin';
import { isSignedIn } from './lib/Auth';
import firebase from 'firebase';

var styles = StyleSheet.create({
  container:{
    flex: 1,
  },
});


export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      signedIn: true
    };
  }

  componentDidMount() {
    // isSignedIn()
    // .then((res) => {
    //   this.setState({signedIn: res});
    // })
  }


  render() {
    const signedIn = this.state.signedIn;
    console.log(signedIn);
    const Layout = createRootNavigator(signedIn);

    return (
      <Layout />
    );
  }
}
