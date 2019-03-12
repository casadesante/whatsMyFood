import React, { Component } from 'react';
import { StyleSheet,
  View,
  Button,
  StatusBar,
  NativeModules,
  Alert } from 'react-native';
import PropTypes from 'prop-types';
import RNFetchBlob from 'react-native-fetch-blob';
import uuidv4 from 'uuid/v4';

import Header from '../components/Header';
import Textbox from '../components/Textbox';
import Imageupload from '../components/Imageupload';
import Imageuploader from '../components/Imageuploader';
import { heightPercentageToDP } from '../lib/Responsive';
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
        Alert.alert('Error encountered while adding new restaurant and its food');
        console.log(`Error encountered while adding new restaurant and its food: ${err}`);
      });
  }

  addNewFoodToRestaurant = (addFoodDetails) => {
    fetch('https://us-central1-whatsmyfood.cloudfunctions.net/addFood',
      {
        method: 'POST',
        body: JSON.stringify(addFoodDetails),
      })
      .then(foodAdded => {
        if (foodAdded.status === 200) {
          return foodAdded.json();
        }
        throw new Error({ message: 'add food error' });
      })
      .then((restaurantObject) => {
        this.getRestaurant(restaurantObject, 'addNewFoodToRestaurant');
      })
      .catch(err => {
        Alert.alert('Error encountered while adding new food');
        console.log(`Error encountered while adding new food: ${err}`);
      });
  }

  getRestaurant = (restaurant, navigatedFrom) => {
    const { navigation } = this.props;
    console.log(navigation);
    navigation.navigate('Restaurant', { restaurant, parentPage: 'Home', navigatedFrom }); // parentPage must be dynamic. Change parentpage string based on stack.
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

  render() {
    const { rating, uploaded, url, uploading, name } = this.state;
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
      </View>
    );
  }
}

Addfood.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};
