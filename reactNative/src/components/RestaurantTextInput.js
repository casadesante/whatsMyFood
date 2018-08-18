import React, { Component } from 'react';
import { StyleSheet, View, TextInput, ScrollView, Keyboard } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import RF from 'react-native-responsive-fontsize';
import { GoogleAutoComplete } from 'react-native-google-autocomplete';
import PropTypes from 'prop-types';
import { heightPercentageToDP, widthPercentageToDP } from '../lib/Responsive';
import PlaceSuggestion from './PlaceSuggestion';

const styles = StyleSheet.create({
  dropDownContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  searchSection: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: 'rgb(188, 187, 193)',
    borderBottomWidth: 0.5,
    height: heightPercentageToDP('8%'),
  },
  IconNextToLabel: {
    marginLeft: widthPercentageToDP('4.27%'),
    marginRight: widthPercentageToDP('2.93%'),
  },
  input: {
    flex: 1,
    backgroundColor: 'white',
    color: '#424242',
    fontSize: RF(3.2),
  },
  suggestionScrollBox: {
    maxHeight: heightPercentageToDP('33%'),
  },
});

export default class RestaurantTextInput extends Component {
  state = {
    suggestions: [],
    inputText: '',
  };

  onSelectSuggestedPlace = (placeName, placeID) => {
    console.log(`${placeName} ${placeID}`);
    this.setState({ inputText: placeName, suggestions: [] });
  };

  render() {
    const { changeText } = this.props;
    const { suggestions, inputText } = this.state;


    return (
      <View style={styles.dropDownContainer}>
        <View style={styles.searchSection}>
          <Icon
            name="restaurant"
            style={styles.IconNextToLabel}
            size={RF(3.3)}
            color="rgb(105, 105, 105)"
          />
          <GoogleAutoComplete
            apiKey="AIzaSyDHdH3LF-90nO_OKk16q_8G2x5zLewXDtU"
            minLength={2}
            fetchDetails
          >
            {({
              handleTextChange,
              locationResults,
            }) => (
              <React.Fragment>
                <TextInput
                  style={styles.input}
                  placeholder="Restaurant Name"
                  placeholderTextColor="rgb(144, 144, 144)"
                  onChangeText={((val) => {
                    changeText(val);
                    handleTextChange(val);
                    const googleSuggestions = (val === '') ? [] : locationResults;
                    this.setState(
                      { suggestions: googleSuggestions,
                        inputText: val },
                    );
                  })}
                  value={inputText}
                />
              </React.Fragment>
            )}
          </GoogleAutoComplete>
        </View>

        <ScrollView style={styles.suggestionScrollBox} onPress={() => (Keyboard.dismiss())}>
          {suggestions.map(
            (places) => (
              <PlaceSuggestion
                key={places.id}
                placeID={places.place_id}
                address={places.description}
                placeName={places.structured_formatting.main_text}
                selectPlace={
                  (placeName, placeID) => this.onSelectSuggestedPlace(placeName, placeID)
                }
              />
            ),
          )}
        </ScrollView>


      </View>

    );
  }
}

RestaurantTextInput.propTypes = {
  changeText: PropTypes.func.isRequired,
};
