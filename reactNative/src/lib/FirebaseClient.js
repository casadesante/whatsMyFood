import * as firebase from 'firebase';

// Initialize Firebase
const firebaseConfig = {
  apiKey: 'AIzaSyCaWFdW61qcpy-LAtdYJnSlJEuiqgkPegs',
  authDomain: 'whatsmyfood.firebaseio.com',
  databaseURL: 'https://whatsmyfood.firebaseio.com',
  storageBucket: 'gs://whatsmyfood.appspot.com/images',
};

export default (!firebase.apps.length
  ? firebase.initializeApp(config)
  : firebase.app());
