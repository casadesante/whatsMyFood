import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import RF from 'react-native-responsive-fontsize';

import { heightPercentageToDP, widthPercentageToDP } from '../lib/Responsive';

const styles = StyleSheet.create({
  optionalText: {
    paddingLeft: widthPercentageToDP('4.27%'),
    paddingTop: heightPercentageToDP('1.85%'),
    paddingBottom: heightPercentageToDP('1.85%'),
    backgroundColor: '#F9F9F9',
  },
  optional: {
    color: 'rgb(105, 105, 105)',
    fontSize: RF(3.2),
    letterSpacing: 0.5,
  },
});

const Optional = () => (
  <View style={styles.optionalText}>
    <Text style={styles.optional}>Optional</Text>
  </View>
);

export default Optional;
