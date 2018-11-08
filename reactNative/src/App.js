import React, { Component } from 'react';
import { StyleSheet, View, ActivityIndicator, AsyncStorage } from 'react-native';

import SplashScreen from 'react-native-splash-screen';
import { createRootNavigator } from './Routes';
import { getFromAsyncStorage, getProfileInfo } from './lib/Auth';
import { heightPercentageToDP } from './lib/Responsive';

const styles = StyleSheet.create({
  container: {
    height: heightPercentageToDP('100%'),
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      signedIn: false,
      promiseResolve: false,
    };
  }

  async componentWillMount() {
    getProfileInfo()
      .then(user => user.uid)
      .then(firebaseID => fetch(
        'https://us-central1-whatsmyfood.cloudfunctions.net/fetchRestaurantsAndFoods',
        {
          method: 'POST',
          body: JSON.stringify({ firebaseID }),
        },
      ))
      .then(restaurants => restaurants.json())
      .then(parsedRestaurants => this.saveRestaurantsInAsyncStorage(parsedRestaurants))
      .catch(err => alert(err));
  }

  componentDidMount() {
    SplashScreen.hide();
  }

  saveRestaurantsInAsyncStorage = async (restaurants) => {
    try {
      await AsyncStorage.setItem(
        'restaurants',
        JSON.stringify(restaurants),
      );
      getFromAsyncStorage().then(res => {
        this.setState({ signedIn: res, promiseResolve: true });
      });
      return true;
    } catch (error) {
      alert('Async store error');
      return false;
    }
  };

  render() {
    const { signedIn, promiseResolve } = this.state;
    const Layout = createRootNavigator(signedIn);

    return promiseResolve ? (
      <Layout />
    ) : (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#FF4444" />
      </View>
    );
  }
}
