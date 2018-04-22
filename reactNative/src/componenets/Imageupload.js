import React from 'react';
import { Image } from 'react-native';

const Imageupload = () => (
  <Image
    source={require('../assets/img/tgif.png')}
    resizeMode="cover"
    style={{
      marginTop: 40,
      marginLeft: 40,
      height: 200,
      width: 300,
      borderRadius: 10,
    }}
  />
);

export default Imageupload;
