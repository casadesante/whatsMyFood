/* eslint-disable implicit-arrow-linebreak */
import firebase from 'firebase';
import FBSDK from 'react-native-fbsdk';

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

const getProfileInfo = () => {
  const userObject = firebase.auth().currentUser;
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
        resolve(true);
      })
      .catch(error => {
        console.log(`Error while logging out : ${error}`);
        resolve(false);
      });
  });

export { isSignedIn, getProfileInfo, logout };
