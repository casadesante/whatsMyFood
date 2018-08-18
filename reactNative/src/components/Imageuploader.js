import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import PropTypes from 'prop-types';
import RF from 'react-native-responsive-fontsize';
import { widthPercentageToDP } from '../lib/Responsive';

const styles = StyleSheet.create({
  gradientBox: {
    height: 9 * widthPercentageToDP('86.13%') / 16,
    width: widthPercentageToDP('86.13%'),
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
    fontSize: RF(2.9),
    marginTop: 3,
  },
});
const Imageuploader = ({ upload, uploading }) => (
  <TouchableOpacity onPress={() => upload()}>
    <LinearGradient
      style={styles.gradientBox}
      colors={['rgb(255, 152, 99)', 'rgb(253, 89, 89)']}
    >
      <SimpleLineIcons
        style={styles.cameraIcon}
        name="camera"
        size={RF(6)}
        color="white"
      />
      <Text style={styles.uploadText}>
        {uploading ? 'Loading ...' : 'Add photo'}
      </Text>
    </LinearGradient>
  </TouchableOpacity>
);

Imageuploader.propTypes = {
  // eslint-disable-next-line react/require-default-props
  upload: PropTypes.func,
};
export default Imageuploader;
