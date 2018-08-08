import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, Text, View } from 'react-native';
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
    backgroundColor: '#3B5998',
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
  facebookLogo: {
    marginLeft: widthPercentageToDP('1%'),
  },
  label: {
    color: 'white',
    fontSize: RF(2.5),
    fontFamily: 'SFProText-Light',
    marginRight: widthPercentageToDP('12%'),
  },
});


class FacebookLoginButton extends Component {
  componentDidMount() {
    if (!firebase.apps.length) {
      firebase.initializeApp(config);
    }
  }

  facebookLogin = (navigation) => {
    async function BM() {
      console.log('Login Manager code');
      let result;
      try {
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
    BM();
  }

  render() {
    const { navigation } = this.props;
    return (
      <TouchableOpacity style={styles.loginButton} onPress={() => this.facebookLogin(navigation)}>
        <View style={styles.container}>
          <FontAwesome
            name="facebook"
            size={RF(3.5)}
            style={styles.facebookLogo}
            color="#FFFFFF"
          />
          <Text
            style={styles.label}
          > Sign in with Facebook
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
}

export default FacebookLoginButton;

FacebookLoginButton.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};
