import React, { Component } from 'react';
// eslint-disable-next-line object-curly-newline
import {
  StyleSheet,
  Text,
  View,
  Button } from 'react-native';
import PropTypes from 'prop-types';
import { heightPercentageToDP, widthPercentageToDP } from '../lib/Responsive';
import RF from '../../node_modules/react-native-responsive-fontsize';


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
   navigateToHome = () => {
     const { props: { navigation } } = this;
     navigation.navigate('Home');
   }
     
   render() {
     const { navigateToHome } = this;
     return (
       <View style={styles.container}>
         <Text>
          on boarding screen
         </Text>
         <Button
           onPress={navigateToHome}
           title="home"
         />
       </View>
     );
   }
}

OnBoarding.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};
