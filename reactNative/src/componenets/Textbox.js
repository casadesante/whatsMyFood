import React from 'react';
import { StyleSheet, View, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  searchSection: {
    flexDirection: 'row',
    borderBottomColor: 'rgb(188, 187, 193)',
    borderBottomWidth: 0.5,
  },
  searchIcon: {
    padding: 15,
  },
  input: {
    flex: 1,
    backgroundColor: 'white',
    color: '#424242',
    fontSize: 20,
  },
});

const Textbox = props => {
  const { icon, placeholder } = props;
  return (
    <View style={styles.searchSection}>
      {icon === 'location' ? (
        <EvilIcons
          name={icon}
          style={styles.searchIcon}
          size={23}
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
