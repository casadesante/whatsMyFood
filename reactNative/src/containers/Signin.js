import React, { Component } from 'react';
import { StyleSheet,
  Text,
  Image,
  ImageBackground,
  View,
  StatusBar,
  Linking } from 'react-native';
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
    height: heightPercentageToDP('100%'),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  splitContainer: {
    width: widthPercentageToDP('100%'),
    height: heightPercentageToDP('50%'),
    display: 'flex',
    flexDirection: 'column',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
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
    marginTop: heightPercentageToDP('5%'),
  },
  googleLoginButton: {
    marginTop: heightPercentageToDP('10%'),
  },
  fbLoginButton: {
    marginTop: heightPercentageToDP('3%'),
    marginBottom: heightPercentageToDP('4%'),
  },
  footerText: {
    color: 'white',
    textAlign: 'center',
    fontSize: RF(2.2),
    lineHeight: RF(3),
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
          <StatusBar barStyle="light-content" />
          <View style={styles.container}>
            <View style={styles.splitContainer}>
              <Image
                source={
                  require('../assets/img/logo.png')
                  // 1024x1024 imagesize
                }
                style={styles.logo}
                resizeMode="contain"
              />
              <Text style={styles.appTitle}>WhatsMyFood</Text>
            </View>
            <View style={styles.splitContainer}>
              <View style={styles.googleLoginButton}>
                <GoogleLoginButton navigation={navigation} />
              </View>
              <View style={styles.fbLoginButton}>
                <FacebookLoginButton navigation={navigation} />
              </View>
              <Text style={styles.footerText}>
                By signing up, I agree with WhatsMyFood’s{'\n'}
                <Text style={{ color: '#FF4444' }} onPress={() => Linking.openURL('https://wmftermsandcond.glitch.me/')}>Terms of Service</Text>
                <Text style={styles.footerText}> and </Text>
                <Text style={{ color: '#FF4444' }} onPress={() => Linking.openURL('https://wmfprivacypolicy.glitch.me/')}>Privacy policy</Text>
              </Text>
            </View>
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
