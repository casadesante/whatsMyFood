import React from 'react';
import { Image } from 'react-native';

const Imageupload = params => {
  console.log(params.url);
  return (
    <Image
      source={{
        uri: params.url,
      }}
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
};

export default Imageupload;
