import React, { Component } from 'react';
import { GoogleAutoComplete } from 'react-native-google-autocomplete';

import {
  StyleSheet,
  Text,
  TextInput,
  ScrollView,
  View,
  Image,
} from 'react-native';

export default class Search extends Component {
  render() {
    return (
      <View style={styles.container}>
        <GoogleAutoComplete
          apiKey="AIzaSyDHdH3LF-90nO_OKk16q_8G2x5zLewXDtU"
          debounce={300}
        >
          {({
            inputValue,
            handleTextChange,
            locationResults,
            fetchDetails,
          }) => (
            <React.Fragment>
              {console.log(locationResults)}
              {console.log(fetchDetails)}
              <TextInput
                style={{
                  height: 40,
                  width: 300,
                  borderWidth: 1,
                  paddingHorizontal: 16,
                }}
                value={inputValue}
                onChangeText={handleTextChange}
                placeholder="Location..."
              />
            </React.Fragment>
          )}
        </GoogleAutoComplete>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 100,
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
