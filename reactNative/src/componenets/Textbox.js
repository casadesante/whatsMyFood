import React from 'react';
import { StyleSheet, View, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
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
  searchIcon: {
    marginLeft: widthPercentageToDP('4.27%'),
    marginRight: widthPercentageToDP('2.93%'),
  },
  input: {
    flex: 1,
    backgroundColor: 'white',
    color: '#424242',
    fontSize: 20,
  },
});

const Textbox = (props) => {
  const { icon, placeholder } = props;
  return (
    <View style={styles.searchSection}>
      {icon === 'location' ? (
        <SimpleLineIcons
          name="location-pin"
          style={styles.searchIcon}
          size={21}
          color="rgb(105, 105, 105)"
        />
      ) : (
        <Icon
          name={icon}
          style={styles.searchIcon}
          size={23}
          color="rgb(105, 105, 105)"
        />
      )}
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="rgb(144, 144, 144)"
      />
    </View>
  );
};

Textbox.propTypes = {
  icon: PropTypes.string,
  placeholder: PropTypes.string,
};

Textbox.defaultProps = {
  icon: '',
  placeholder: '',
};
export default Textbox;
