import React from 'react';
import { StyleSheet, View, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import RF from 'react-native-responsive-fontsize';
import { GoogleAutoComplete } from 'react-native-google-autocomplete';
import PropTypes from 'prop-types';
import { heightPercentageToDP, widthPercentageToDP } from '../lib/Responsive';

const styles = StyleSheet.create({
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
});

// sendBackInfo(a, b,c ) {
//   props.cahjngeText(a, b,c);
// }
const RestaurantTextInput = props => {
  const { changeText } = props;
  console.log(GoogleAutoComplete);
  return (
    <View style={styles.searchSection}>
      <Icon
        name="restaurant"
        style={styles.IconNextToLabel}
        size={RF(3.3)}
        color="rgb(105, 105, 105)"
      />
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
            {// this.sendBackInfo(input, location results)
            }
            {console.log(locationResults)}
            {console.log(fetchDetails)}
            <TextInput
              style={styles.input}
              placeholder="Restaurant Name"
              placeholderTextColor="rgb(144, 144, 144)"
              onChangeText={handleTextChange}
              value={inputValue}
            />
          </React.Fragment>
        )}
      </GoogleAutoComplete>


    </View>
  );
};

RestaurantTextInput.propTypes = {
  changeText: PropTypes.func.isRequired,
};

export default RestaurantTextInput;
