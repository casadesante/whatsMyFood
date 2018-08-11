import React, { Component } from 'react';
import { StyleSheet,
  Text,
  View,
  ScrollView,
  StatusBar,
  TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import PropTypes from 'prop-types';
import colors from '../lib/Colors';
import helper from '../lib/Helper'; // to generate sample data. Remove once API is implemented
import RestaurantCard from '../components/RestaurantCard';
import { heightPercentageToDP, widthPercentageToDP } from '../lib/Responsive';
import RF from '../../node_modules/react-native-responsive-fontsize';

const styles = StyleSheet.create({
  container: {
    height: heightPercentageToDP('100%'),
    backgroundColor: 'white',
  },
  restaurantContainer: {
    padding: widthPercentageToDP('4%'),
    paddingBottom: widthPercentageToDP('0%'),
    paddingTop: widthPercentageToDP('2%'),
  },
  addText: {
    color: 'white',
    fontFamily: 'SFProDisplay-Bold',
    fontSize: RF(5),
    fontWeight: 'bold',
    letterSpacing: 0.41,
    marginLeft: widthPercentageToDP('4%'),
    marginBottom: heightPercentageToDP('1.35%'),
  },
  headerBackground: {
    backgroundColor: colors.coral,
  },
  searchTabContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: heightPercentageToDP('2%'),
    paddingBottom: heightPercentageToDP('2%'),
  },
  tabButton: {
    width: widthPercentageToDP('50%'),
  },
  tabLabel: {
    fontFamily: 'SFProText-Medium',
    color: colors.coral,
    fontSize: RF(3),
    textAlign: 'center',
  },
});

export default class Search extends Component {
  static navigationOptions = {
    headerStyle: {
      backgroundColor: 'rgb(255, 68, 68)',
      borderBottomWidth: 0,
    },
  };

  componentDidMount() {
    console.log(helper.generateRestaurants());
  }

  goToRestaurant = (id, name) => {
    const { navigation } = this.props;
    navigation.navigate('Restaurant', { id, name });
  };

  render() {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <View style={styles.headerBackground}>
          <Ionicons name="ios-search" size={35} color={tintColor} />
          <Text style={styles.addText}>Search</Text>
        </View>
        <View style={styles.searchTabContainer}>
          <View style={styles.tabButton}>
            <TouchableOpacity>
              <Text style={styles.tabLabel}>RESTAURANT</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.tabButton}>
            <TouchableOpacity>
              <Text style={styles.tabLabel}>FOOD</Text>
            </TouchableOpacity>
          </View>
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.restaurantContainer}>
            {helper.generateRestaurants().map(restaurantInfo => (
              <RestaurantCard
                goToRestaurant={this.goToRestaurant}
                restaurant={restaurantInfo}
                key={restaurantInfo.id}
              />
            ))}
          </View>
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
