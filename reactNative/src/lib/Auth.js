/* eslint-disable implicit-arrow-linebreak */
import firebase from 'react-native-firebase';
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
    await AsyncStorage.setItem(
      'whatsMyFoodLogin',
      JSON.stringify(true),
    );
    return true;
  } catch (error) {
    console.log('Async store error');
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
};

const getProfileInfo = () => new Promise((resolve, reject) => {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      user === null
        ? reject(new Error('Hmmm, seems like a problem at our end. Sorry ! '))
        : resolve(user);
    } else {
      reject(new Error('Unable to fetch data from fb ! '));
    }
  });
});

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
