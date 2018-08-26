import React from 'react';
import { View, Image, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import RF from 'react-native-responsive-fontsize';
import { widthPercentageToDP } from '../lib/Responsive';

const styles = StyleSheet.create({
  uploadedImageStyle: {
    position: 'absolute',
    height: 9 * widthPercentageToDP('86.13%') / 16,
    width: widthPercentageToDP('86.13%'),
    borderRadius: widthPercentageToDP('86.13%') / 35,
  },
  container: {
    shadowOffset: { width: 1, height: 3 },
    shadowColor: '#000000',
    shadowOpacity: 0.2,
    position: 'relative',
    height: 9 * widthPercentageToDP('86.13%') / 16,
    width: widthPercentageToDP('86.13%'),
    borderRadius: widthPercentageToDP('86.13%') / 35,
  },
  cancelButton: {
    position: 'absolute',
    zIndex: 100,
    left: '86.5%',
    top: RF(0.35),
    margin: 0,
    shadowOffset: { width: 1, height: 3 },
    shadowColor: '#000000',
    shadowOpacity: 0.2,
  },
  gradientBox: {
    height: 9 * widthPercentageToDP('86.13%') / 16,
    width: widthPercentageToDP('86.13%'),
    borderRadius: widthPercentageToDP('86.13%') / 35,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
});

const Imageupload = params => {
  console.log(params.url);
  console.log(params.cancel);
  const restaurantImage = params.url ? (
    <Image
      source={{
        uri: params.url,
      }}
      resizeMode="cover"
      style={styles.uploadedImageStyle}
    />
  ) : (
    <Image
      source={require('../assets/img/ImageLinkBroken.png')}
      style={styles.uploadedImageStyle}
    />
  );
  return (
    <View style={styles.container}>
      <LinearGradient
        style={styles.gradientBox}
        colors={['rgb(255, 152, 99)', 'rgb(253, 89, 89)']}
      >
        <View>
          <ActivityIndicator size="large" color="#FFFFFF" />
        </View>
        <TouchableOpacity style={styles.cancelButton} onPress={() => { params.cancel(); }}>
          <Icon
            name="cancel"

            size={RF(5.5)}
            color="#FFFFFF"
          />
        </TouchableOpacity>
        {restaurantImage}
      </LinearGradient>
    </View>
  );
};

export default Imageupload;
