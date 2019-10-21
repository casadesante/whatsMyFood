import firebase from 'react-native-firebase';
import Config from 'react-native-config';

// Initialize Firebase
const config = {
  apiKey: Config.API_KEY,
  authDomain: Config.AUTH_DOMAIN,
  databaseURL: Config.DB_URL,
  storageBucket: 'gs://whatsmyfood.appspot.com',
};

export default firebase.initializeApp(config)
