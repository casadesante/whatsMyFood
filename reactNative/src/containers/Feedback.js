import React, { Component } from 'react';
// eslint-disable-next-line object-curly-newline
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  NetInfo,
  TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import PropTypes from 'prop-types';
import { NavigationActions } from 'react-navigation';
import { heightPercentageToDP, widthPercentageToDP } from '../lib/Responsive';
import RF from '../../node_modules/react-native-responsive-fontsize';
import OfflineNotice from '../components/Nointernet';

const styles = StyleSheet.create({

});

export default class Feedback extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Report a problem',
    headerStyle: {
      backgroundColor: 'rgb(248, 248, 248)',
    },
    headerRight: (
      <TouchableOpacity
        onPress={() => {
          alert('Waiting for Feedback API');
        }}
      >
        <Ionicons
          style={{ paddingRight: widthPercentageToDP('5%') }}
          name="ios-checkmark"
          size={60}
          color="#FF4444"
        />
      </TouchableOpacity>
    ),
    headerLeft: (
      <TouchableOpacity
        onPress={() => {
          navigation.dispatch(NavigationActions.back());
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Ionicons
            style={{ paddingLeft: widthPercentageToDP('5%') }}
            name="ios-close"
            size={50}
            color="#222"
          />
        </View>

      </TouchableOpacity>
    ),
  });

  state = {
    isConnected: true,
  };

  componentDidMount = () => {
    const { navigation } = this.props;
    NetInfo.isConnected.addEventListener(
      'connectionChange',
      this.handleConnectivityChange,
    );
    /* eslint no-underscore-dangle: */
    this._navListener = navigation.addListener('didFocus', () => {
      StatusBar.setBarStyle('dark-content');
    });
  };

  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener(
      'connectionChange',
      this.handleConnectivityChange,
    );
    this._navListener.remove();
  }

  handleConnectivityChange = isConnected => {
    if (isConnected) {
      this.setState({ isConnected });
    } else {
      this.setState({ isConnected });
    }
  };


  render() {
    const { isConnected } = this.state;
    return (
      <View style={styles.container}>
        {!isConnected ? <OfflineNotice /> : null}
        <View style={styles.headerContainer} />
        <Text>Feedback</Text>
        <View />
      </View>
    );
  }
}

Feedback.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};
