import firebase from 'firebase';

export const isSignedIn = () => {
  firebase.auth().onAuthStateChanged((user) => {
    if(user) {
      console.log('logged in');
      return true;
    } else {
      console.log('not logged in');
      return false;
    }
  });
};
