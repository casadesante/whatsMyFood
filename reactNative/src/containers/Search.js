import React, { Component } from 'react';
import { StyleSheet,
  Text,
  View,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  TextInput } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import PropTypes from 'prop-types';
import * as Animatable from 'react-native-animatable';
import colors from '../lib/Colors';
import helper from '../lib/Helper'; // to generate sample data. Remove once API is implemented
import RestaurantCard from '../components/RestaurantCard';
import FoodCard from '../components/FoodCard';
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
});

export default class Search extends Component {
  static navigationOptions = {
    headerStyle: {
      backgroundColor: 'rgb(255, 68, 68)',
      borderBottomWidth: 0,
    },
  };

  constructor() {
    super();
    this.state = { tabState: 'Restaurant', searchKeyword: '' };
  }

  goToRestaurant = (id, name) => {
    const { navigation } = this.props;
    navigation.navigate('Restaurant', { id, name });
  };

  toggleSearchTab = (selectedTab) => {
    this.setState({ tabState: selectedTab });
  }

  tabLabelStyle = (tabName) => {
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
  }

  tabSelectorStyle = () => {
    const { tabState } = this.state;
    const moveLeft = (tabState === 'Restaurant') ? widthPercentageToDP('8%') : widthPercentageToDP('65%');
    const underlineWidth = (tabState === 'Restaurant') ? widthPercentageToDP('42%') : widthPercentageToDP('20%');
    return ({
      height: heightPercentageToDP('0.4%'),
      backgroundColor: colors.coral,
      width: underlineWidth,
      borderRadius: 100,
      marginLeft: moveLeft,
    });
  }

  searchClearStyle = () => {
    const { searchKeyword } = this.state;
    const crossOpacity = (searchKeyword === '') ? 0 : 1;
    return (`rgba(255,255,255,${crossOpacity})`);
  }

  render() {
    const { tabState, searchKeyword } = this.state;
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <View style={styles.headerBackground}>
          <View style={styles.searchBar}>
            <Ionicons name="ios-search" size={RF(4)} color="white" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search"
              placeholderTextColor="rgba(255, 255, 255, 0.7)"
              onChangeText={(KeyWord) => {
                this.setState({ searchKeyword: KeyWord });
              }}
              text={searchKeyword}
              selectionColor="white"
            />
            <Feather name="x" size={RF(4.4)} color={this.searchClearStyle()} />
          </View>
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.searchTab}>
            <View style={styles.tabButton}>
              <TouchableOpacity onPress={() => this.toggleSearchTab('Restaurant')}>
                <Text style={[this.tabLabelStyle('Restaurant'), { marginLeft: widthPercentageToDP('8%') }]}>RESTAURANT</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.tabButton}>
              <TouchableOpacity onPress={() => this.toggleSearchTab('Food')}>
                <Text style={this.tabLabelStyle('Food')}>FOOD</Text>
              </TouchableOpacity>
            </View>
          </View>
          <Animatable.View
            easing="ease-in-cubic"
            duration={450}
            transition={['marginLeft', 'width']}
            style={this.tabSelectorStyle()}
          />

          { tabState === 'Restaurant' ? (
            <View style={styles.restaurantContainer}>
              {helper.generateRestaurants().map(restaurantInfo => (
                <RestaurantCard
                  goToRestaurant={this.goToRestaurant}
                  restaurant={restaurantInfo}
                  key={restaurantInfo.id}
                />
              ))}
            </View>) : (
              <View style={styles.restaurantContainer}>
                {helper.generateRestaurants().map(foodInfo => (
                  <FoodCard
                    goToRestaurant={this.goToRestaurant}
                    food={foodInfo}
                    key={foodInfo.id}
                  />
                ))}
              </View>
          )
        }
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
