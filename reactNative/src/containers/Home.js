import React, { Component } from 'react';
import {StyleSheet,
  Text,
  View,
  ScrollView,
  StatusBar,
  NetInfo,
  ActivityIndicator,} from 'react-native';
import PropTypes from 'prop-types';

import helper from '../lib/Helper'; // to generate sample data. Remove once API is implemented
import { getProfileInfo } from '../lib/Auth';
import RestaurantCard from '../components/RestaurantCard';
import EmptyHome from '../components/EmptyHome';
import OfflineNotice from '../components/Nointernet';
import { heightPercentageToDP, widthPercentageToDP } from '../lib/Responsive';
import RF from '../../node_modules/react-native-responsive-fontsize';

const styles = StyleSheet.create({
  container: {
    height: heightPercentageToDP('100%'),
    backgroundColor: 'white',
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  restaurantContainer: {
    padding: widthPercentageToDP('4%'),
    paddingBottom: widthPercentageToDP('0%'),
  },
  restaurantLabel: {
    fontFamily: 'SFProDisplay-Regular',
    fontWeight: 'bold',
    fontSize: RF(4),
  },
  loader: {
    height: heightPercentageToDP('100%'),
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
});

export default class Home extends Component {
  static navigationOptions = {
    title: 'WhatsMyFood',
    headerStyle: {
      backgroundColor: 'white',
      borderBottomWidth: 0,
    },
  };

  state = {
    loading: true,
    restaurants: [],
    isConnected: true,
  };

  componentWillMount() {
    const { navigation } = this.props;
    navigation.setParams({
      scrollToTop: this.scrollToTop,
    });
  }

  componentDidMount() {
    const { navigation } = this.props;
    NetInfo.isConnected.addEventListener(
      'connectionChange',
      this.handleConnectivityChange,
    );
    /* eslint no-underscore-dangle: */
    this._navListener = navigation.addListener('didFocus', () => {
      StatusBar.setBarStyle('dark-content');
      getProfileInfo()
        .then(user => user.uid)
        .then(firebaseID => fetch(
            'https://us-central1-whatsmyfood.cloudfunctions.net/fetchRestaurantsAndFoods',
            {
              method: 'POST',
              body: JSON.stringify({ firebaseID }),
            },
          ),)
        .then(restaurants => restaurants.json())
        .then(parsedRestaurants => this.setState({ restaurants: parsedRestaurants, loading: false }),)
        .catch(err => alert(err));
    });
  }

  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener(
      'connectionChange',
      this.handleConnectivityChange,
    );
    this._navListener.remove();
  }

  getRestaurant = restaurant => {
    const { navigation } = this.props;
    navigation.navigate('Restaurant', { restaurant });
  };

  handleConnectivityChange = isConnected => {
    if (isConnected) {
      this.setState({ isConnected });
    } else {
      this.setState({ isConnected });
    }
  };

  scrollToTop = () => {
    console.log('scroll to top');
    if (this.scrollview) {
      this.scrollview.scrollTo({ x: 0, y: 0, animated: true });
    }
  };

  // if restaurant list is empty, show add button else show the list of restaurants
  render() {
    const { navigation } = this.props;
    const { restaurants, isConnected, loading } = this.state;

    if (loading) {
      return (
        <View style={styles.loader}>
          <ActivityIndicator
            size="large"
            color="#FF4444"
            style={{ marginBottom: heightPercentageToDP('21.8%') }}
          />
        </View>
      );
    }
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        {!isConnected ? <OfflineNotice /> : null}
        {restaurants.length === 0 ? (
          <EmptyHome navigation={navigation} />
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            ref={scrollview => {
              this.scrollview = scrollview;
            }}
          >
            <View style={styles.restaurantContainer}>
              <Text style={styles.restaurantLabel}>Restaurants</Text>
              {restaurants.map((restaurantInfo, index) => (
                <RestaurantCard
                  goToRestaurant={this.getRestaurant}
                  restaurant={restaurantInfo}
                  key={restaurantInfo.restaurantID}
                  index={index}
                />
              ))}
              {/* {helper */}
              {/* .generateRestaurants() */}
              {/* .map(restaurantInfo => ( */}
              {/* <RestaurantCard */}
              {/* goToRestaurant={this.getRestaurant} */}
              {/* restaurant={restaurantInfo} */}
              {/* key={restaurantInfo.id} */}
              {/* /> */}
              {/* ))} */}
            </View>
          </ScrollView>
        )}
      </View>
    );
  }
}

Home.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};
