/* eslint-disable implicit-arrow-linebreak */
import firebase from 'firebase';
import FBSDK from 'react-native-fbsdk';
import { AsyncStorage } from 'react-native';

const { LoginManager } = FBSDK;

const isSignedIn = () =>
  new Promise(resolve => {
    firebase.auth().onAuthStateChanged(user => {
      console.log(user);
      if (user) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  });

const saveInAsyncStorage = async () => {
  try {
    var asyncSave = await AsyncStorage.setItem(
      'whatsMyFoodLogin',
      JSON.stringify(true),
    );
    return true;
  } catch (error) {
    alert('Async store error');
    return false;
  }
};

const getFromAsyncStorage = async () => {
  try {
    const retrievedItem = await AsyncStorage.getItem('whatsMyFoodLogin');
    console.log(`Async store : ${retrievedItem}`);
    return JSON.parse(retrievedItem);
  } catch (error) {
    console.log(`Async store : ${error}`);
    return false;
  }
  return;
};

const getProfileInfo = () => {
  const userObject = firebase.auth().currentUser;
  console.log(userObject);
  const user = {
    displayName: userObject.displayName,
    photoURL: userObject.photoURL,
  };
  return user;
};

const logout = () =>
  new Promise(resolve => {
    LoginManager.logOut();
    firebase
      .auth()
      .signOut()
      .then(() => {
        console.log('logout successful');
        AsyncStorage.setItem('whatsMyFoodLogin', 'false').then(() => {
          resolve(true);
        });
      })
      .catch(error => {
        console.log(`Error while logging out : ${error}`);
        resolve(false);
      });
  });

export {
  isSignedIn,
  getProfileInfo,
  logout,
  saveInAsyncStorage,
  getFromAsyncStorage,
};
