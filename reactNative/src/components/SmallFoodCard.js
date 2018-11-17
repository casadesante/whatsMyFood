import React, { Component } from 'react';
import { Text,
  View,
  Image,
  StyleSheet,
  TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import PropTypes from 'prop-types';
import * as Animatable from 'react-native-animatable';
import RF from '../../node_modules/react-native-responsive-fontsize';
import { heightPercentageToDP, widthPercentageToDP } from '../lib/Responsive';

const styles = StyleSheet.create({
  backgroundImage: {
    marginTop: 20,
    height: widthPercentageToDP('92%') * 0.5625,
  },
  details: {
    display: 'flex',
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: widthPercentageToDP('4%'),
  },
  foodImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  foodName: {
    fontSize: RF(2.2),
    marginLeft: widthPercentageToDP('4%'),
    width: widthPercentageToDP('51%'),
    marginRight: widthPercentageToDP('0.5%'),
    color: '#333333',
  },
  foodRating: {
    color: 'white',
    marginTop: heightPercentageToDP('1%'),
    fontFamily: 'SFProText-Medium',
    fontSize: RF(5.5),
    textAlign: 'center',
  },
  imageHolder: {
    position: 'relative',
    width: widthPercentageToDP('52%'),
    height: widthPercentageToDP('52%') * 9 / 16,
    margin: widthPercentageToDP('3.5%'),
    marginBottom: heightPercentageToDP('1%'),
    borderRadius: widthPercentageToDP('52%') / 25,
    overflow: 'hidden',
  },
  loader: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    borderRadius: 10,
    overflow: 'hidden',
  },
  loader1: {
    borderRadius: 10,
    position: 'absolute',
    height: '100%',
    width: '25%',
    left: '10%',
    transform: [
      { skewX: '5deg' },
    ],
  },
  loader2: {
    borderRadius: 10,
    position: 'absolute',
    height: '100%',
    width: '15%',
    left: '40%',
    transform: [
      { skewX: '5deg' },
    ],
  },
});

const loaderAnimation = {
  0: {
    left: '100%',
  },
  0.5: {
    left: '40%',
  },
  1: {
    left: '-100%',
  },
};

export default class SmallFoodCard extends Component {
  state = {
    loaded: false,
  }

  showPic = () => {
    this.setState({ loaded: true });
  }

  render() {
    const { foodImage, foodName, foodAction, foodID, item } = this.props;
    const foodImageLink = foodImage ? { uri: foodImage } : require('../assets/img/default_foodImg.png');

    const { loaded } = this.state;
    const redGradient = ['rgb(255, 152, 99)', 'rgb(253, 89, 89)'];
    const shine = ['rgba(255, 255, 255, 0.03)', 'rgba(255, 255, 255, 0.16)', 'rgba(255, 255, 255, 0.08)'];
    return (
      <TouchableOpacity
        onPress={() => { foodAction(item) }}
      >
        <View style={styles.imageHolder}>
          { !loaded ? (
            <LinearGradient
              colors={redGradient}
              style={styles.foodImage}
            >
              <Animatable.View duration={2000} delay={600} animation={loaderAnimation} iterationCount="infinite" style={styles.loader}>
                <LinearGradient colors={shine} style={styles.loader1} />
                <LinearGradient colors={shine} style={styles.loader2} />
              </Animatable.View>
            </LinearGradient>
          ) : (true)}
          <Image
            style={styles.foodImage}
            source={foodImageLink}
            onLoadEnd={this.showPic}
          />
        </View>
        <Text style={styles.foodName} numberOfLines={2}>
          {foodName}
        </Text>
      </TouchableOpacity>
    );
  }
}

SmallFoodCard.propTypes = {
  foodName: PropTypes.string.isRequired,
  foodImage: PropTypes.string,
};

SmallFoodCard.defaultProps = {
  foodImage: null,
};
