import React, { Component } from 'react';
import { StyleSheet, Text, View, Button, StatusBar } from 'react-native';
import { Row, Grid } from 'react-native-easy-grid';
import PropTypes from 'prop-types';

import Header from '../componenets/Header';
import Textbox from '../componenets/Textbox';
// import Imageupload from '../componenets/Imageupload';
import Imageuploader from '../componenets/Imageuploader';

const styles = StyleSheet.create({
  optionalText: {
    padding: 20,
    backgroundColor: 'rgb(249, 249, 249)',
  },
  emoji: {
    padding: 20,
    backgroundColor: 'white',
  },
  optional: {
    color: 'rgb(105, 105, 105)',
    fontSize: 20,
    letterSpacing: 0.5,
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});

export default class Addfood extends Component {
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    return {
      title: "T.G.I. Friday's", // Add restaurant title from props here
      headerStyle: {
        backgroundColor: 'rgb(255, 68, 68)',
        borderBottomWidth: 0,
      },
      headerTintColor: 'white',
      headerTitleStyle: {
        color: 'white',
      },
      headerRight: (
        <Button color="white" title="Save" onPress={() => params.save()} />
      ),
    };
  };

  componentDidMount() {
    const { navigation } = this.props;
    navigation.setParams({ save: this.saveDetails });
  }

  onPress = () => {
    console.log('pressed');
  };

  saveDetails = () => {
    console.log('Save');
  };

  render() {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <Grid>
          <Header text="Add food" />
          <Textbox icon="restaurant-menu" placeholder="Food name" />
          <View style={styles.emoji}>
            <Text style={{ color: 'rgb(105, 105, 105)' }}>
              Pick one of them
            </Text>
            <View style={{ flexDirection: 'row' }}>
              <Text style={{ fontSize: 40, padding: 10 }}>🤢</Text>
              <Text style={{ fontSize: 40, padding: 10 }}>🙅</Text>
              <Text style={{ fontSize: 40, padding: 10 }}>😐</Text>
              <Text style={{ fontSize: 40, padding: 10 }}>👌</Text>
              <Text style={{ fontSize: 40, padding: 10 }}>😍</Text>
            </View>
          </View>
          <View style={styles.optionalText}>
            <Text style={styles.optional}>Optional</Text>
          </View>
          <Row>
            {/* <View> */}
            {/* <Imageupload /> */}
            {/* </View> */}
            <View style={{ flex: 1, padding: 40 }}>
              <Imageuploader upload={this.onPress} />
            </View>
          </Row>
        </Grid>
      </View>
    );
  }
}

Addfood.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};
