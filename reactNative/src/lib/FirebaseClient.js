import * as firebase from 'firebase';
import Config from 'react-native-config';

// Initialize Firebase
const firebaseConfig = {
  apiKey: Config.API_KEY,
  authDomain: Config.AUTH_DOMAIN,
  databaseURL: Config.DB_URL,
  storageBucket: Config.STORAGE_BUCKET,
};

export default (!firebase.apps.length
  ? firebase.initializeApp(firebaseConfig)
  : firebase.app());
