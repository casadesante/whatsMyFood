import React, { Component } from 'react';
import { StyleSheet,
  Text,
  View,
  ScrollView,
  StatusBar } from 'react-native';
import PropTypes from 'prop-types';

import helper from '../lib/Helper'; // to generate sample data. Remove once API is implemented
import Restaurant from '../components/Restaurant';
import EmptyHome from '../components/EmptyHome';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
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
    empty: 1,
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
          <EmptyHome navigation={navigation} />
        ) : (
          <View style={{ padding: 20 }}>
            <Text
              style={{
                fontFamily: 'SFProDisplay-Regular',
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

Home.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};
