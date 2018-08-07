import React, { Component } from 'react';
import { StyleSheet, Text, Image, ImageBackground, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import PropTypes from 'prop-types';
import { widthPercentageToDP, heightPercentageToDP } from '../lib/Responsive';
import RF from '../../node_modules/react-native-responsive-fontsize';
import FacebookLoginButton from '../components/FbLoginButton';

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
    marginTop: heightPercentageToDP('28%'),
    marginBottom: heightPercentageToDP('6%'),
  },
});

export default class Signin extends Component {
  static navigationOptions = {
    header: null,
  };

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
            <Text style={styles.appTitle}>WhatsMyFood</Text>
            <View style={styles.loginButton}>
              <FacebookLoginButton navigation={navigation} />
            </View>
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
