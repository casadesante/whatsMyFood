import React from 'react';
import { StyleSheet, TouchableHighlight, Text } from 'react-native';
import RF from 'react-native-responsive-fontsize';
import PropTypes from 'prop-types';
import { heightPercentageToDP, widthPercentageToDP } from '../lib/Responsive';

const styles = StyleSheet.create({
  container: {
    paddingLeft: widthPercentageToDP('4.27%'),
    paddingTop: heightPercentageToDP('1.6%'),
    paddingBottom: heightPercentageToDP('1.6%'),
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderColor: '#DFDFDF',
  },
  placeNameStyle: {
    color: 'rgb(105, 105, 105)',
    fontSize: RF(3),
    letterSpacing: 0.5,
  },
});

const PlaceSuggestion = ({ placeName, address, selectPlace, placeID }) => (
  <TouchableHighlight style={styles.container} onPress={() => (selectPlace(placeName, address, placeID))}>
    <Text style={styles.placeNameStyle}>{address}</Text>
  </TouchableHighlight>
);

export default PlaceSuggestion;

PlaceSuggestion.propTypes = {
  address: PropTypes.string,
  placeName: PropTypes.string,
  selectPlace: PropTypes.func.isRequired,
  placeID: PropTypes.string.isRequired,
};

PlaceSuggestion.defaultProps = {
  address: 'Address unavailable',
  placeName: 'Place name not found',
};
