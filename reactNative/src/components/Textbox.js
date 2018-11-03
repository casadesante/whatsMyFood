import React from 'react';
import { StyleSheet, View, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import RF from 'react-native-responsive-fontsize';

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

const Textbox = props => {
  const { icon, placeholder, text, changeText } = props;
  return (
    <View style={styles.searchSection}>
      {icon === 'location' ? (
        <SimpleLineIcons
          name="location-pin"
          style={styles.IconNextToLabel}
          size={RF(3.25)}
          color="rgb(105, 105, 105)"
        />
      ) : (
        <Icon
          name={icon}
          style={styles.IconNextToLabel}
          size={RF(3.3)}
          color="rgb(105, 105, 105)"
        />
      )}
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="rgb(144, 144, 144)"
        onChangeText={changeText}
        value={text}
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
