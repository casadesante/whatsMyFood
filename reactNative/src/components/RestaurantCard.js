import React, { Component } from 'react';
import { Text,
  View,
  ImageBackground,
  StyleSheet,
  TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import * as Animatable from 'react-native-animatable';
import PropTypes from 'prop-types';
import RF from '../../node_modules/react-native-responsive-fontsize';
import { heightPercentageToDP, widthPercentageToDP } from '../lib/Responsive';

const styles = StyleSheet.create({
  linearGradient: {
    flex: 1,
    borderRadius: 10,
    position: 'relative',
  },
  backgroundImage: {
    marginTop: heightPercentageToDP('2%'),
    height: widthPercentageToDP('92%') * 0.5625,
  },
  details: {
    display: 'flex',
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: widthPercentageToDP('5%'),
  },
  restaurantName: {
    color: 'white',
    fontFamily: 'SFProText-Bold',
    fontSize: RF(4),
    textAlign: 'center',
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

const cardStyle = {
  0: {
    opacity: 0,
    marginTop: heightPercentageToDP('5%'),
  },
  0.5: {
    opacity: 0.6,
    marginTop: heightPercentageToDP('2.5%'),
  },
  1: {
    opacity: 1,
    marginTop: heightPercentageToDP('0%'),
  },
};

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

export default class RestaurantCard extends Component {
  constructor() {
    super();
    this.state = {
      loaded: false,
    };
  }

  componentDidMount() {
    const { restaurant } = this.props;
    if (!restaurant.restaurantPhotoURL) this.setState({ loaded: true });
  }

  showPic = () => {
    this.setState({ loaded: true });
  };

  render() {
    const { restaurant, goToRestaurant, index, disableAnimation } = this.props;
    const { loaded } = this.state;
    const redGradient = ['rgb(255, 152, 99)', 'rgb(253, 89, 89)'];
    const shine = ['rgba(255, 255, 255, 0.01)', 'rgba(255, 255, 255, 0.05)', 'rgba(255, 255, 255, 0.03)'];
    const blackOverlay = ['rgba(0, 0, 0, 0.50)', 'rgba(0, 0, 0, 0.55)'];
    return (
      <Animatable.View
        animation={disableAnimation ? undefined : cardStyle}
        delay={
        index * 150
        // List index
      }
      >
        <TouchableOpacity
          onPress={() => {
            goToRestaurant(restaurant);
          }}
        >
          <ImageBackground
            style={styles.backgroundImage}
            imageStyle={{ borderRadius: 10 }}
            resizeMode="contain"
            onLoadEnd={this.showPic}
            source={{
              uri: restaurant.restaurantPhotoURL,
            }}
          >
            <LinearGradient
              colors={restaurant.restaurantPhotoURL && loaded ? blackOverlay : redGradient}
              style={styles.linearGradient}
            >
              <View>
                { !loaded ? (
                  <Animatable.View duration={2300} delay={600} animation={loaderAnimation} iterationCount="infinite" style={styles.loader}>
                    <LinearGradient colors={shine} style={styles.loader1} />
                    <LinearGradient colors={shine} style={styles.loader2} />
                  </Animatable.View>
                ) : (true)}
                <View style={styles.details}>
                  <Text style={styles.restaurantName} numberOfLines={2}>
                    {restaurant.restaurantName}
                  </Text>
                </View>
              </View>
            </LinearGradient>
          </ImageBackground>
        </TouchableOpacity>
      </Animatable.View>
    );
  }
}

RestaurantCard.propTypes = {
  index: PropTypes.number.isRequired,
  restaurant: PropTypes.shape({
    restaurantID: PropTypes.string.isRequired,
    restaurantName: PropTypes.string.isRequired,
    restaurantPhotoURL: PropTypes.string,
  }),
  goToRestaurant: PropTypes.func.isRequired,
  disableAnimation: PropTypes.bool,
};

RestaurantCard.defaultProps = {
  restaurant: {
    restaurantPhotoURL: null,
  },
  disableAnimation: false,
};
