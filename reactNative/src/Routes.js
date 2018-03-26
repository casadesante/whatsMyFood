import React from 'react';
import { StackNavigator, createBottomTabNavigator, TabNavigator, SwitchNavigator } from 'react-navigation';

import Signin from './containers/Signin';
import Home from './containers/Home';
import Newentry from './containers/Newentry';
import Search from './containers/Search';
import Profile from './containers/Profile';

export const SignedOut = StackNavigator({
  SignIn: {
    screen: Signin,
    navigationOptions: {
      title: "Sign In"
    }
  }
});

export const SignedIn = TabNavigator(
  {
    Home: {
      screen: Home,
      path: '',
    },
    Newentry: {
      screen: Newentry,
      path: '',
    },
    Search: {
      screen: Search,
      path: '',
    },
    Profile: {
      screen: Profile,
      path: '',
    }
  }
);


export const createRootNavigator = (signedIn = false) => {
  console.log(signedIn);
  return SwitchNavigator(
    {
      SignedIn: {
        screen: SignedIn,
        navigationOptions: {
          gesturesEnabled: false
        }
      },
      SignedOut: {
        screen: SignedOut,
        navigationOptions: {
          gesturesEnabled: false
        }
      }
    },
    {
      headerMode: "none",
      initialRouteName: signedIn ? "SignedIn" : "SignedOut"
    }
  );
};
