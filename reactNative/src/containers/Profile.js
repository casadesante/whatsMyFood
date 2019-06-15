import React, { Component } from 'react';
// eslint-disable-next-line object-curly-newline
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  Image,
  Linking,
  ActivityIndicator,
  Alert,
  NetInfo } from 'react-native';
import { ListItem } from 'react-native-elements';
import PropTypes from 'prop-types';
import { heightPercentageToDP, widthPercentageToDP } from '../lib/Responsive';
import RF from '../../node_modules/react-native-responsive-fontsize';

import { getProfileInfo, logout } from '../lib/Auth';
import OfflineNotice from '../components/Nointernet';

const styles = StyleSheet.create({
  container: {
    height: heightPercentageToDP('100%'),
    backgroundColor: 'white',
  },
  headerContainer: {
    height: heightPercentageToDP('30%'),
    backgroundColor: 'rgb(248, 248, 248)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ImageShadow: {
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowRadius: 3,
    shadowOpacity: 0.2,
    position: 'absolute',
  },
  profileImage: {
    height: widthPercentageToDP('40%'),
    width: widthPercentageToDP('40%'),
    borderRadius: widthPercentageToDP('40%') / 2,
  },
  usernameStyle: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: RF(3.8),
    margin: heightPercentageToDP('2%'),
  },
  photoHolder: {
    height: widthPercentageToDP('40%'),
    width: widthPercentageToDP('40%'),
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
      email: '',
      firebaseID: 0,
    },
    isConnected: true,
    photoLoaded: false,
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
    getProfileInfo()
      .then(res => {
        const user = {
          firebaseID: res.uid,
          emailID: res.email,
          displayName: res.displayName,
          photoURL: res.photoURL,
        };
        this.setState({ user });
      })
      .catch(err => console.log(err));
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

  logout = () => {
    const { navigation } = this.props;
    logout().then(res => {
      if (res) {
        navigation.navigate('SignedOut');
      } else {
        Alert.alert('Logout error. Please contact through Feedback if the problem persists.');
      }
    });
  };

  showProfilePic = () => {
    this.setState({ photoLoaded: true });
  };

  render() {
    const list = [
      {
        id: 1,
        title: 'Terms and conditions',
      },
      {
        id: 2,
        title: 'Privacy policy',
      },
      {
        id: 3,
        title: 'Feedback / Report a problem',
      },
    ];
    const { navigation } = this.props;
    const { user, isConnected, photoLoaded } = this.state;
    return (
      <View style={styles.container}>
        {!isConnected ? <OfflineNotice /> : null}
        <View style={styles.headerContainer}>
          <View style={styles.photoHolder}>
            <View style={styles.ImageShadow}>
              <Image
                source={{ uri: `${user.photoURL}?height=500` }}
                style={styles.profileImage}
                onLoadEnd={this.showProfilePic}
                alt
              />
            </View>

            {photoLoaded ? null : (
              <View
                style={[
                  styles.profileImage,
                  { justifyContent: 'center', position: 'absolute' },
                ]}
              >
                <ActivityIndicator size="large" color="#BFBFBF" />
              </View>
            )}
          </View>

          <Text style={styles.usernameStyle} numberOfLines={2}>
            {user.displayName}
          </Text>
        </View>
        <View>
          {list.map(item => (
            <ListItem
              onPress={() => {
                switch (item.id) {
                  case 1:
                    Linking.openURL('https://wmftermsandcond.glitch.me/');
                    break;

                  case 2:
                    Linking.openURL('https://wmfprivacypolicy.glitch.me/');
                    break;

                  case 3:
                    navigation.navigate('Feedback', { user });
                    break;

                  default:
                    console.log(`Option ${item.title} doesn't exist`);
                    break;
                }
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
