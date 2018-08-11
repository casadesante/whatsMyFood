import React from 'react';
import { Text,
  View,
  ImageBackground,
  StyleSheet,
  TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  linearGradient: {
    flex: 1,
    borderRadius: 10,
  },
  backgroundImage: {
    marginTop: 20,
    height: 195,
  },
  details: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
        source={require('../assets/img/tgif.png')}
        resizeMode="cover"
      >
        <LinearGradient
          colors={['rgba(0, 0, 0, 0.45)', 'rgba(0, 0, 0, 0.45)']}
          style={styles.linearGradient}
        >
          <View style={styles.details}>
            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 35 }}>
              {restaurant.name}
            </Text>
            <Text style={{ color: 'white', fontWeight: 'bold' }}>
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
