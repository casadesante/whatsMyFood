import React, { Component } from 'react';
import { StyleSheet,
  Text,
  View,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  TextInput,
  NetInfo,
  AsyncStorage } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import PropTypes from 'prop-types';
import * as Animatable from 'react-native-animatable';
import colors from '../lib/Colors';
// import helper from '../lib/Helper'; // to generate sample data. Remove once API is implemented
import RestaurantCard from '../components/RestaurantCard';
import FoodCard from '../components/FoodCard';
import OfflineNotice from '../components/Nointernet';
import { heightPercentageToDP, widthPercentageToDP } from '../lib/Responsive';
import RF from '../../node_modules/react-native-responsive-fontsize';

const styles = StyleSheet.create({
  container: {
    height: heightPercentageToDP('100%'),
    backgroundColor: 'white',
  },
  restaurantContainer: {
    padding: widthPercentageToDP('4%'),
    paddingBottom: widthPercentageToDP('92%') * 0.5625,
    paddingTop: widthPercentageToDP('2%'),
  },
  searchInput: {
    color: 'white',
    fontFamily: 'SFProDisplay-Medium',
    fontSize: RF(3.5),
    letterSpacing: 0.41,
    marginLeft: widthPercentageToDP('4%'),
    width: widthPercentageToDP('72%'),
  },
  headerBackground: {
    backgroundColor: colors.coral,
    height: heightPercentageToDP('6.8%'),
  },
  searchTab: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: heightPercentageToDP('3%'),
    paddingBottom: heightPercentageToDP('0.5%'),
  },
  tabButton: {
    width: widthPercentageToDP('50%'),
  },
  searchBar: {
    display: 'flex',
    flexDirection: 'row',
    marginLeft: widthPercentageToDP('4%'),
    marginRight: widthPercentageToDP('4%'),
    paddingBottom: heightPercentageToDP('0.5%'),
    borderBottomWidth: 2,
    borderColor: 'white',
  },
  searchIcon: {
    marginLeft: widthPercentageToDP('1%'),
    marginTop: heightPercentageToDP('0.2%'),
  },
  noResults: {
    height: heightPercentageToDP('60%'),
    width: widthPercentageToDP('92%'),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noResultsText: {
    fontSize: RF(4),
    color: '#999',
  },
});

export default class Search extends Component {
  static navigationOptions = {
    headerStyle: {
      backgroundColor: 'rgb(255, 68, 68)',
      borderBottomWidth: 0,
    },
  };

  state = {
    tabState: 'Restaurant',
    searchKeyword: '',
    isConnected: true,
    restaurants: [],
    foods: [],
  };

