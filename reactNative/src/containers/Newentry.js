import React, { Component } from 'react';
import { StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StatusBar,
  NativeModules,
  NetInfo } from 'react-native';

import RNFetchBlob from 'react-native-fetch-blob';
import PropTypes from 'prop-types';
/* eslint import/no-unresolved: */
import DismissKeyboard from 'dismissKeyboard';
import RF from 'react-native-responsive-fontsize';
import Header from '../components/Header';
import firebase from '../lib/FirebaseClient';
import Imageupload from '../components/Imageupload';
import Imageuploader from '../components/Imageuploader';
import OfflineNotice from '../components/Nointernet';
import { widthPercentageToDP, heightPercentageToDP } from '../lib/Responsive';
import Optional from '../components/Optional';
import RestaurantTextInput from '../components/RestaurantTextInput';

const ImagePicker = NativeModules.ImageCropPicker;

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
    name: '',
    location: '',
    isConnected: true,
    uploading: false,
  };

  componentDidMount() {
    const { navigation } = this.props;
    NetInfo.isConnected.addEventListener(
      'connectionChange',
      this.handleConnectivityChange,
    );
    navigation.setParams({ save: this.saveRestaurantForm });
  }

  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener(
      'connectionChange',
      this.handleConnectivityChange,
    );
  }

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

  handleConnectivityChange = isConnected => {
    if (isConnected) {
      this.setState({ isConnected });
    } else {
      this.setState({ isConnected });
    }
  };

  saveRestaurantForm = () => {
    const { navigation } = this.props;
    // alert(JSON.stringify(this.state));
    navigation.navigate('Addfood', { restaurantData: this.state });
  };

  uploadImage = (uri, mime = 'application/octet-stream') => new Promise((resolve, reject) => {
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
    const {
      uploaded,
      url,
      name,
      location,
      uploading,
      isConnected,
    } = this.state;

    return (
      <TouchableWithoutFeedback onPress={() => { DismissKeyboard(); }}>
        <View style={styles.container}>
          <StatusBar barStyle="light-content" />
          {!isConnected ? <OfflineNotice /> : null}
          <Header text="Add restaurant" />
          <RestaurantTextInput
            changeText={inputName => {
              this.setState({ name: inputName });
            }}
            text={name}
            field="name"
          />
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
      </TouchableWithoutFeedback>
    );
  }
}

Newentry.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};
