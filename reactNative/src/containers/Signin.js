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
  Image,
  ImageBackground,
  Button
} from 'react-native';

import FBSDK, { LoginManager, AccessToken, LoginButton } from 'react-native-fbsdk';
import LinearGradient from 'react-native-linear-gradient';
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
           <ImageBackground source={require('../assets/img/stockPic.png')} style={styles.backgroundImage}>
           <LinearGradient colors={['rgb(255,68,68)', 'rgba(95, 2, 2, 0.66)']} style={styles.linearGradient}>
             <View style={styles.container}>
               <Image
                 source={require('../assets/img/logo.png')}
                 style={styles.logo}
                 resizeMode="contain"
                />
              <Text style={styles.welcome}>
                WhatsMyFood
              </Text>
              <LoginButton
                style={styles.fbButton}
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
             </LinearGradient>
          </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  linearGradient: {
    flex: 1,
    zIndex: 2,
  },
  backgroundImage: {
    flex: 1,
    height: null,
    width: null,
    zIndex: 1
  },
  container: {
    flex: 1,
    zIndex: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcome: {
    fontSize: 30,
    textAlign: 'center',
    margin: 10,
    color: 'white'
  },
  logo: {
    opacity: 1,
    height: 180,
    top: 100,
    position: 'absolute'
  }
});
