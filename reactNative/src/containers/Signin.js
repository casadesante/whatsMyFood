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
  Button
} from 'react-native';

import FBSDK, { LoginManager, AccessToken, LoginButton } from 'react-native-fbsdk';
import firebase from 'firebase';
import Home from './Home';
import Config from 'react-native-config';

const config = {
  apiKey: Config.API_KEY,
  authDomain: Config.AUTH_DOMAIN,
  databaseURL: Config.DB_URL
};

const firebaseRef = firebase.initializeApp(config);

export default class Signin extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Welcome to whatsMyFood
        </Text>
        <LoginButton
          publishPermissions={["publish_actions"]}
          onLoginFinished={
            (error, result) => {
              console.log(result);
              if (error) {
                alert("Login failed with error: " + result.error);
              } else if (result.isCancelled) {
                alert("Login was cancelled");
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
                       console.log(error);
                    })
                 }, (error => {
                    console.log('Some error occured: ' + error);
                 }))
              }
            }
          }
          onLogoutFinished={() => alert("User logged out")}/>
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
    backgroundColor: '#4267B2',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    marginTop: 10,
    alignSelf: 'stretch',
    justifyContent: 'center'
  }
});
