import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import PropTypes from 'prop-types';
import colors from '../lib/Colors';
import { widthPercentageToDP, heightPercentageToDP } from '../lib/Responsive';

const styles = StyleSheet.create({
  addText: {
    color: 'white',
    fontFamily: 'SFProDisplay-Bold',
    fontSize: 33,
    fontWeight: 'bold',
    letterSpacing: 0.41,
    marginLeft: widthPercentageToDP('4%'),
    marginBottom: heightPercentageToDP('1.35%'),
  },
  background: {
    backgroundColor: colors.coral,
  },
});

const Header = props => {
  const { text } = props;
  return (
    <View style={styles.background}>
      <Text style={styles.addText}>{text}</Text>
    </View>
  );
};

Header.propTypes = {
  text: PropTypes.string,
};

Header.defaultProps = {
  text: 'Header',
};

export default Header;
