import React, { Component } from 'react';
import { StyleSheet, Text, Image, ImageBackground, View } from 'react-native';
import { AccessToken, LoginButton } from 'react-native-fbsdk';
import LinearGradient from 'react-native-linear-gradient';
import Config from 'react-native-config';
import firebase from 'firebase';
import PropTypes from 'prop-types';
import { widthPercentageToDP, heightPercentageToDP } from '../lib/Responsive';
import RF from '../../node_modules/react-native-responsive-fontsize';

const config = {
  apiKey: Config.API_KEY,
  authDomain: Config.AUTH_DOMAIN,
  databaseURL: Config.DB_URL,
  storageBucket: 'gs://whatsmyfood.appspot.com',
};

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
    width: widthPercentageToDP('100%'),
    marginTop: heightPercentageToDP('15.5%'),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  appTitle: {
    color: 'white',
    fontSize: RF(4),
    marginTop: heightPercentageToDP('4%'),
  },
  logo: {
    opacity: 1,
    width: widthPercentageToDP('47.5%'),
    height: widthPercentageToDP('47.5%'),
  },
  loginButton: {
    width: widthPercentageToDP('89%'),
    height: heightPercentageToDP('6.5%'),
    marginTop: heightPercentageToDP('26%'),
  },
});

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
    const { navigation } = this.props;
    return (
      <ImageBackground
        source={require('../assets/img/stockPic.png')}
        style={styles.backgroundImage}
      >
        <LinearGradient
          colors={['rgba(0, 0, 0, 0.90)', 'rgba(0, 0, 0, 0.4)']}
          style={styles.linearGradient}
        >

          <View style={styles.container}>
            <Image
              source={require('../assets/img/logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.appTitle}>WHATS MY FOOD</Text>


            <LoginButton
              style={styles.loginButton}
              publishPermissions={['publish_actions']}
              onLoginFinished={(error, result) => {
                if (error) {
                  alert(`Login failed with error: ${result.error}`);
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
                          () => {
                            navigation.navigate('Home');
                          },
                          // eslint-disable-next-line no-unused-vars
                          err => {
                            alert('Error while loggin in');
                          },
                        );
                    },
                    err => {
                      alert(`Some error occured: ${err}`);
                    },
                  );
                }
              }}
              onLogoutFinished={() => {
                // delete id from Firebase ?
                alert('User logged out');
              }}
            />
            <Text style={{ color: 'white' }}>
                By signing up, I agree with WhatsMyFood’s{'\n'}
              <Text style={{ color: 'red' }}>
                  Terms of Service
                <Text style={{ color: 'white' }}> and </Text>Privacy policy.
              </Text>
            </Text>
          </View>
        </LinearGradient>
      </ImageBackground>
    );
  }
}

Signin.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};
