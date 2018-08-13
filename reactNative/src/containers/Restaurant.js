import React, { Component } from 'react';
import HeaderImageScrollView from 'react-native-image-header-scroll-view';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { StyleSheet, Text, View, StatusBar, Image } from 'react-native';
import PropTypes from 'prop-types';
import FoodItems from '../components/FoodItems';
import helper from '../lib/Helper';
import { heightPercentageToDP, widthPercentageToDP } from '../lib/Responsive';

const styles = StyleSheet.create({
  container: {
    height: heightPercentageToDP('100%'),
  },
  linearGradient: {
    flex: 1,
  },
  image: {
    height: 200,
  },
  titleText: {
    flexDirection: 'row',
    color: 'black',
    fontSize: 33,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    marginLeft: 15,
  },
  nameView: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderBottomColor: 'rgba(222, 222, 222, 0.5)',
    borderBottomWidth: 0.5,
    paddingTop: 10,
    paddingBottom: 10,
  },
  headerImage: {
    width: widthPercentageToDP('100%'),
    height: heightPercentageToDP('32%'),
    alignSelf: 'stretch',
    resizeMode: 'cover',
  },
});

export default class Restaurant extends Component {
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
    headerRight: (
      <Ionicons
        style={{ paddingRight: 10 }}
        name="md-add"
        size={30}
        color="white"
      />
    ),
  };

  componentDidMount() {
    const { navigation } = this.props;
    console.log(navigation.state);
  }

  render() {
    const { navigation } = this.props;
    const foodItems = helper.getFoodItems();
    const restaurantName = navigation.getParam('name');
    const restaurantImageLink = 0; // boolean variable to toggle default and real restaurant image
    const restaurantImage = restaurantImageLink ? (
      <Image source={require('../assets/img/restaurantImg_16x9.png')} style={styles.headerImage} />
    ) : (
      <Image source={require('../assets/img/default_restaurantImg.png')} style={styles.headerImage} />
    );
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <HeaderImageScrollView
          maxHeight={heightPercentageToDP('32%')}
          minHeight={heightPercentageToDP('11%')}
          renderHeader={() => restaurantImage}
          maxOverlayOpacity={restaurantImageLink ? 0.6 : 0.01}
          minOverlayOpacity={restaurantImageLink ? 0.3 : 0.01}
        >
          <View>
            <View style={styles.nameView}>
              <Text style={styles.titleText}>{restaurantName}</Text>
              <MaterialCommunityIcons
                style={{
                  position: 'absolute',
                  right: 0,
                  paddingRight: 15,
                }}
                name="dots-horizontal-circle"
                size={35}
                color="rgb(255, 68, 68)"
              />
            </View>
            {foodItems.fav.length !== 0 ? (
              <FoodItems title="😍 My fav" items={foodItems.fav} />
            ) : null}
            {foodItems.good.length !== 0 ? (
              <FoodItems title="👌 Good" items={foodItems.good} />
            ) : null}
            {foodItems.fav.length !== 0 ? (
              <FoodItems title="😍 My fav" items={foodItems.fav} />
            ) : null}
            {foodItems.good.length !== 0 ? (
              <FoodItems title="👌 Good" items={foodItems.good} />
            ) : null}
            {foodItems.fav.length !== 0 ? (
              <FoodItems title="😍 My fav" items={foodItems.fav} />
            ) : null}
            {foodItems.good.length !== 0 ? (
              <FoodItems title="👌 Good" items={foodItems.good} />
            ) : null}
            {foodItems.fav.length !== 0 ? (
              <FoodItems title="😍 My fav" items={foodItems.fav} />
            ) : null}
            {foodItems.good.length !== 0 ? (
              <FoodItems title="👌 Good" items={foodItems.good} />
            ) : null}
            {foodItems.fav.length !== 0 ? (
              <FoodItems title="😍 My fav" items={foodItems.fav} />
            ) : null}
            {foodItems.good.length !== 0 ? (
              <FoodItems title="👌 Good" items={foodItems.good} />
            ) : null}
            {foodItems.fav.length !== 0 ? (
              <FoodItems title="😍 My fav" items={foodItems.fav} />
            ) : null}
            {foodItems.good.length !== 0 ? (
              <FoodItems title="👌 Good" items={foodItems.good} />
            ) : null}
          </View>
        </HeaderImageScrollView>
      </View>
    );
  }
}

Restaurant.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};
