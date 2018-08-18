import React, { Component } from 'react';
import { StyleSheet, Text, Image, ImageBackground, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import PropTypes from 'prop-types';
import SplashScreen from 'react-native-splash-screen';
import { widthPercentageToDP, heightPercentageToDP } from '../lib/Responsive';
import RF from '../../node_modules/react-native-responsive-fontsize';
import FacebookLoginButton from '../components/FbLoginButton';
import GoogleLoginButton from '../components/GoogleLoginButton';

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
    marginTop: heightPercentageToDP('14%'),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  appTitle: {
    color: 'white',
    fontSize: RF(5),
    marginTop: heightPercentageToDP('1%'),
  },
  logo: {
    opacity: 1,
    width: widthPercentageToDP('60%'),
    height: widthPercentageToDP('60%'),
  },
  loginButton: {
    marginTop: heightPercentageToDP('20%'),
    marginBottom: heightPercentageToDP('6%'),
  },
  footerText: {
    color: 'white',
    textAlign: 'center',
    fontSize: RF(2),
    lineHeight: RF(2.8),
  },
});

export default class Signin extends Component {
  static navigationOptions = {
    header: null,
  };

  componentDidMount() {
    SplashScreen.hide();
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
              source={
                require('../assets/img/logo.png')
                // 1024x1024 imagesize
              }
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.appTitle}>WhatsMyFood</Text>
            <View style={styles.loginButton}>
              <FacebookLoginButton navigation={navigation} />
              <GoogleLoginButton
                navigation={navigation}
                marginTopPercent="3%"
              />
            </View>
            <Text style={styles.footerText}>
              By signing up, I agree with WhatsMyFood’s{'\n'}
              <Text style={{ color: '#FF4444' }}>
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
