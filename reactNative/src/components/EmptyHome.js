import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import * as Animatable from 'react-native-animatable';
import PropTypes from 'prop-types';
import RF from '../../node_modules/react-native-responsive-fontsize';
import { widthPercentageToDP, heightPercentageToDP } from '../lib/Responsive';

const styles = StyleSheet.create({
  welcome: {
    fontSize: RF(5),
    marginTop: heightPercentageToDP('18%'),
    textAlign: 'center',
    marginLeft: widthPercentageToDP('13.77%'),
    marginRight: widthPercentageToDP('13.77%'),
    fontFamily: 'SFProText-Regular',
  },
  baseAddCircle: {
    position: 'absolute',
    backgroundColor: '#FF4444',
    padding: widthPercentageToDP('6.13%'),
    borderRadius: 100,
  },
  animCircle: {
    position: 'absolute',
    margin: 'auto',
    backgroundColor: 'rgba(255,68,68,0.15)',
    height: widthPercentageToDP('26.4%'),
    width: widthPercentageToDP('26.4%'),
    borderRadius: 100,
  },
  animCircleBig: {
    position: 'absolute',
    margin: 'auto',
    backgroundColor: 'rgba(255,68,68,0.15)',
    height: widthPercentageToDP('26.4%'),
    width: widthPercentageToDP('26.4%'),
    borderRadius: 100,
  },
  buttonContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    width: widthPercentageToDP('100%'),
    height: heightPercentageToDP('40%'),
  },
  addSymbol: {
    width: widthPercentageToDP('14.15%'),
    height: widthPercentageToDP('14.15%'),
    resizeMode: 'contain',
  },
});

const BigRipple = {
  0: {
    opacity: 0.8,
    scale: 1,
  },
  0.5: {
    opacity: 1,
    scale: 1.5,
  },
  1: {
    opacity: 0,
    scale: 2,
  },
};

const SmallRipple = {
  0: {
    opacity: 0.8,
    scale: 1,
  },
  0.5: {
    opacity: 1,
    scale: 1.25,
  },
  1: {
    opacity: 0,
    scale: 1.5,
  },
};

const EmptyHome = props => {
  const { navigation } = props;
  return (
    <View
      style={{
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Animatable.Text animation="fadeInUp" style={styles.welcome}>
              Add your first restaurant and dish !
      </Animatable.Text>
      <View style={styles.buttonContainer}>
        <Animatable.View
          style={styles.animCircleBig}
          animation={BigRipple}
          duration={6000}
          iterationDelay={100}
          iterationCount="infinite"
        />
        <Animatable.View
          style={styles.animCircle}
          animation={SmallRipple}
          duration={5600}
          iterationDelay={500}
          iterationCount="infinite"
        />
        <TouchableOpacity
          style={styles.baseAddCircle}
          onPress={() => navigation.navigate('Newentry')}
        >
          <Image
            source={require('../assets/img/addIcon.png')}
            style={styles.addSymbol}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default EmptyHome;

EmptyHome.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};
