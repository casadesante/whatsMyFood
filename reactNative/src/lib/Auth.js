import firebase from 'firebase';

export const isSignedIn = () => {
  return new Promise((resolve, reject) => {
    firebase.auth().onAuthStateChanged((user) => {
      if(user) {
        resolve(true);
      }
      else {
        resolve(false);
      }
    });
  });
};
