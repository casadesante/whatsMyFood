import React from 'react';
import {
  Text,
  View,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const Restaurant = props => {
  const list = props.restaurant;
  return (
    <TouchableOpacity
      onPress={() => {
        props.goToRestaurant(list.id);
      }}
    >
      <ImageBackground
        style={styles.backgroundImage}
        imageStyle={{ borderRadius: 10 }}
        source={{
          uri: list.img,
        }}
        resizeMode="cover"
      >
        <LinearGradient
          colors={['rgba(0, 0, 0, 0.45)', 'rgba(0, 0, 0, 0.45)']}
          style={styles.linearGradient}
        >
          <View style={styles.details}>
            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 35 }}>
              {list.name}
            </Text>
            <Text style={{ color: 'white', fontWeight: 'bold' }}>
              {list.distance} kms away
            </Text>
          </View>
        </LinearGradient>
      </ImageBackground>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  linearGradient: {
    flex: 1,
    borderRadius: 10,
  },
  backgroundImage: {
    marginTop: 20,
    height: 195,
  },
  details: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Restaurant;
