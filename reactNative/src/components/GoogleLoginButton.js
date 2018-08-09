import React, { Component } from 'react';
import { StyleSheet, ActivityIndicator, TouchableOpacity, Text, View } from 'react-native';
import { LoginManager, AccessToken } from 'react-native-fbsdk';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Config from 'react-native-config';
import firebase from 'firebase';
import RF from 'react-native-responsive-fontsize';
import PropTypes from 'prop-types';

import { heightPercentageToDP, widthPercentageToDP } from '../lib/Responsive';

const config = {
  apiKey: Config.API_KEY,
  authDomain: Config.AUTH_DOMAIN,
  databaseURL: Config.DB_URL,
  storageBucket: 'gs://whatsmyfood.appspot.com',
};

const styles = StyleSheet.create({
  loginButton: {
    width: widthPercentageToDP('89%'),
    height: heightPercentageToDP('6.5%'),
    backgroundColor: '#DA4733',
    borderRadius: heightPercentageToDP('6.5%') / 5,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  SNSlogo: {
    marginLeft: widthPercentageToDP('0%'),
  },
  loadingSpinner: {
    marginRight: widthPercentageToDP('2%'),
  },
  label: {
    color: 'white',
    fontSize: RF(2.5),
    fontFamily: 'SFProText-Light',
    marginRight: widthPercentageToDP('15%'),
  },
});


class GoogleLoginButton extends Component {
  constructor() {
    super();
    this.state = { GoogleLoginLoading: true };
  }

  componentDidMount() {
    this.setState({ GoogleLoginLoading: false });
    if (!firebase.apps.length) {
      firebase.initializeApp(config);
    }
  }

  googleLogin = (navigation) => {
    async function AsyncLogin(self) {
      console.log('Login Manager code');
      let result;
      try {
        self.setState({ GoogleLoginLoading: true });
        LoginManager.setLoginBehavior('native');
        result = await LoginManager.logInWithReadPermissions(['public_profile', 'email']);
      } catch (nativeError) {
        try {
          LoginManager.setLoginBehavior('web');
          result = await LoginManager.logInWithReadPermissions(['public_profile', 'email']);
        } catch (webError) {
          alert(`Some error occured: ${webError}`);
        // show error message to the user if none of the FB screens
        // did not open
        }
      }


      if (result.isCancelled) {
        self.setState({ GoogleLoginLoading: false });
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
    }
    AsyncLogin(this);
  }

  render() {
    const { navigation, marginTopPercent } = this.props;
    const { GoogleLoginLoading } = this.state;
    return (
      <TouchableOpacity
        style={[styles.loginButton, { marginTop: heightPercentageToDP(marginTopPercent) }]}
        onPress={() => this.googleLogin(navigation)}
      >
        { // Google login in process? Show loading spinner : else show sign in button
          GoogleLoginLoading
            ? (
              <View style={[styles.container, { justifyContent: 'center' }]}>
                <ActivityIndicator style={styles.loadingSpinner} size="small" color="#ffffff" />
                <Text
                  style={[styles.label, { marginRight: 0 }]}
                > Loading
                </Text>
              </View>
            )
            : (
              <View style={styles.container}>
                <FontAwesome
                  name="google"
                  size={RF(3.5)}
                  style={styles.SNSlogo}
                  color="#FFFFFF"
                />
                <Text
                  style={styles.label}
                > Sign in with Google
                </Text>
              </View>
            )
      }
      </TouchableOpacity>
    );
  }
}

export default GoogleLoginButton;

GoogleLoginButton.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
  marginTopPercent: PropTypes.string,
};

GoogleLoginButton.defaultProps = {
  marginTopPercent: '0%',
};
