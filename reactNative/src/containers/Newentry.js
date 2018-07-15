import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
  Keyboard,
} from 'react-native';
import Config from 'react-native-config';
import RNFetchBlob from 'react-native-fetch-blob';
import * as ImagePicker from 'react-native-image-picker';
import PropTypes from 'prop-types';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';

import RF from 'react-native-responsive-fontsize';
import Header from '../componenets/Header';
import Textbox from '../componenets/Textbox';
import firebase from '../lib/FirebaseClient';
import Imageupload from '../componenets/Imageupload';
import Imageuploader from '../componenets/Imageuploader';
import { widthPercentageToDP, heightPercentageToDP } from '../lib/Responsive';

// Prepare Blob support
const [Blob, fs] = [RNFetchBlob.polyfill.Blob, RNFetchBlob.fs];
window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
window.Blob = Blob;

const styles = StyleSheet.create({
  optionalText: {
    paddingLeft: widthPercentageToDP('4.27%'),
    paddingTop: heightPercentageToDP('1.85%'),
    paddingBottom: heightPercentageToDP('1.85%'),
    backgroundColor: 'rgb(249, 249, 249)',
  },
  optional: {
    color: 'rgb(105, 105, 105)',
    fontSize: RF(3.2),
    letterSpacing: 0.5,
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  imageUploaderLayout: {
    display: 'flex',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: heightPercentageToDP('2.97%'),
  },
});

const options = {
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
        borderBottomWidth: 0,
      },
      headerTitleStyle: {
        color: 'white',
      },
      headerBackTitle: 'Back',
      headerRight: (
        <TouchableOpacity onPress={() => params.save()}>
          <Text
            style={{
              fontSize: RF(3),
              color: '#FFFFFF',
              paddingRight: widthPercentageToDP('2.7%'),
            }}
          >
            Save
          </Text>
        </TouchableOpacity>
      ),
    };
  };

  state = {
    uploaded: false,
    url: '',
  };

  componentDidMount() {
    const { navigation } = this.props;
    navigation.setParams({ save: this.saveDetails });
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
            this.setState({ uploaded: true, url });
            console.log(url);
          })
          .catch(error => console.log(error));
      }
    });
  };

  saveDetails = () => {
    const { navigation } = this.props;
    navigation.navigate('Addfood');
  };

  uploadImage = (uri, mime = 'application/octet-stream') => new Promise((resolve, reject) => {
    const uploadUri = uri.replace('file://', '');
    let uploadBlob = null;
    const { uid } = user;

    const user = firebase.auth().currentUser;
    console.log(uid);
    const imageRef = firebase.storage().ref(`${uid}/images/image001.jpg`);

    fs
      .readFile(uploadUri, 'base64')
      .then(data => Blob.build(data, { type: `${mime};BASE64` }))
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

  render() {
    const { uploaded, url } = this.state;
    console.log(Config);
    console.log(uploaded);
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <Header text="Add restaurant" />
        <KeyboardAwareScrollView scrollEnabled={false} onPress={Keyboard.dismiss()}>
          <Textbox icon="restaurant" placeholder="Restaurant name" />
          <View style={styles.optionalText}>
            <Text style={styles.optional}>Optional</Text>
          </View>
          <Textbox icon="location" placeholder="Restaurant location" />
          <View>
            {uploaded ? (
              <View>
                <Imageupload url={url} />
              </View>
            ) : (
              <View style={styles.imageUploaderLayout}>
                <Imageuploader upload={this.getImage} />
              </View>
            )}
          </View>
        </KeyboardAwareScrollView>
      </View>
    );
  }
}

Newentry.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};