  componentDidMount() {
    const { navigation } = this.props;
    /* eslint no-underscore-dangle: */
    this._navListener = navigation.addListener('didFocus', () => {
      StatusBar.setBarStyle('light-content');
    });
    NetInfo.isConnected.addEventListener(
      'connectionChange',
      this.handleConnectivityChange,
    );
    this.getRestaurantsFromAsyncStorage();
  }

  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener(
      'connectionChange',
      this.handleConnectivityChange,
    );
    this._navListener.remove();
  }

  getRestaurantsFromAsyncStorage = async () => {
    try {
      const retrievedItem = await AsyncStorage.getItem('restaurants');
      const restaurants = JSON.parse(retrievedItem);
      const foods = [];
      restaurants.forEach((hotel) => {
        hotel.foods.forEach((food) => {
          const f = food;
          if (f.foodPhotoURL === '') { delete f.foodPhotoURL; }
          f.restaurantName = hotel.restaurantName;
          foods.push(f);
        });
      });
      this.setState({ restaurants, foods });
      return true;
    } catch (error) {
      console.log(`Async store : ${error}`);
      return false;
    }
  };

  getRestaurant = restaurant => {
    const { navigation } = this.props;
    navigation.navigate('Restaurant', { restaurant, parentPage: 'Search' });
  };

  getRestaurantFromFood = restaurantID => {
    const { navigation } = this.props;
    const { restaurants } = this.state;
    const restaurantToGo = restaurants.find((hotel) => hotel.restaurantID === restaurantID);
    navigation.navigate('Restaurant', { restaurant: restaurantToGo, parentPage: 'Search' });
  };

  toggleSearchTab = selectedTab => {
    this.setState({ tabState: selectedTab });
  };

  tabLabelStyle = tabName => {
    const { tabState } = this.state;
    const styleObj = {
      fontFamily: 'SFProText-Medium',
      color: colors.coral,
      fontSize: RF(3),
      textAlign: 'center',
      opacity: 0.6,
    };
    if (tabState === tabName) {
      styleObj.opacity = 1.0;
    }
    return styleObj;
  };

  tabSelectorStyle = () => {
    const { tabState } = this.state;
    const moveLeft = tabState === 'Restaurant'
      ? widthPercentageToDP('8%')
      : widthPercentageToDP('65%');
    const underlineWidth = tabState === 'Restaurant'
      ? widthPercentageToDP('42%')
      : widthPercentageToDP('20%');
    return {
      height: heightPercentageToDP('0.4%'),
      backgroundColor: colors.coral,
      width: underlineWidth,
      borderRadius: 100,
      marginLeft: moveLeft,
    };
  };

  handleConnectivityChange = isConnected => {
    if (isConnected) {
      this.setState({ isConnected });
    } else {
      this.setState({ isConnected });
    }
  };

  searchClearStyle = () => {
    const { searchKeyword } = this.state;
    const crossOpacity = searchKeyword === '' ? 0 : 1;
    return `rgba(255,255,255,${crossOpacity})`;
  };

  handleSearchInput = (KeyWord) => {
    this.setState({ searchKeyword: KeyWord });
  }

  render() {
    const { tabState, searchKeyword, isConnected, restaurants, foods } = this.state;
    return (
      <View style={styles.container}>
        {!isConnected ? <OfflineNotice /> : null}
        <View style={styles.headerBackground}>
          <View style={styles.searchBar}>
            <Ionicons
              name="ios-search"
              size={RF(4)}
              color="white"
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Search"
              placeholderTextColor="rgba(255, 255, 255, 0.7)"
              onChangeText={this.handleSearchInput}
              value={searchKeyword}
              selectionColor="white"
            />
            <TouchableOpacity
              onPress={() => {
                this.setState({ searchKeyword: '' });
              }}
            >
              <Feather
                name="x"
                size={RF(4.4)}
                color={this.searchClearStyle()}
              />
            </TouchableOpacity>
          </View>
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.searchTab}>
            <View style={styles.tabButton}>
              <TouchableOpacity
                onPress={() => this.toggleSearchTab('Restaurant')}
              >
                <Text
                  style={[
                    this.tabLabelStyle('Restaurant'),
                    { marginLeft: widthPercentageToDP('8%') },
                  ]}
                >
                  RESTAURANT
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.tabButton}>
              <TouchableOpacity onPress={() => this.toggleSearchTab('Food')}>
                <Text style={this.tabLabelStyle('Food')}>FOOD</Text>
              </TouchableOpacity>
            </View>
          </View>
          <Animatable.View
            easing="ease-out"
            duration={500}
            transition={['marginLeft', 'width']}
            style={this.tabSelectorStyle()}
          />

          {tabState === 'Restaurant' ? (
            <View style={styles.restaurantContainer}>
              <View>
                {restaurants
                  .filter(
                    (hotel) => (
                      (hotel.restaurantName).toLowerCase()
                        .includes((searchKeyword).toLowerCase())),
                  ).length === 0
                  ? (
                    <View style={styles.noResults}>
                      <Text style={styles.noResultsText}>
                    No results found
                      </Text>
                    </View>
                  )
                  : (
                    restaurants
                      .filter(
                        (hotel) => (
                          (hotel.restaurantName).toLowerCase()
                            .includes((searchKeyword).toLowerCase())),
                      )
                      .map((restaurantInfo, index) => (
                        <RestaurantCard
                          goToRestaurant={this.getRestaurant}
                          restaurant={restaurantInfo}
                          key={restaurantInfo.restaurantID}
                          index={index}
                          disableAnimation
                        />
                      ))
                  )}
              </View>
            </View>
          ) : (
            <View style={styles.restaurantContainer}>
              {foods
                .filter(
                  (food) => (
                    (food.foodName).toLowerCase()
                      .includes((searchKeyword).toLowerCase())),
                ).length === 0
                ? (
                  <View
                    style={styles.noResults}
                  >
                    <Text style={styles.noResultsText}>No results found
                    </Text>
                  </View>
                )
                : (foods
                  .filter(
                    (food) => (
                      (food.foodName).toLowerCase()
                        .includes((searchKeyword).toLowerCase())),
                  ).map((foodInfo, index) => (
                    <FoodCard
                      key={foodInfo.foodId}
                      goToRestaurant={this.getRestaurantFromFood}
                      food={foodInfo}
                      index={index}
                      disableAnimation
                    />
                  )))}
            </View>
          )}
        </ScrollView>
      </View>
    );
  }
}

Search.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};
