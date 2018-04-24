import React, { Component } from 'react';
import { StyleSheet, Text, View, Button, StatusBar } from 'react-native';
import { Row, Grid } from 'react-native-easy-grid';

import Header from '../componenets/Header';
import Textbox from '../componenets/Textbox';
import Imageupload from '../componenets/Imageupload';
import Imageuploader from '../componenets/Imageuploader';

const styles = StyleSheet.create({
  optionalText: {
    padding: 20,
    backgroundColor: 'rgb(249, 249, 249)',
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

export default class Newentry extends Component {
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    return {
      headerStyle: {
        backgroundColor: 'rgb(255, 68, 68)',
      },
      headerTitleStyle: {
        color: 'white',
      },
      headerRight: (
        <Button color="white" title="Save" onPress={() => params.save()} />
      ),
    };
  };

  onPress = () => {
    alert('pressed');
  };

  saveDetails = () => {
    alert('Save');
  };

  componentDidMount() {
    this.props.navigation.setParams({ save: this.saveDetails });
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <Grid>
          <Header text="Add food" />
          <Textbox icon="restaurant" placeholder="Food name" />
          <View style={styles.optionalText}>
            <Text style={styles.optional}>Optional</Text>
          </View>
          <Textbox icon="location" placeholder="Restaurant location" />
          <Row>
            {/*<View>*/}
            {/*<Imageupload />*/}
            {/*</View>*/}
            <View style={{ flex: 1, padding: 40 }}>
              <Imageuploader upload={this.onPress} />
            </View>
          </Row>
        </Grid>
      </View>
    );
  }
}
