import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  Text,
  ScrollView,
  Keyboard,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import RF from 'react-native-responsive-fontsize';
import { GoogleAutoComplete } from 'react-native-google-autocomplete';
import PropTypes from 'prop-types';
import Config from 'react-native-config';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
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
  addressBar: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: 'rgb(188, 187, 193)',
    borderBottomWidth: 0.5,
    minHeight: heightPercentageToDP('8%'),
    maxHeight: heightPercentageToDP('30%'),
    paddingTop: heightPercentageToDP('1%'),
    paddingBottom: heightPercentageToDP('1%'),
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
  addressStyle: {
    width: widthPercentageToDP('82%'),
    backgroundColor: 'white',
    color: 'rgb(105, 105, 105)',
    fontSize: RF(2.4),
  },
  suggestionScrollBox: {
    maxHeight: heightPercentageToDP('100%'),
  },
});

export default class RestaurantTextInput extends Component {
  state = {
    suggestions: [],
    inputText: '',
    address: '',
    placeID: '',
  };

  onSelectSuggestedPlace = (placeName, addressDetails, placeID) => {
    const { changeText } = this.props;
    this.setState(
      {
        inputText: placeName,
        suggestions: [],
        address: addressDetails,
        placeID,
      },
      () => {
        changeText(this.state);
      },
    );
  };

  render() {
    const { changeText } = this.props;
    const { suggestions, inputText, address, placeID } = this.state;

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
            apiKey={Config.AUTO_COMPLETE_API_KEY}
            minLength={2}
            fetchDetails
          >
            {({ handleTextChange, locationResults }) => (
              <React.Fragment>
                <TextInput
                  style={styles.input}
                  placeholder="Restaurant name"
                  placeholderTextColor="rgb(144, 144, 144)"
                  onChangeText={val => {
                    handleTextChange(val);
                    const googleSuggestions = val === '' ? [] : locationResults;
                    const addressDetails = val.length <= 2 ? '' : address;
                    this.setState(
                      {
                        suggestions: googleSuggestions,
                        inputText: val,
                        address: addressDetails,
                      },
                      () => changeText({ inputText, address, placeID }),
                    );
                  }}
                  value={inputText}
                />
              </React.Fragment>
            )}
          </GoogleAutoComplete>
        </View>

        {address !== '' ? (
          <View style={styles.addressBar}>
            <SimpleLineIcons
              name="location-pin"
              style={styles.IconNextToLabel}
              size={RF(3.25)}
              color="rgb(105, 105, 105)"
            />
            <Text style={styles.addressStyle} numberOfLines={3}>
              {address}
            </Text>
          </View>
        ) : null}

        <ScrollView
          style={styles.suggestionScrollBox}
          onPress={() => Keyboard.dismiss()}
          onScrollBeginDrag={() => Keyboard.dismiss()}
        >
          {suggestions.map(places => (
            <PlaceSuggestion
              key={places.id}
              placeID={places.place_id}
              address={places.description}
              placeName={places.structured_formatting.main_text}
              selectPlace={(placeName, addressDetails, placeID) => {
                this.onSelectSuggestedPlace(placeName, addressDetails, placeID);
              }}
            />
          ))}
        </ScrollView>
      </View>
    );
  }
}

RestaurantTextInput.propTypes = {
  changeText: PropTypes.func.isRequired,
};
