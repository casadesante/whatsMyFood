import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableHighlight,
  StatusBar,
} from 'react-native';
import PropTypes from 'prop-types';

import helper from '../lib/Helper'; // to generate sample data. Remove once API is implemented
import Restaurant from '../componenets/Restaurant';

export default class Home extends Component {
  static navigationOptions = {
    title: 'Home',
    headerStyle: {
      backgroundColor: 'white',
      shadowColor: 'rgba(222, 222, 222, 0.5)',
      shadowOpacity: 1,
      shadowOffset: {
        height: 0.5,
      },
    },
  };

  state = {
    empty: false,
  };

  componentDidMount() {
    console.log(helper.generateRestaurants());
  }

  getRestaurant = (id, name) => {
    const { navigation } = this.props;
    navigation.navigate('Restaurant', { id, name });
  };

  // if restaurant list is empty, show add button else show the list of restaurants
  render() {
    const { navigation } = this.props;
    const { empty } = this.state;
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        {empty ? (
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: '20%',
            }}
          >
            <Text style={styles.welcome}>
              Add your first restaurant and dish !
            </Text>
            <TouchableHighlight onPress={() => navigation.navigate('Newentry')}>
              <Image
                source={require('../assets/img/add.png')}
                style={styles.logo}
              />
            </TouchableHighlight>
          </View>
        ) : (
          <View style={{ padding: 20 }}>
            <Text
              style={{
                fontFamily: "SFProDisplay-Regular",
                fontWeight: 'bold',
                fontSize: 30,
              }}
            >
              Restaurants
            </Text>
            <ScrollView>
              {helper.generateRestaurants().map(x => (
                <View key={x.id}>
                  <Restaurant
                    goToRestaurant={this.getRestaurant}
                    restaurant={x}
                  />
                </View>
              ))}
            </ScrollView>
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  welcome: {
    fontSize: 40,
    textAlign: 'center',
    margin: 10,
    padding: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  logo: {
    marginTop: '20%',
    height: 100,
    resizeMode: 'contain',
  },
});

Home.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};
