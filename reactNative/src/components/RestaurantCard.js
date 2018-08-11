import React from 'react';
import { Text,
  View,
  ImageBackground,
  StyleSheet,
  TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
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
    fontFamily: 'SFProText-Medium',
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

const RestaurantCard = props => {
  const { restaurant, goToRestaurant } = props;
  return (
    <TouchableOpacity
      onPress={() => {
        goToRestaurant(restaurant.id, restaurant.name);
      }}
    >
      <ImageBackground
        style={styles.backgroundImage}
        imageStyle={{ borderRadius: 10 }}
        source={require('../assets/img/restaurantImg_16x9.png')}
        resizeMode="contain"
      >
        <LinearGradient
          colors={['rgba(0, 0, 0, 0.50)', 'rgba(0, 0, 0, 0.55)']}
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
    img: '',
  },
};
