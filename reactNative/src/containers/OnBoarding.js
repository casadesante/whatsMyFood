import React, { Component } from 'react';
// eslint-disable-next-line object-curly-newline
import {
  StyleSheet,
  Text,
  View,
  Image,
  Button } from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import PropTypes from 'prop-types';
import { heightPercentageToDP, widthPercentageToDP } from '../lib/Responsive';
import RF from '../../node_modules/react-native-responsive-fontsize';

const slides = [
  {
    key: 'somethun',
    title: 'Title 1',
    text: 'Description.\nSay something cool',
    image: require('../assets/img/onBoarding/1.jpg'),
    backgroundColor: '#59b2ab',
  },
  {
    key: 'somethun-dos',
    title: 'Title 2',
    text: 'Other cool stuff',
    image: require('../assets/img/onBoarding/1.jpg'),
    backgroundColor: '#febe29',
  },
  {
    key: 'somethun1',
    title: 'Rocket guy',
    text: 'I\'m already out of descriptions\n\nLorem ipsum bla bla bla',
    image: require('../assets/img/onBoarding/1.jpg'),
    backgroundColor: '#22bcb5',
  },
];


const styles = StyleSheet.create({
  container: {
    height: heightPercentageToDP('100%'),
    backgroundColor: 'white',
  },
  headerContainer: {
    height: heightPercentageToDP('30%'),
    backgroundColor: 'rgb(248, 248, 248)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ImageShadow: {
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowRadius: 3,
    shadowOpacity: 0.2,
    position: 'absolute',
  },
  profileImage: {
    height: widthPercentageToDP('40%'),
    width: widthPercentageToDP('40%'),
    borderRadius: widthPercentageToDP('40%') / 2,
  },
  usernameStyle: {
    fontWeight: 'bold',
    fontSize: RF(3.8),
    margin: heightPercentageToDP('2%'),
  },
  photoHolder: {
    height: widthPercentageToDP('40%'),
    width: widthPercentageToDP('40%'),
  },
});

export default class OnBoarding extends Component {
  static navigationOptions = {
    header: null,
  };

   navigateToHome = () => {
     const { props: { navigation } } = this;
     navigation.navigate('Home');
   }
  
   renderItem = (item) => (
     <View style={styles.slide}>
       <Image source={item.image} />
       <Text style={styles.text}>{item.text}</Text>
     </View>
   )

   render() {
     return (
       <AppIntroSlider renderItem={this.renderItem} slides={slides} onDone={this.navigateToHome} />
     );
   }
}

OnBoarding.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};
