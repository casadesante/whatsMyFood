import React, { Component } from 'react';
// eslint-disable-next-line object-curly-newline
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  Image,
  NetInfo } from 'react-native';
import { ListItem } from 'react-native-elements';
import PropTypes from 'prop-types';
import { heightPercentageToDP, widthPercentageToDP } from '../lib/Responsive';
import RF from '../../node_modules/react-native-responsive-fontsize';

import { getProfileInfo, logout } from '../lib/Auth';
import OfflineNotice from '../components/Nointernet';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  dpImageHolder: {
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowRadius: 3,
    shadowOpacity: 0.2,
  },
  profileImage: {
    height: widthPercentageToDP('40%'),
    width: widthPercentageToDP('40%'),
    borderRadius: widthPercentageToDP('40%') / 2,
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  usernameStyle: {
    fontWeight: 'bold',
    fontSize: RF(3.8),
    marginTop: heightPercentageToDP('2%'),
  },
});

export default class Profile extends Component {
  static navigationOptions = {
    title: 'Profile',
    headerStyle: {
      backgroundColor: 'rgb(248, 248, 248)',
      borderBottomWidth: 0,
    },
  };

  state = {
    user: {
      displayName: 'Loading...',
      photoURL:
        'https://ctvalleybrewing.com/wp-content/uploads/2017/04/avatar-placeholder.png',
    },
    isConnected: true,
  };

  componentDidMount = () => {
    NetInfo.isConnected.addEventListener(
      'connectionChange',
      this.handleConnectivityChange,
    );
    getProfileInfo()
      .then(res => {
        const user = {
          displayName: res.displayName,
          photoURL: res.photoURL,
        };
        this.setState({ user });
      })
      .catch(err => alert(err));
  };

  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener(
      'connectionChange',
      this.handleConnectivityChange,
    );
  }

  handleConnectivityChange = isConnected => {
    if (isConnected) {
      this.setState({ isConnected });
    } else {
      this.setState({ isConnected });
    }
  };

  logout = () => {
    const { navigation } = this.props;
    logout().then(res => {
      if (res) {
        navigation.navigate('SignedOut');
      } else {
        alert('Logout error');
      }
    });
  };

  render() {
    const list = [
      {
        id: 1,
        title: 'Terms and conditions',
      },
      {
        id: 2,
        title: 'Third party software list',
      },
      {
        id: 3,
        title: 'Report a problem',
      },
    ];
    const { user, isConnected } = this.state;
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        {!isConnected ? <OfflineNotice /> : null}
        <View
          style={{
            height: 250,
            backgroundColor: 'rgb(248, 248, 248)',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <View style={styles.dpImageHolder}>
            <Image
              source={{ uri: `${user.photoURL}?height=500` }}
              style={styles.profileImage}
              alt
            />
          </View>

          <Text style={styles.usernameStyle}>
            {user.displayName}
          </Text>
        </View>
        <View>
          {list.map(item => (
            <ListItem
              onPress={() => {
                alert(item.title);
              }}
              key={item.id}
              title={item.title}
            />
          ))}
          <ListItem onPress={this.logout} title="Logout" />
        </View>
      </View>
    );
  }
}

Profile.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};
