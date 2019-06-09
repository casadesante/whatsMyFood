import React, { Component } from 'react';
import { StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Text,
  View } from 'react-native';
import { GoogleSignin, statusCodes } from 'react-native-google-signin';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Config from 'react-native-config';
import firebase from 'firebase';
import RF from 'react-native-responsive-fontsize';
import PropTypes from 'prop-types';

import { saveInAsyncStorage } from '../lib/Auth';
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
    fontFamily: 'SFProText-Regular',
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
    GoogleSignin.configure();
    GoogleSignin.configure({
      scopes: ['https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile'], // what API you want to access on behalf of the user, default is email and profile
      webClientId: '150563096063-q1eou06raefk65v5umsdl7l927v6ka9p.apps.googleusercontent.com',
      offlineAccess: true,
      hostedDomain: '', // specifies a hosted domain restriction
      loginHint: '', // [iOS] The user's ID, or email address, to be prefilled in the authentication UI if possible. [See docs here](https://developers.google.com/identity/sign-in/ios/api/interface_g_i_d_sign_in.html#a0a68c7504c31ab0b728432565f6e33fd)
      iosClientId: '150563096063-q1eou06raefk65v5umsdl7l927v6ka9p.apps.googleusercontent.com', // [iOS] optional, if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
    });
    if (!firebase.apps.length) {
      firebase.initializeApp(config);
    }
  }

  googleLogin = navigation => {
    async function AsyncLogin(self) {
      let result;
      try {
        self.setState({ GoogleLoginLoading: true });
        await GoogleSignin.hasPlayServices();
        result = await GoogleSignin.signIn();
      } catch (error) {
        if (error.code === statusCodes.SIGN_IN_CANCELLED) {
          // user cancelled the login flow
        } else if (error.code === statusCodes.IN_PROGRESS) {
          // operation (f.e. sign in) is in progress already
        } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
          // play services not available or outdated
        } else {
          // some other error happened
        }
      }

      if (!result) {
        self.setState({ GoogleLoginLoading: false });
        console.log('Google login was cancelled');
      } else {
        console.log('result');
        console.log(result);
        const credential = firebase.auth.GoogleAuthProvider.credential(
          result.idToken,
        );
        firebase
          .auth()
          .signInAndRetrieveDataWithCredential(credential)
          .then(
            ({ user, additionalUserInfo }) => {
              console.log('user');
              console.log(user);
              const userObj = {
                firebaseID: user.uid,
                userName: result.user.name,
                emailID: result.user.email,
                profilePicURL: result.user.photo,
              };
              console.log('userObj');
              console.log(userObj);
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
      }
    }
    AsyncLogin(this);
  };

  signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      console.log('userinfo');
      console.log(userInfo);
      // this.setState({ userInfo });
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (f.e. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        // some other error happened
      }
    }
  };

  render() {
    const { navigation, marginTopPercent } = this.props;
    const { GoogleLoginLoading } = this.state;
    return (
      <TouchableOpacity
        style={[
          styles.loginButton,
          { marginTop: heightPercentageToDP(marginTopPercent) },
        ]}
        onPress={() => this.googleLogin(navigation)}
      >
        {// Google login in process? Show loading spinner : else show sign in button
        GoogleLoginLoading ? (
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
              name="google"
              size={RF(3.5)}
              style={styles.SNSlogo}
              color="#FFFFFF"
            />
            <Text style={styles.label}> Sign in with Google</Text>
          </View>
        )}
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
