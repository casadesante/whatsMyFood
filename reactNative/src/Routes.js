import React from 'react';
import { StackNavigator, createBottomTabNavigator, TabBarBottom, TabNavigator, SwitchNavigator } from 'react-navigation';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Signin from './containers/Signin';
import Home from './containers/Home';
import Newentry from './containers/Newentry';
import Search from './containers/Search';
import Profile from './containers/Profile';

export const SignedOut = StackNavigator({
  SignIn: {
    screen: Signin,
  }
});

export const SignedIn = TabNavigator(
  {
    Home: {
      screen: StackNavigator({Home: {screen: Home}}),
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
  },
    {
        navigationOptions: ({ navigation }) => ({
            tabBarIcon: ({ focused, tintColor }) => {
                const { routeName } = navigation.state;
                let iconName;
                if (routeName === 'Home') {
                    iconName = `ios-home${focused ? '' : '-outline'}`;
                } else if (routeName === 'Newentry') {
                    iconName = `md-add${focused ? '' : ''}`;
                } else if (routeName === 'Search') {
                    iconName = `ios-search${focused ? '' : '-outline'}`;
                } else if (routeName === 'Profile') {
                    iconName = `ios-contact${focused ? '' : '-outline'}`;
                }

                // You can return any component that you like here! We usually use an
                // icon component from react-native-vector-icons
                return  <Ionicons name={iconName} size={25} color={tintColor} />;
            },
        }),
        tabBarComponent: TabBarBottom,
        tabBarPosition: 'bottom',
        tabBarOptions: {
            activeTintColor: 'tomato',
            inactiveTintColor: 'gray',
        },
        animationEnabled: false,
        swipeEnabled: false,
    }
);

export const createRootNavigator = (signedIn = false) => {
  console.log(signedIn);
  return SwitchNavigator(
    {
      SignedIn: {
        screen: SignedIn,
        navigationOptions: {
          gesturesEnabled: false,
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
      initialRouteName: signedIn ? "SignedIn" : "SignedOut"
    }
  );
};
