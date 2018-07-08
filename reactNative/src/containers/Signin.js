import React, { Component } from 'react';
import { StyleSheet, Text, Image, ImageBackground } from 'react-native';
import { AccessToken, LoginButton } from 'react-native-fbsdk';
import LinearGradient from 'react-native-linear-gradient';
import { Row, Grid } from 'react-native-easy-grid';
import Config from 'react-native-config';
import firebase from 'firebase';
import Home from './Home';

const config = {
  apiKey: Config.API_KEY,
  authDomain: Config.AUTH_DOMAIN,
  databaseURL: Config.DB_URL,
  storageBucket: 'gs://whatsmyfood.appspot.com',
};

// const firebaseRef = firebase.initializeApp(config);

export default class Signin extends Component {
  static navigationOptions = {
    header: null,
  };
  componentDidMount() {
    if (!firebase.apps.length) {
      firebase.initializeApp(config);
    }
  }
  render() {
    return (
      <ImageBackground
        source={require('../assets/img/stockPic.png')}
        style={styles.backgroundImage}
      >
        <LinearGradient
          colors={['rgba(0, 0, 0, 0.72)', 'rgba(0, 0, 0, 0.11)']}
          style={styles.linearGradient}
        >
          <Grid style={styles.container}>
            <Row
              size={25}
              style={{
                marginTop: 100,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Image
                source={require('../assets/img/logo.png')}
                style={styles.logo}
                resizeMode="contain"
              />
            </Row>
            <Row size={40} style={{ marginTop: 70 }}>
              <Text style={styles.welcome}>WhatsMyFood</Text>
            </Row>
            <Row size={10}>
              <LoginButton
                style={{ width: '88%', height: 45 }}
                publishPermissions={['publish_actions']}
                onLoginFinished={(error, result) => {
                  console.log(result);
                  if (error) {
                    alert('Login failed with error: ' + result.error);
                  } else if (result.isCancelled) {
                    alert('Login was cancelled');
                  } else {
                    AccessToken.getCurrentAccessToken().then(
                      accessTokenData => {
                        const credential = firebase.auth.FacebookAuthProvider.credential(
                          accessTokenData.accessToken,
                        );
                        firebase
                          .auth()
                          .signInWithCredential(credential)
                          .then(
                            result => {
                              console.log({
                                result: result,
                                credential: credential,
                              });
                              this.props.navigation.navigate('Home');
                            },
                            error => {
                              // Promise was rejected
                              console.log(error);
                            },
                          );
                      },
                      error => {
                        console.log('Some error occured: ' + error);
                      },
                    );
                  }
                }}
                onLogoutFinished={() => {
                  // delete id from Firebase ?
                  alert('User logged out');
                }}
              />
            </Row>
            <Row size={15}>
              <Text style={{ color: 'white' }}>
                By signing up, I agree with WhatsMyFood’s{'\n'}
                <Text style={{ color: 'red' }}>
                  Terms of Service
                  <Text style={{ color: 'white' }}> and </Text>Privacy policy.
                </Text>
              </Text>
            </Row>
          </Grid>
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
    zIndex: 1,
  },
  container: {
    zIndex: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcome: {
    fontSize: 30,
    color: 'white',
  },
  logo: {
    opacity: 1,
    height: 180,
  },
});
