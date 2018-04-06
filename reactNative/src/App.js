import React, { Component } from "react";

import { createRootNavigator } from "./Routes";
import { isSignedIn } from "./lib/Auth";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      signedIn: true
    };
  }
  //
  // componentDidMount() {
  //   isSignedIn()
  //   .then((res) => {
  //     this.setState({signedIn: res});
  //   })
  // }

  render() {
    const signedIn = this.state.signedIn;
    console.log(signedIn);
    const Layout = createRootNavigator(signedIn);

    return <Layout />;
  }
}
