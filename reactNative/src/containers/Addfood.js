import React, { Component } from 'react';
import { StyleSheet,
  View,
  Button,
  StatusBar,
  NativeModules,
  Alert,
  Modal,
  ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';
import RNFetchBlob from 'rn-fetch-blob';
import uuidv4 from 'uuid/v4';
import { StackActions, NavigationActions } from 'react-navigation';

import Header from '../components/Header';
import Textbox from '../components/Textbox';
import Imageupload from '../components/Imageupload';
import Imageuploader from '../components/Imageuploader';
import { heightPercentageToDP, widthPercentageToDP } from '../lib/Responsive';
import Optional from '../components/Optional';
import EmojiPicker from '../components/EmojiPicker';
import firebase from '../lib/FirebaseClient';
import { getProfileInfo } from '../lib/Auth';

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

export default class Addfood extends Component {
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    return {
      title: params.restaurantName, // Add restaurant title from props here
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
    modalVisible: false,
  };

  componentDidMount() {
    const { navigation } = this.props;
    const { name } = navigation.state.params.restaurantData;
    navigation.setParams({ save: this.saveDetails, restaurantName: name });
    /* eslint no-underscore-dangle: */
    this._navListener = navigation.addListener('didFocus', () => {
      StatusBar.setBarStyle('light-content');
    });
  }

  componentWillUnmount() {
    this._navListener.remove();
  }

  onPress = () => {
    console.log('pressed');
  };

  cancelImage = () => {
    this.setState({ uploaded: false, uploading: false, url: '' });
  };

  saveDetails = () => {
    const { restaurantData } = this.props.navigation.state.params;
    const { name, url, rating } = this.state;

    if (name.length !== 0) {
      getProfileInfo()
        .then(user => user.uid)
        .then(firebaseID => {
          if (restaurantData.addNewRestaurant) {
            const restaurantAndFood = {
              firebaseID,
              googlePlacesID: restaurantData.placeID,
              restaurantName: restaurantData.name,
              formattedAddress: restaurantData.address,
              restaurantPhotoURL: restaurantData.url,
              food: {
                foodName: name,
                foodPhotoURL: url,
                rating,
              },
            };
            this.addNewRestaurantAndFood(restaurantAndFood);
          } else {
            const addFoodDetails = {
              firebaseID,
              foodName: name,
              foodPhotoURL: url,
              rating,
              restaurantID: restaurantData.restaurantID,
            };
            this.addNewFoodToRestaurant(addFoodDetails);
          }
        })
        .catch(err => {
          Alert.alert('Error encountered while fetching user profile');
          console.log(`Error encountered while fetching user profile: ${err}`);
        });
    } else {
      Alert.alert('Food name cannot be empty');
    }
  }

  addNewRestaurantAndFood = (restaurantAndFood) => {
    const { navigation } = this.props;
    this.setState({ modalVisible: true });
    fetch('https://us-central1-whatsmyfood.cloudfunctions.net/addRestaurantAndFood',
      {
        method: 'POST',
        body: JSON.stringify(restaurantAndFood),
      })
      .then(restaurantAndFoodAdded => {
        if (restaurantAndFoodAdded.status === 200) {
          return restaurantAndFoodAdded.json();
        }
        throw new Error({ message: 'add restaurant and food error' });
      })
      .then((restaurantObject) => {
        this.getRestaurant(restaurantObject, 'addNewRestaurantAndFood');
      })
      .catch(err => {
        this.setState({ modalVisible: false });
        Alert.alert('Error encountered while adding new restaurant and its food');
        console.log(`Error encountered while adding new restaurant and its food: ${err}`);
      });
  }

  addNewFoodToRestaurant = (addFoodDetails) => {
    this.setState({ modalVisible: true });
    fetch('https://us-central1-whatsmyfood.cloudfunctions.net/addFood',
      {
        method: 'POST',
        body: JSON.stringify(addFoodDetails),
      })
      .then(addFoodApiResponse => {
        if (addFoodApiResponse.status === 200) {
          return addFoodApiResponse.json();
        }
        throw addFoodApiResponse;
      })
      .then((restaurantObject) => {
        this.setState({ modalVisible: false });
        this.getRestaurant(restaurantObject, 'addNewFoodToRestaurant');
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
            'Error encountered while adding food.',
            null,
            [{ text: 'OK',
              onPress: () => {
                this.setState({ modalVisible: false });
              } }],
          );
        }
        console.log(`Error encountered while adding food: ${JSON.stringify(err)}`);
      });
  }

  getRestaurant = (restaurant, navigatedFrom) => {
    this.setState({ modalVisible: false });
    const { navigation } = this.props;
    if (navigatedFrom === 'addNewRestaurantAndFood') {
      const resetAction = StackActions.reset({
        index: 1,
        actions: [
          NavigationActions.navigate({ routeName: 'Newentry' }),
          NavigationActions.navigate({ routeName: 'Restaurant', params: { restaurant, parentPage: 'Home', navigatedFrom } })],
      });
      navigation.dispatch(resetAction);
    } else {
      navigation.navigate('Restaurant', { restaurant, parentPage: 'Back', navigatedFrom });
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

  showModal = (visibility) => {
    this.setState({ modalVisible: visibility });
  }

  render() {
    const { rating, uploaded, url, uploading, name, modalVisible } = this.state;
    console.log(`Selected rating: ${rating}`);
    return (
      <View style={styles.container}>
        <Header text="Add food" />
        <Textbox
          icon="restaurant-menu"
          placeholder="Food name"
          changeText={nameInput => {
            this.setState({ name: nameInput });
          }}
          text={name}
          field="name"
        />
        <EmojiPicker onEmojiSelect={this.selectedEmoji} />
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

Addfood.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};
