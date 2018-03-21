import React from 'react';
import { TabNavigator, StackNavigator } from 'react-navigation';

import Signin from './containers/Signin';
import Home from './containers/Home';

export const SignedOut = StackNavigator({
  SignIn: {
    screen: Signin,
    navigationOptions: {
      title: "Sign In"
    }
  }
});

export const SignedIn = StackNavigator({
  Home: {
    screen: Home,
    navigationOptions: {
      title: "Home page",
    }
   }
  });


export const createRootNavigator = (signedIn = false) => {
  console.log(signedIn);
  return StackNavigator(
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
