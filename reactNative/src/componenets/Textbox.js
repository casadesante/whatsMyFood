import React from 'react';
import { StyleSheet, View, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';

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

const Textbox = props => (
  <View style={styles.searchSection}>
    {props.icon === 'location' ? (
      <EvilIcons
        name={props.icon}
        style={styles.searchIcon}
        size={23}
        color="rgb(105, 105, 105)"
      />
    ) : (
      <Icon
        name={props.icon}
        style={styles.searchIcon}
        size={23}
        color="rgb(105, 105, 105)"
      />
    )}
    <TextInput
      style={styles.input}
      placeholder={props.placeholder}
      placeholderTextColor="rgb(144, 144, 144)"
    />
  </View>
);

export default Textbox;
