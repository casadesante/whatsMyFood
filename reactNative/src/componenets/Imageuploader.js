import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';

const Imageuploader = ({ upload }) => (
  <TouchableOpacity onPress={() => upload()}>
    <LinearGradient
      style={{ height: 200, borderRadius: 10 }}
      colors={['rgb(255, 152, 99)', 'rgb(253, 89, 89)']}
    >
      <SimpleLineIcons
        style={{
          paddingTop: 70,
          alignSelf: 'center',
        }}
        name="camera"
        size={40}
        color="white"
      />
      <Text style={{ color: 'white', textAlign: 'center' }}>Add photo</Text>
    </LinearGradient>
  </TouchableOpacity>
);

export default Imageuploader;
