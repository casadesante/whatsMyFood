import React, { Component } from 'react';
// eslint-disable-next-line object-curly-newline
import { StyleSheet, Text, View, StatusBar, Image } from 'react-native';
import { ListItem } from 'react-native-elements';

import PropTypes from 'prop-types';
import { getProfileInfo, logout } from '../lib/Auth';

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
      displayName: '',
      photoURL: '',
    },
  };

  componentDidMount = () => {
    const user = getProfileInfo();
    this.setState({ user });
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
    // const logoutSuccess = logout();
    // console.log(`logoutSuccess : ${logoutSuccess}`);
    // logoutSuccess ? navigation.navigate('Signin') : console.log('error');
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
    const { user } = this.state;
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <View
          style={{
            height: 250,
            backgroundColor: 'rgb(248, 248, 248)',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Image
            source={{ uri: `${user.photoURL}?height=500` }}
            style={styles.profileImage}
          />
          <Text style={{ fontWeight: 'bold', fontSize: 30, marginTop: 20 }}>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  profileImage: {
    height: 100,
    width: 100,
    borderRadius: 50,
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
});

Profile.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};
