import React from 'react';
import { StyleSheet, TouchableOpacity, Text } from 'react-native';
import { LoginManager, AccessToken } from 'react-native-fbsdk';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import firebase from 'firebase';
import RF from 'react-native-responsive-fontsize';

import { heightPercentageToDP, widthPercentageToDP } from '../lib/Responsive';

const styles = StyleSheet.create({
  loginButton: {
    width: widthPercentageToDP('89%'),
    height: heightPercentageToDP('6.5%'),
    backgroundColor: '#3B5998',
    borderRadius: heightPercentageToDP('6.5%') / 5,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    color: 'white',
    fontSize: RF(2.5),
  },
});

const facebookLogin = () => {
  console.log('Login Manager code');
};

const FacebookLoginButton = () => (
  <TouchableOpacity style={styles.loginButton} onPress={facebookLogin}>
    <Text
      style={styles.label}
    > Sign in with FaceBook
    </Text>
  </TouchableOpacity>
);
export default FacebookLoginButton;
