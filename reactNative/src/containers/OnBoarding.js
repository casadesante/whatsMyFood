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
    text: 'Add the restaurant',
    image: require('../assets/img/onBoarding/Addres2.gif'),
    backgroundColor: '#59b2ab',
  },
  {
    key: 'somethun-dos',
    title: 'Title 2',
    text: 'Rate your food',
    image: require('../assets/img/onBoarding/AddFood.gif'),
    backgroundColor: '#febe29',
  },
  {
    key: 'somethun1',
    title: 'Rocket guy',
    text: 'Refer when you revisit',
    image: require('../assets/img/onBoarding/rstaurant.gif'),
    backgroundColor: '#22bcb5',
  },
];


const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    height: heightPercentageToDP('65%'),
    width: widthPercentageToDP('65%'),
    marginBottom: heightPercentageToDP('4%'),
  },
  text: {
    color: '#333333',
    fontSize: RF(3),
  },
});

export default class OnBoarding extends Component {
  static navigationOptions = {
    headerTintColor: 'white',
    headerStyle: {
      position: 'absolute',
      top: 0,
      right: 0,
      left: 0,
      elevation: 0,
      shadowColor: 'transparent',
      borderBottomWidth: 0,
      backgroundColor: 'transparent',
      shadowRadius: 0,
      shadowOffset: {
        height: 0,
      },
    },
  };

   navigateToHome = () => {
     const { props: { navigation } } = this;
     navigation.navigate('Home');
   }

   renderItem = (item) => (
     <View style={styles.container}>
       <Image style={styles.image} source={item.image} />
       <Text style={styles.text}>{item.text}</Text>
     </View>
   )

   render() {
     return (
       <AppIntroSlider
         renderItem={this.renderItem}
         slides={slides}
         showSkipButton
         onDone={this.navigateToHome}
         onSkip={this.navigateToHome}
         activeDotStyle={{ backgroundColor: '#222222' }}
         dotStyle={{ backgroundColor: '#dddddd' }}
         buttonTextStyle={{ color: '#555555' }}
         skipLabel="SKIP"
       />
     );
   }
}

OnBoarding.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};
