import React from 'react';
import {
  Text,
  View,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import * as Animatable from 'react-native-animatable';
import PropTypes from 'prop-types';
import RF from '../../node_modules/react-native-responsive-fontsize';
import { heightPercentageToDP, widthPercentageToDP } from '../lib/Responsive';

const styles = StyleSheet.create({
  linearGradient: {
    flex: 1,
    borderRadius: 10,
  },
  backgroundImage: {
    marginTop: 20,
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
  restaurantDistance: {
    color: 'white',
    marginTop: heightPercentageToDP('1%'),
    fontFamily: 'SFProText-Medium',
    fontSize: RF(2),
    textAlign: 'center',
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

const RestaurantCard = props => {
  const { restaurant, goToRestaurant } = props;
  const redGradient = ['rgb(255, 152, 99)', 'rgb(253, 89, 89)'];
  const blackOverlay = ['rgba(0, 0, 0, 0.50)', 'rgba(0, 0, 0, 0.55)'];
  return (
    <Animatable.View
      animation={cardStyle}
      delay={
        restaurant.id * 150
        // List index
      }
    >
      <TouchableOpacity
        onPress={() => {
          goToRestaurant(restaurant.id, restaurant.name);
        }}
      >
        <ImageBackground
          style={styles.backgroundImage}
          imageStyle={{ borderRadius: 10 }}
          resizeMode="contain"
          source={
            require('../assets/img/restaurantImg_16x9.png')
            // source={{
            //   uri: restaurant.img,
            // }}
          }
        >
          <LinearGradient
            colors={restaurant.img ? blackOverlay : redGradient}
            style={styles.linearGradient}
          >
            <View style={styles.details}>
              <Text style={styles.restaurantName} numberOfLines={2}>
                {restaurant.name}
              </Text>
              <Text style={styles.restaurantDistance}>
                {restaurant.distance} kms away
              </Text>
            </View>
          </LinearGradient>
        </ImageBackground>
      </TouchableOpacity>
    </Animatable.View>
  );
};

export default RestaurantCard;

RestaurantCard.propTypes = {
  restaurant: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    distance: PropTypes.string,
    img: PropTypes.string,
  }),
  goToRestaurant: PropTypes.func.isRequired,
};

RestaurantCard.defaultProps = {
  restaurant: {
    distance: '',
    img: null,
  },
};
