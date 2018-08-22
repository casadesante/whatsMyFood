import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
  Keyboard,
  ScrollView,
} from 'react-native';
import RNFetchBlob from 'react-native-fetch-blob';
import * as ImagePicker from 'react-native-image-picker';
import PropTypes from 'prop-types';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';

import RF from 'react-native-responsive-fontsize';
import Header from '../components/Header';
import Textbox from '../components/Textbox';
import firebase from '../lib/FirebaseClient';
import Imageupload from '../components/Imageupload';
import Imageuploader from '../components/Imageuploader';
import { widthPercentageToDP, heightPercentageToDP } from '../lib/Responsive';
import Optional from '../components/Optional';

// Prepare Blob support
const [Blob, fs] = [RNFetchBlob.polyfill.Blob, RNFetchBlob.fs];
window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
window.Blob = Blob;

const styles = StyleSheet.create({
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

export default class EditRestaurant extends Component {
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
      headerTintColor: 'white',
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
    name: '',
    location: '',
  };

  componentDidMount() {
    const { navigation } = this.props;
    navigation.setParams({ save: this.saveRestaurantForm });
    /* eslint no-underscore-dangle: */
    this._navListener = navigation.addListener('didFocus', () => {
      StatusBar.setBarStyle('light-content');
    });
  }

  componentWillUnmount() {
    this._navListener.remove();
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

  saveRestaurantForm = () => {
    const { navigation } = this.props;
    // alert(JSON.stringify(this.state));
    navigation.navigate('Restaurant', { restaurantData: this.state });
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

  render() {
    const { uploaded, url, name, location } = this.state;
    return (
      <View style={styles.container}>
        <Header text="Edit restaurant" />
        {/* <KeyboardAwareScrollView */}
        {/* scrollEnabled={false} */}
        {/* onPress={Keyboard.dismiss()} */}
        {/* > */}
        <Textbox
          icon="restaurant"
          placeholder="Restaurant name"
          changeText={inputName => {
            this.setState({ name: inputName });
          }}
          text={name}
          field="name"
        />
        <Optional />
        {/* Location must be fetched from google places or something */}
        <Textbox
          icon="location"
          placeholder="Restaurant location"
          changeText={inputLocation => {
            this.setState({ location: inputLocation });
          }}
          text={location}
          field="location"
        />
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
        {/* </KeyboardAwareScrollView> */}
      </View>
    );
  }
}

EditRestaurant.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};
