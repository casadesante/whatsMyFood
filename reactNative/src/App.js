import React, { Component } from 'react';
import { View, Text } from 'react-native';

import { createRootNavigator } from './Routes';
import { isSignedIn, getFromAsyncStorage } from './lib/Auth';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      signedIn: false,
      promiseResolve: false,
    };
  }

  async componentWillMount() {
    getFromAsyncStorage().then(res => {
      console.log(`component will mount: ${res}`);
      this.setState({ signedIn: res, promiseResolve: true });
    });
  }

  render() {
    let { signedIn, promiseResolve } = this.state;
    const Layout = createRootNavigator(signedIn);
    if (promiseResolve) {
      return <Layout />;
    } else if (!promiseResolve) {
      {
        return (
          <View style={{ marginTop: 200 }}>
            <Text>Loading ...</Text>
          </View>
        );
      }
    }
  }
}
