import React, { Component } from 'react';
import { StyleSheet, Text, View, StatusBar, Image } from 'react-native';
import { ListItem } from 'react-native-elements';

export default class Profile extends Component {
  static navigationOptions = {
    title: 'Profile',
    headerStyle: {
      backgroundColor: 'rgb(248, 248, 248)',
      borderBottomWidth: 0,
    },
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
            source={require('../assets/img/profile.jpg')}
            style={styles.profileImage}
          />
          <Text style={{ fontWeight: 'bold', fontSize: 30, marginTop: 20 }}>
            Jane Austen
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
