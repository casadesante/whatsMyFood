import React from 'react';
import { View, Image } from 'react-native';
import { widthPercentageToDP } from '../lib/Responsive';

const Imageupload = params => {
  console.log(params.url);
  return (
    <View style={{
      shadowOffset: { width: 1, height: 3 },
      shadowColor: '#000000',
      shadowOpacity: 0.2,
    }}
    >
      <Image
        source={{
          uri: params.url,
        }}
        resizeMode="cover"
        style={{
          height: 9 * widthPercentageToDP('86.13%') / 16,
          width: widthPercentageToDP('86.13%'),
          borderRadius: widthPercentageToDP('86.13%') / 35,
        }}
      />
    </View>
  );
};

export default Imageupload;
