import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { Row } from 'react-native-easy-grid';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  addText: {
    color: 'white',
    fontSize: 33,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    marginLeft: 15,
  },
});

const Header = props => {
  const { text } = props;
  return (
    <Row
      style={{
        backgroundColor: 'rgb(255, 68, 68)',
        height: 44,
      }}
    >
      <Text style={styles.addText}>{text}</Text>
    </Row>
  );
};

Header.propTypes = {
  text: PropTypes.string,
};

Header.defaultProps = {
  text: 'Header',
};

export default Header;
