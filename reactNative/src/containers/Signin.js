/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
} from 'react-native';

import FBSDK, { LoginManager, AccessToken } from 'react-native-fbsdk';
import firebase from 'firebase';
import Home from './Home';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

var config = {
  apiKey: 'AIzaSyCaWFdW61qcpy-LAtdYJnSlJEuiqgkPegs',
  authDomain: 'whatsmyfood.firebaseapp.com/',
  databaseURL: 'https://whatsmyfood.firebaseio.com/'
}

const firebaseRef = firebase.initializeApp(config)

export default class Signin extends Component {
  constructor(props) {
    super(props);
  }

  _fbAuth = () => {
    LoginManager.logInWithReadPermissions(['public_profile', 'email']).then(
       (result) => {
          if (result.isCancelled) {
             alert('Login cancelled');
          } else {

             AccessToken.getCurrentAccessToken().then((accessTokenData) => {
                const credential = firebase.auth.FacebookAuthProvider.credential(accessTokenData.accessToken)
                firebase.auth().signInWithCredential(credential).then((result) => {
                   console.log({result: result, credential: credential});
                   this.props.navigator.push({
                      component: Home,
                      title: 'Home page'
                    });
                }, (error) => {
                   // Promise was rejected
                   console.log(error)
                })
             }, (error => {
                console.log('Some error occured: ' + error)
             }))
          }
       },
       function(error) {
          alert('Login fail with error: ' + error);
       }
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Welcome to whatsMyFood
        </Text>
        <TouchableHighlight
          style={styles.button}
          underlayColor='white'
          onPress={this._fbAuth.bind(this)}>
            <Text style={styles.buttonText}> Login </Text>
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
  button: {
    height: 45,
    flexDirection: 'row',
    backgroundColor: 'white',
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    marginTop: 10,
    alignSelf: 'stretch',
    justifyContent: 'center'
  },
  buttonText: {
    fontSize: 18,
    color: '#111',
    alignSelf: 'center'
  },
});
