import firebase from 'firebase';

const isSignedIn = () => new Promise((resolve) => {
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      resolve(true);
    } else {
      resolve(false);
    }
  });
});

export default isSignedIn;
