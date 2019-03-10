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
import uuidv4 from 'uuid/v4';
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

export default class EditRestaurant extends Component {
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    return {
      headerStyle: {
        backgroundColor: 'rgb(255, 68, 68)',
        borderBottomWidth: 0,
      },
      headerTintColor: 'white',
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

  constructor(props) {
    super(props);

    const { navigation } = props;
    const restaurantData = navigation.getParam('restaurantData');

    console.log(restaurantData);

    this.state = {
      uploaded: !!restaurantData.restaurantPhotoURL,
      url: restaurantData.restaurantPhotoURL || '',
      restaurantID: restaurantData.restaurantID,
      createdAt: restaurantData.createdAt,
      restaurantDetails: {
        inputText: restaurantData.restaurantName || '',
        address: restaurantData.formattedAddress || '',
        placeID: restaurantData.googlePlacesID || '',
      },
      isConnected: true,
      uploading: false,
    };
  }

  componentDidMount() {
    const { navigation } = this.props;
    NetInfo.isConnected.addEventListener(
      'connectionChange',
      this.handleConnectivityChange,
    );
    navigation.setParams({ save: this.saveRestaurantForm });
    /* eslint no-underscore-dangle: */
    this._navListener = navigation.addListener('didFocus', () => {
      StatusBar.setBarStyle('light-content');
    });
  }

  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener(
      'connectionChange',
      this.handleConnectivityChange,
    );
    this._navListener.remove();
  }

  getImage = (pickValue) => {
    ImagePicker[pickValue]({
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
      .catch(e => console.log(e));
  };

  cancelImage = () => {
    this.setState({ uploaded: false, uploading: false, url: '' });
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
    const { url, restaurantDetails, createdAt, restaurantID } = this.state;
    /* eslint no-prototype-builtins: */
    if (
      restaurantDetails.hasOwnProperty('inputText')
      && restaurantDetails.inputText.length !== 0
    ) {
      const restaurantObject = {
        restaurantID,
        googlePlacesID: restaurantDetails.placeID,
        formattedAddress: restaurantDetails.address,
        restaurantName: restaurantDetails.inputText,
        restaurantPhotoURL: url,
        createdAt,
      };
      console.log(restaurantObject);
      fetch('https://us-central1-whatsmyfood.cloudfunctions.net/updateRestaurant',
        { method: 'POST', body: JSON.stringify(restaurantObject) } )
        .then((editedRestaurantResponse) => {
          editedRestaurantResponse.status === 200
            ? navigation.navigate('Home')
            : alert(editedRestaurantResponse.body);
        })
        .catch(err => alert(err));
    } else {
      alert('Name cannot be empty');
    }
  };

  uploadImage = (uri, mime = 'application/octet-stream') => new Promise((resolve, reject) => {
    const uploadUri = uri.replace('file://', '');
    let uploadBlob = null;
    const uniqueID = uuidv4();
    const { uid } = firebase.auth().currentUser;
    console.log(uid);
    const imageRef = firebase.storage().ref(`${uid}/images/${uniqueID}.jpg`);

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
      restaurantDetails,
      uploading,
      isConnected,
    } = this.state;

    const { inputText: name, address: location } = restaurantDetails;

    return (
      <TouchableWithoutFeedback
        onPress={() => {
          DismissKeyboard();
        }}
      >
        <View style={styles.container}>
          {!isConnected ? <OfflineNotice /> : null}
          <Header text="Edit restaurant" />
          <RestaurantTextInput
            changeText={restaurantDetails => {
              this.setState({ restaurantDetails });
            }}
            text={name}
            field="name"
            location={location}
          />
          <Optional />
          <View>
            {uploaded ? (
              <View style={styles.imageUploaderLayout}>
                <Imageupload url={url} cancel={this.cancelImage} />
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

EditRestaurant.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};
