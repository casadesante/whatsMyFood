import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import PropTypes from 'prop-types';
import {
  heightPercentageToDP,
} from '../lib/Responsive';

const styles = StyleSheet.create({
  gradientBox: {
    height: heightPercentageToDP('22.29%'),
    width: 16 * heightPercentageToDP('22.29%') / 9,
    borderRadius: 10,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    shadowOffset: { width: 1, height: 3 },
    shadowColor: '#000000',
    shadowOpacity: 0.2,
  },
  cameraIcon: {
    textAlign: 'center',
  },
  uploadText: {
    color: 'white',
    textAlign: 'center',
  },
});
const Imageuploader = ({ upload }) => (
  <TouchableOpacity onPress={() => upload()}>
    <LinearGradient
      style={styles.gradientBox}
      colors={['rgb(255, 152, 99)', 'rgb(253, 89, 89)']}
    >
      <SimpleLineIcons
        style={styles.cameraIcon}
        name="camera"
        size={40}
        color="white"
      />
      <Text style={styles.uploadText}>Add photo</Text>
    </LinearGradient>
  </TouchableOpacity>
);

Imageuploader.propTypes = {
  // eslint-disable-next-line react/require-default-props
  upload: PropTypes.func,
};
export default Imageuploader;
