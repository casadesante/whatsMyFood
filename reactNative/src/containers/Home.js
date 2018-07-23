import React, { Component } from 'react';
import { StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableHighlight,
  StatusBar } from 'react-native';
import PropTypes from 'prop-types';

import RF from 'react-native-responsive-fontsize';
import helper from '../lib/Helper'; // to generate sample data. Remove once API is implemented
import { widthPercentageToDP, heightPercentageToDP } from '../lib/Responsive';
import Restaurant from '../components/Restaurant';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  welcome: {
    fontSize: RF(5),
    marginTop: heightPercentageToDP('18%'),
    textAlign: 'center',
    marginLeft: widthPercentageToDP('13.77%'),
    marginRight: widthPercentageToDP('13.77%'),
    fontFamily: 'SFProText-Regular',
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  logo: {
    width: widthPercentageToDP('14.15%'),
    height: heightPercentageToDP('6.53%'),
    resizeMode: 'contain',
  },
  baseAddCircle: {
    marginTop: heightPercentageToDP('10.96%'),
    backgroundColor: '#FF4444',
    padding: widthPercentageToDP('6.13%'),
    borderRadius: 100,
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
    empty: true,
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
            }}
          >
            <Text style={styles.welcome}>
              Add your first restaurant and dish !
            </Text>
            <TouchableHighlight style={styles.baseAddCircle} onPress={() => navigation.navigate('Newentry')}>
              <Image
                source={require('../assets/img/addIcon.png')}
                style={styles.logo}
              />
            </TouchableHighlight>
          </View>
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
