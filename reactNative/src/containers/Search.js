import React, { Component } from 'react';
import { StyleSheet,
  Text,
  View,
  ScrollView,
  StatusBar,
  TouchableOpacity } from 'react-native';
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
    const { navigation } = this.props;

    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <View style={styles.headerBackground}>
          <Text style={styles.addText}>Search</Text>
        </View>
        <View>
          <TouchableOpacity>
            <Text>Restaurant</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text>Food</Text>
          </TouchableOpacity>
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
