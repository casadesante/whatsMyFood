import firebase from 'firebase';

export const isSignedIn = () => {
  return new Promise((resolve, reject) => {
    firebase.auth().onAuthStateChanged(user => {
      console.log(user);
      if (user) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  });
};

export const getProfileInfo = () => {
  const userObject = firebase.auth().currentUser;
  const user = {
    displayName: userObject.displayName,
    photoURL: userObject.photoURL,
  };
  return user;
};

export const logout = () => {
  firebase
    .auth()
    .signOut()
    .then(function() {
      return true;
    })
    .catch(function(error) {
      console.log(error);
      return false;
    });
};
