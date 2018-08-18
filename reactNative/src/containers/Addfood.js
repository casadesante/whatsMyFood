import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Button,
  StatusBar,
  NativeModules,
} from 'react-native';
import PropTypes from 'prop-types';
import RNFetchBlob from 'react-native-fetch-blob';

import Header from '../components/Header';
import Textbox from '../components/Textbox';
import Imageupload from '../components/Imageupload';
import Imageuploader from '../components/Imageuploader';
import { heightPercentageToDP } from '../lib/Responsive';
import Optional from '../components/Optional';
import EmojiPicker from '../components/EmojiPicker';
var ImagePicker = NativeModules.ImageCropPicker;
import firebase from '../lib/FirebaseClient';

// Prepare Blob support
const [Blob, fs] = [RNFetchBlob.polyfill.Blob, RNFetchBlob.fs];
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
  imageUploaderLayout: {
    display: 'flex',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: heightPercentageToDP('2.97%'),
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

  state = {
    uploaded: false,
    url: '',
    name: '',
    rating: 5,
    uploading: false,
  };

  componentDidMount() {
    const { navigation } = this.props;
    navigation.setParams({ save: this.saveDetails });
  }

  onPress = () => {
    console.log('pressed');
  };

  saveDetails = () => {
    const { restaurantData } = this.props.navigation.state.params;
    restaurantData['food'] = this.state;
    alert(JSON.stringify(restaurantData));
    // console.log('Save');
  };

  selectedEmoji = newRating => {
    this.setState({ rating: newRating });
  };

  uploadImage = (uri, mime = 'application/octet-stream') =>
    new Promise((resolve, reject) => {
      const uploadUri = uri.replace('file://', '');
      let uploadBlob = null;
      const { uid } = firebase.auth().currentUser;
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

  getImage = () => {
    ImagePicker.openPicker({
      cropping: true,
      width: 1920,
      height: 1080,
    })
      .then(response => {
        console.log(response.path);
        this.setState({ uploading: true });
        this.uploadImage(response.path)
          .then(url => {
            this.setState({ uploaded: true, uploading: false, url });
            console.log(url);
          })
          .catch(error => console.log(error));
      })
      .catch(e => alert(e));
  };

  render() {
    const { rating, uploaded, url, uploading } = this.state;
    console.log(`Selected rating: ${rating}`);
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <Header text="Add food" />
        <Textbox
          icon="restaurant-menu"
          placeholder="Food name"
          changeText={name => {
            this.setState({ name });
          }}
          text={this.state.name}
          field="name"
        />
        <EmojiPicker onEmojiSelect={this.selectedEmoji} />
        <Optional />
        <View>
          {uploaded ? (
            <View>
              <Imageupload url={url} />
            </View>
          ) : (
            <View style={styles.imageUploaderLayout}>
              <Imageuploader upload={this.getImage} uploading={uploading} />
            </View>
          )}
        </View>
      </View>
    );
  }
}

Addfood.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};
