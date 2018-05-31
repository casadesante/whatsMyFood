import React, { Component } from 'react';
import { StyleSheet, Text, View, StatusBar, Image } from 'react-native';
import { Row, Grid } from 'react-native-easy-grid';
import { ListItem } from 'react-native-elements';

export default class Profile extends Component {
  static navigationOptions = {
    title: 'Profile',
    headerStyle: {
      backgroundColor: 'rgb(248, 248, 248)',
    },
  };
  render() {
    const list = [
      {
        title: 'Terms and conditions',
      },
      {
        title: 'Third party software list',
      },
      {
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
          {list.map((item, i) => (
            <ListItem
              onPress={() => {
                alert(item.title);
              }}
              key={i}
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
