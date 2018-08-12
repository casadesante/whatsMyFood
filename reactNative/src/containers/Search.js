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
  searchPlaceholder: {
    color: 'white',
    fontFamily: 'SFProDisplay-Medium',
    fontSize: RF(3.5),
    letterSpacing: 0.41,
    marginLeft: widthPercentageToDP('4%'),
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
  tabLabel: {
    fontFamily: 'SFProText-Medium',
    color: colors.coral,
    fontSize: RF(3),
    textAlign: 'center',
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
  tabSelector: {
    height: heightPercentageToDP('0.4%'),
    backgroundColor: colors.coral,
    width: widthPercentageToDP('42%'),
    borderRadius: 100,
    marginLeft: widthPercentageToDP('8%'),
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
          <View style={styles.searchBar}>
            <Ionicons name="ios-search" size={RF(4)} color="white" style={styles.searchIcon} />
            <Text style={styles.searchPlaceholder}>Search</Text>
          </View>
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.searchTab}>
            <View style={styles.tabButton}>
              <TouchableOpacity>
                <Text style={[styles.tabLabel, { marginLeft: widthPercentageToDP('8%') }]}>RESTAURANT</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.tabButton}>
              <TouchableOpacity>
                <Text style={styles.tabLabel}>FOOD</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.tabSelector} />
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
