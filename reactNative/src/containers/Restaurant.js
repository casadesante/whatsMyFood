import React, { Component } from 'react';
import HeaderImageScrollView from 'react-native-image-header-scroll-view';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { StyleSheet, Text, View, StatusBar } from 'react-native';
import FoodItems from '../componenets/FoodItems';
import helper from '../lib/Helper';

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
    console.log(this.props.navigation.state);
  }
  render() {
    const { navigation } = this.props;
    const foodItems = helper.getFoodItems();
    const restaurantName = navigation.getParam('name');
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <HeaderImageScrollView
          maxHeight={300}
          minHeight={100}
          headerImage={require('../assets/img/tgif.jpg')}
          maxOverlayOpacity={0.6}
          minOverlayOpacity={0.5}
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
          </View>
        </HeaderImageScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
});
