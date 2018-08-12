import React from 'react';
import { Text,
  View,
  ImageBackground,
  StyleSheet,
  TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import PropTypes from 'prop-types';
import * as Animatable from 'react-native-animatable';
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
    padding: widthPercentageToDP('4%'),
  },
  foodName: {
    color: 'white',
    fontFamily: 'SFProText-Bold',
    fontSize: RF(2.8),
    textAlign: 'center',
  },
  foodRating: {
    color: 'white',
    marginTop: heightPercentageToDP('1%'),
    fontFamily: 'SFProText-Medium',
    fontSize: RF(5.5),
    textAlign: 'center',
  },
});

const cardStyle = {
  0: {
    opacity: 0,
    marginTop: heightPercentageToDP('5%'),
  },
  1: {
    opacity: 1,
    marginTop: heightPercentageToDP('0%'),
  },
};

const FoodCard = props => {
  const { food, goToRestaurant } = props;
  const redGradient = ['rgb(255, 152, 99)', 'rgb(253, 89, 89)'];
  const blackOverlay = ['rgba(0, 0, 0, 0.50)', 'rgba(0, 0, 0, 0.55)'];
  return (
    <Animatable.View animation={cardStyle} delay={food.id * 150}>
      <TouchableOpacity
        onPress={() => {
          goToRestaurant(food.id, food.name);
        }}
      >
        <ImageBackground
          style={styles.backgroundImage}
          imageStyle={{ borderRadius: 10 }}
          resizeMode="contain"
          source={require('../assets/img/foodImg_16x9.png')
        // source={{
          //   uri: food.img,
          // }}
        }
        >
          <LinearGradient
            colors={food.img ? blackOverlay : redGradient}
            style={styles.linearGradient}
          >
            <View style={styles.details}>
              <Text style={styles.foodRating}>
              👌
              </Text>
              <Text style={styles.foodName} numberOfLines={2}>
              Brownie obsession
              </Text>
              <Text style={styles.foodName} numberOfLines={2}>
              in T.G.I.Fridays
              </Text>
            </View>
          </LinearGradient>
        </ImageBackground>
      </TouchableOpacity>
    </Animatable.View>
  );
};

export default FoodCard;

FoodCard.propTypes = {
  food: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    distance: PropTypes.string,
    img: PropTypes.string,
  }),
  goToRestaurant: PropTypes.func.isRequired,
};

FoodCard.defaultProps = {
  food: {
    distance: '',
    img: null,
  },
};
