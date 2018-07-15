import firebase from 'firebase';

const isSignedIn = () => new Promise((resolve) => {
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

const logout = () => {
  firebase
    .auth()
    .signOut()
    .then(() => true)
    .catch((error) => {
      console.log(error);
      return false;
    });
};

export { isSignedIn, getProfileInfo, logout };
