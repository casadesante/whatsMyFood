import React from 'react';
import { createStackNavigator,
  createBottomTabNavigator,
  createSwitchNavigator } from 'react-navigation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Material from 'react-native-vector-icons/MaterialIcons';
import PropTypes from 'prop-types';
import colors from './lib/Colors';

import Signin from './containers/Signin';
import Home from './containers/Home';
import Newentry from './containers/Newentry';
import Addfood from './containers/Addfood';
import Search from './containers/Search';
import Profile from './containers/Profile';
import Restaurant from './containers/Restaurant';
import EditRestaurant from './containers/EditRestaurant';

export const SignedOut = createStackNavigator({
  SignIn: {
    screen: Signin,
  },
});

const HomeTabBarIcon = ({ tintColor }) => (
  <Material name="home" size={35} color={tintColor} />
);
HomeTabBarIcon.propTypes = {
  tintColor: PropTypes.string.isRequired,
};
const NewEntryTabBarIcon = ({ tintColor }) => (
  <Material name="add" size={37} color={tintColor} />
);
NewEntryTabBarIcon.propTypes = {
  tintColor: PropTypes.string.isRequired,
};
const SearchTabBarIcon = ({ tintColor }) => (
  <Ionicons name="ios-search" size={35} color={tintColor} />
);
SearchTabBarIcon.propTypes = {
  tintColor: PropTypes.string.isRequired,
};
const ProfileTabBarIcon = ({ tintColor }) => (
  <Ionicons name="ios-contact" size={35} color={tintColor} />
);
ProfileTabBarIcon.propTypes = {
  tintColor: PropTypes.string.isRequired,
};

export const SignedIn = createBottomTabNavigator(
  {
    Home: {
      screen: createStackNavigator({
        Home: { screen: Home },
        Restaurant: { screen: Restaurant },
        Addfood: { screen: Addfood },
        EditRestaurant: { screen: EditRestaurant },
      }),
      path: '',
      navigationOptions: {
        tabBarIcon: HomeTabBarIcon,
        title: 'WhatsMyFood',
        tabBarOnPress: ({ navigation }) => {
          const { routes } = navigation.state;
          // If home tab button is pressed when home screen is active, scroll to top
          if (navigation.state.index === 0) {
            routes.find(x => x.routeName === 'Home').params.scrollToTop();
          }
        },
      },
    },
    Newentry: {
      screen: createStackNavigator({
        Newentry: { screen: Newentry },
        Addfood: { screen: Addfood },
        Restaurant: { screen: Restaurant },
      }),
      path: '',
      navigationOptions: {
        tabBarIcon: NewEntryTabBarIcon,
      },
    },
    Search: {
      screen: createStackNavigator({
        Search: { screen: Search },
        Restaurant: { screen: Restaurant },
        Addfood: { screen: Addfood },
        EditRestaurant: { screen: EditRestaurant },
      }),
      path: '',
      navigationOptions: {
        tabBarIcon: SearchTabBarIcon,
      },
    },
    Profile: {
      screen: createStackNavigator({ Profile: { screen: Profile } }),
      path: '',
      navigationOptions: {
        tabBarIcon: ProfileTabBarIcon,
      },
    },
  },
  {
    tabBarOptions: {
      showLabel: false,
      activeTintColor: colors.coral,
      inactiveTintColor: '#979797',
      style: {
        backgroundColor: '#f8f8f8',
      },
    },
    animationEnabled: false,
    swipeEnabled: false,
  },
);

export const createRootNavigator = signedIn => createSwitchNavigator(
  {
    SignedIn: {
      screen: SignedIn,
      navigationOptions: {
        gesturesEnabled: false,
      },
    },
    SignedOut: {
      screen: SignedOut,
      navigationOptions: {
        gesturesEnabled: false,
      },
    },
  },
  {
    initialRouteName: signedIn ? 'SignedIn' : 'SignedOut',
  },
);
