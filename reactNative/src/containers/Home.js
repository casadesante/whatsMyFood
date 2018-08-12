import React, { Component } from 'react';
import { StyleSheet,
  Text,
  View,
  ScrollView,
  StatusBar } from 'react-native';
import PropTypes from 'prop-types';

import helper from '../lib/Helper'; // to generate sample data. Remove once API is implemented
import RestaurantCard from '../components/RestaurantCard';
import EmptyHome from '../components/EmptyHome';
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
    empty: 0,
  };

  componentWillMount() {
    const { navigation } = this.props;
    navigation.setParams({
      scrollToTop: this.scrollToTop,
    });
  }

  componentDidMount() {
    console.log('Homescreen:  Component did mount');
  }

  getRestaurant = (id, name) => {
    const { navigation } = this.props;
    navigation.navigate('Restaurant', { id, name });
  };

  scrollToTop = () => {
    console.log('scroll to top');
    if (this.scrollview) {
      this.scrollview.scrollTo({ x: 0, y: 0, animated: true });
    }
  }

  // if restaurant list is empty, show add button else show the list of restaurants
  render() {
    const { navigation } = this.props;
    const { empty } = this.state;

    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        {empty ? (
          <EmptyHome navigation={navigation} />
        ) : (
          <ScrollView showsVerticalScrollIndicator={false} ref={(scrollview) => { this.scrollview = scrollview; }}>
            <View style={styles.restaurantContainer}>
              <Text
                style={styles.restaurantLabel}
              >
              Nearby restaurants
              </Text>

              {helper.generateRestaurants().map(restaurantInfo => (
                <RestaurantCard
                  goToRestaurant={this.getRestaurant}
                  restaurant={restaurantInfo}
                  key={restaurantInfo.id}
                />
              ))}
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
