import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { Row } from 'react-native-easy-grid';

const styles = StyleSheet.create({
  addText: {
    color: 'white',
    fontSize: 33,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    marginLeft: 15,
  },
});

const Header = props => (
  <Row
    style={{
      backgroundColor: 'rgb(255, 68, 68)',
      height: 44,
    }}
  >
    <Text style={styles.addText}>{props.text}</Text>
  </Row>
);

export default Header;
