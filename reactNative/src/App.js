import React, { Component } from 'react';

import { createRootNavigator } from './Routes';
import { isSignedIn } from './lib/Auth';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      signedIn: false,
    };
  }

  componentDidMount() {
    isSignedIn().then(res => {
      this.setState({ signedIn: res });
    });
  }

  render() {
    const { signedIn } = this.state;
    console.log(signedIn);
    const Layout = createRootNavigator(signedIn);

    return <Layout />;
  }
}
