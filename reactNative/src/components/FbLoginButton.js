import React, { Component } from 'react';
import { StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Text,
  View,
  Alert } from 'react-native';
import { LoginManager, AccessToken } from 'react-native-fbsdk';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Config from 'react-native-config';
import firebase from 'firebase';
import RF from 'react-native-responsive-fontsize';
import PropTypes from 'prop-types';

import { heightPercentageToDP, widthPercentageToDP } from '../lib/Responsive';
import { saveInAsyncStorage } from '../lib/Auth';

const config = {
  apiKey: Config.API_KEY,
  authDomain: Config.AUTH_DOMAIN,
  databaseURL: Config.DB_URL,
  storageBucket: 'gs://whatsmyfood.appspot.com',
};

const styles = StyleSheet.create({
  loginButton: {
    width: widthPercentageToDP('89%'),
    height: heightPercentageToDP('7%'),
    backgroundColor: '#3B5998',
    borderRadius: heightPercentageToDP('7%') / 5,
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
  loadingSpinner: {
    marginRight: widthPercentageToDP('2%'),
  },
  label: {
    color: 'white',
    fontSize: RF(2.5),
    fontFamily: 'SFProText-Light',
    marginRight: widthPercentageToDP('12%'),
  },
});

class FacebookLoginButton extends Component {
  constructor() {
    super();
    this.state = { FbLoginLoading: true };
  }

  componentDidMount() {
    this.setState({ FbLoginLoading: false });
    if (!firebase.apps.length) {
      firebase.initializeApp(config);
    }
  }

  facebookLogin = navigation => {
    async function AsyncLogin(self) {
      let result;
      try {
        self.setState({ FbLoginLoading: true });
        LoginManager.setLoginBehavior('native');
        result = await LoginManager.logInWithReadPermissions([
          'public_profile',
          'email',
        ]);
      } catch (nativeError) {
        try {
          LoginManager.setLoginBehavior('web');
          result = await LoginManager.logInWithReadPermissions([
            'public_profile',
            'email',
          ]);
        } catch (webError) {
          Alert.alert(`Some error occured: ${webError}`);
          // show error message to the user if none of the FB screens
          // did not open
        }
      }

      if (result.isCancelled) {
        self.setState({ FbLoginLoading: false });
        console.log('Facebook login was cancelled');
      } else {
        AccessToken.getCurrentAccessToken().then(
          accessTokenData => {
            const credential = firebase.auth.FacebookAuthProvider.credential(
              accessTokenData.accessToken,
            );
            firebase
              .auth()
              .signInAndRetrieveDataWithCredential(credential)
              .then(
                ({ user, additionalUserInfo }) => {
                  const userObj = {
                    firebaseID: user.uid,
                    userName: user.displayName,
                    emailID: user.email,
                    profilePicURL: user.photoURL,
                  };
                  fetch(
                    'https://us-central1-whatsmyfood.cloudfunctions.net/addUser',
                    {
                      method: 'POST',
                      body: JSON.stringify(userObj),
                    },
                  )
                    .then(() => {
                      saveInAsyncStorage().then(res => {
                        // eslint-disable-next-line no-unused-expressions
                        additionalUserInfo.isNewUser
                          ? navigation.navigate('OnBoarding')
                          : navigation.navigate('Home');
                      });
                    })
                    .catch(err => {
                      alert(err);
                    });
                },
                // eslint-disable-next-line no-unused-vars
                err => {
                  // TODO: handle error
                  alert('Error while logging in');
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
  };

  render() {
    const { navigation, marginTopPercent } = this.props;
    const { FbLoginLoading } = this.state;
    return (
      <TouchableOpacity
        style={[
          styles.loginButton,
          { marginTop: heightPercentageToDP(marginTopPercent) },
        ]}
        onPress={() => this.facebookLogin(navigation)}
      >
        {// Facebook login in process? Show loading spinner : else show sign in button
        FbLoginLoading ? (
          <View style={[styles.container, { justifyContent: 'center' }]}>
            <ActivityIndicator
              style={styles.loadingSpinner}
              size="small"
              color="#ffffff"
            />
            <Text style={[styles.label, { marginRight: 0 }]}> Loading</Text>
          </View>
        ) : (
          <View style={styles.container}>
            <FontAwesome
              name="facebook"
              size={RF(3.5)}
              style={styles.facebookLogo}
              color="#FFFFFF"
            />
            <Text style={styles.label}> Sign in with Facebook</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  }
}

export default FacebookLoginButton;

FacebookLoginButton.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
  marginTopPercent: PropTypes.string,
};

FacebookLoginButton.defaultProps = {
  marginTopPercent: '0%',
};
