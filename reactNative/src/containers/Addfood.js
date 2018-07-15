import React, { Component } from 'react';
import {
  StyleSheet, Text, View, Button, StatusBar,
} from 'react-native';
import { Row, Grid } from 'react-native-easy-grid';
import PropTypes from 'prop-types';

import RF from 'react-native-responsive-fontsize';
import Header from '../componenets/Header';
import Textbox from '../componenets/Textbox';
// import Imageupload from '../componenets/Imageupload';
import Imageuploader from '../componenets/Imageuploader';
import { heightPercentageToDP, widthPercentageToDP } from '../lib/Responsive';
import Optional from '../componenets/Optional';

const styles = StyleSheet.create({
  optionalText: {
    padding: 20,
    backgroundColor: 'rgb(249, 249, 249)',
  },
  emojiPicker: {
    paddingTop: heightPercentageToDP('1.25%'),
    paddingLeft: widthPercentageToDP('4.27%'),
    paddingRight: widthPercentageToDP('4.27%'),
    backgroundColor: 'white',
    borderBottomColor: 'rgb(188, 187, 193)',
    borderBottomWidth: 0.5,
  },
  emojiPickerLabel: {
    color: '#696969',
    fontFamily: 'SFProText-Regular',
    fontSize: RF(2.5),
  },
  emojiList: {
    marginTop: heightPercentageToDP('1.85%'),
    marginBottom: heightPercentageToDP('1.85%'),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  emojiStyle: {
    fontSize: RF(5.5),
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
          <View style={styles.emojiPicker}>
            <Text style={styles.emojiPickerLabel}>
              Pick one of them
            </Text>
            <View style={styles.emojiList}>
              <Text style={styles.emojiStyle}>🤢</Text>
              <Text style={styles.emojiStyle}>🙅</Text>
              <Text style={styles.emojiStyle}>😐</Text>
              <Text style={styles.emojiStyle}>👌</Text>
              <Text style={styles.emojiStyle}>😍</Text>
            </View>
          </View>
          <Optional />
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
