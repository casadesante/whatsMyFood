import React, { Component } from 'react';
import { StyleSheet,
  View,
  Button,
  StatusBar,
  NativeModules,
  ActivityIndicator,
  Modal,
  Alert } from 'react-native';
import PropTypes from 'prop-types';
import RNFetchBlob from 'rn-fetch-blob';
import uuidv4 from 'uuid/v4';

import Header from '../components/Header';
import Textbox from '../components/Textbox';
import Imageupload from '../components/Imageupload';
import Imageuploader from '../components/Imageuploader';
import { heightPercentageToDP, widthPercentageToDP } from '../lib/Responsive';
import Optional from '../components/Optional';
import EmojiPicker from '../components/EmojiPicker';
import firebase from '../lib/FirebaseClient';

const ImagePicker = NativeModules.ImageCropPicker;

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
  modalContents: {
    height: heightPercentageToDP('100%'),
    width: widthPercentageToDP('100%'),
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderContainer: {
    height: widthPercentageToDP('25%'),
    width: widthPercentageToDP('25%'),
    backgroundColor: 'white',
    borderRadius: widthPercentageToDP('2%'),
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default class EditFood extends Component {
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    return {
      title: params.restaurantName,
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

  constructor(props) {
    super(props);

    const { navigation } = props;

    const item = navigation.getParam('item');
    this.state = {
      uploaded: !(item.img === '' || item.img == null),
      url: item.img || '',
      name: item.name || '',
      rating: item.rating || '',
      uploading: false,
      modalVisible: false,
    };
  }

  componentDidMount() {
    const { navigation } = this.props;
    const { restaurantName } = navigation.state.params.item;
    navigation.setParams({ save: this.saveDetails, restaurantName });
    /* eslint no-underscore-dangle: */
    this._navListener = navigation.addListener('didFocus', () => {
      StatusBar.setBarStyle('light-content');
    });
  }

  componentWillUnmount() {
    this._navListener.remove();
  }

  cancelImage = () => {
    this.setState({ uploaded: false, uploading: false, url: '' });
  };

  saveDetails = () => {
    const { navigation } = this.props;
    const { firebaseID, createdAt, id: foodID, restaurantID } = this.props.navigation.state.params.item;

    const { name: foodName, url: foodPhotoURL, rating } = this.state;

    const foodObject = {
      foodID,
      foodName,
      rating,
      restaurantID,
      firebaseID,
      foodPhotoURL,
      createdAt,
    };

    if (foodName.length !== 0) {
      this.setState({ modalVisible: true });
      fetch('https://us-central1-whatsmyfood.cloudfunctions.net/updateFood', {
        method: 'POST',
        body: JSON.stringify(foodObject),
      })
        .then((editedFoodResponse) => {
          if (editedFoodResponse.status === 200) {
            return editedFoodResponse.json();
          }
          throw editedFoodResponse;
        })
        .then((restaurant) => {
          this.setState({ modalVisible: false });
          navigation.navigate('Restaurant', { restaurant, parentPage: 'Back' });
        })
        .catch(err => {
          if (err._bodyText) {
            Alert.alert(
              'Error',
              err._bodyText,
              [{ text: 'OK',
                onPress: () => {
                  this.setState({ modalVisible: false });
                } }],
            );
          } else {
            Alert.alert(
              'Something went wrong. Please report this error.',
              null,
              [{ text: 'OK',
                onPress: () => {
                  this.setState({ modalVisible: false });
                } }],
            );
          }
          console.log(`Error encountered while adding food: ${JSON.stringify(err)}`);
        });
    } else {
      Alert.alert('Food name cannot be empty');
    }
  };

  selectedEmoji = newRating => {
    this.setState({ rating: newRating });
  };

  uploadImage = (uri, mime = 'application/octet-stream') => new Promise((resolve, reject) => {
    const uploadUri = uri.replace('file://', '');
    let uploadBlob = null;
    const uniqueID = uuidv4();
    const { uid } = firebase.auth().currentUser;
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

  getImage = (pickValue) => {
    ImagePicker[pickValue]({
      cropping: true,
      width: 1920,
      height: 1080,
    })
      .then(response => {
        this.setState({ uploading: true, modalVisible: true });
        this.uploadImage(response.path)
          .then(url => {
            this.setState({ uploaded: true, modalVisible: false, uploading: false, url });
          })
          .catch(error => {
            this.setState({ uploaded: false, modalVisible: false, uploading: false });
            console.log(error);
          });
      })
      .catch(e => console.log(e));
  };

  render() {
    const { rating, uploaded, url, uploading, name, modalVisible } = this.state;
    return (
      <View style={styles.container}>
        <Header text="Edit food" />
        <Textbox
          icon="restaurant-menu"
          placeholder="Food name"
          changeText={nameInput => {
            this.setState({ name: nameInput });
          }}
          text={name}
          field="name"
        />
        <EmojiPicker rating={rating} onEmojiSelect={this.selectedEmoji} />
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
        <Modal
          animationType="fade"
          transparent
          visible={modalVisible}
        >
          <View style={styles.modalContents}>
            <View style={styles.loaderContainer}>
              <ActivityIndicator
                size="large"
                color="#FF4444"
                style={styles.activityIndicator}
              />
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

EditFood.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};
