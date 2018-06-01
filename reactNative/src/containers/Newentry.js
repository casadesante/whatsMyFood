import React, { Component } from 'react';
import { StyleSheet, Text, View, Button, StatusBar } from 'react-native';
import { Row, Grid } from 'react-native-easy-grid';
import Config from 'react-native-config';

import Header from '../componenets/Header';
import Textbox from '../componenets/Textbox';
import firebase from '../lib/FirebaseClient';
import Imageupload from '../componenets/Imageupload';
import Imageuploader from '../componenets/Imageuploader';

import RNFetchBlob from 'react-native-fetch-blob';

var ImagePicker = require('react-native-image-picker');

// Prepare Blob support
const Blob = RNFetchBlob.polyfill.Blob;
const fs = RNFetchBlob.fs;
window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
window.Blob = Blob;

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

var options = {
  title: 'Select Avatar',
  customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
};

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
      headerBackTitle: 'Back',
      headerRight: (
        <Button color="white" title="Save" onPress={() => params.save()} />
      ),
    };
  };

  state = {
    uploaded: false,
    url: '',
  };

  uploadImage(uri, mime = 'application/octet-stream') {
    return new Promise((resolve, reject) => {
      const uploadUri = uri.replace('file://', '');
      let uploadBlob = null;

      const user = firebase.auth().currentUser;
      const imageRef = firebase
        .storage()
        .ref(user + '/images/')
        .child('image_001');

      fs
        .readFile(uploadUri, 'base64')
        .then(data => {
          return Blob.build(data, { type: `${mime};BASE64` });
        })
        .then(blob => {
          uploadBlob = blob;
          return imageRef.put(blob, { contentType: mime });
        })
        .then(() => {
          uploadBlob.close();
          return imageRef.getDownloadURL();
        })
        .then(url => {
          resolve(url);
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  getImage = () => {
    ImagePicker.showImagePicker(options, response => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        console.log(response.uri);
        this.uploadImage(response.uri)
          .then(url => {
            this.setState({ uploaded: true, url: url });
            console.log(url);
          })
          .catch(error => console.log(error));
      }
    });
  };

  saveDetails = () => {
    this.props.navigation.navigate('Addfood');
  };

  componentDidMount() {
    this.props.navigation.setParams({ save: this.saveDetails });
  }

  render() {
    console.log(Config);
    console.log(this.state.uploaded);
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <Grid>
          <Header text="Add restaurant" />
          <Textbox icon="restaurant" placeholder="Restaurant name" />
          <View style={styles.optionalText}>
            <Text style={styles.optional}>Optional</Text>
          </View>
          <Textbox icon="location" placeholder="Restaurant location" />
          <Row>
            {this.state.uploaded ? (
              <View>
                <Imageupload url={this.state.url} />
              </View>
            ) : (
              <View style={{ flex: 1, padding: 40 }}>
                <Imageuploader upload={this.getImage} />
              </View>
            )}
          </Row>
        </Grid>
      </View>
    );
  }
}
