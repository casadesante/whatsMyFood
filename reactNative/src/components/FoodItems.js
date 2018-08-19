import React from 'react';
import { Image, Text, View, ScrollView, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import RF from 'react-native-responsive-fontsize';
import { widthPercentageToDP, heightPercentageToDP } from '../lib/Responsive';

const styles = StyleSheet.create({
  container: {
    marginBottom: heightPercentageToDP('2%'),
  },
  categoryLabelStyle: {
    marginLeft: widthPercentageToDP('3%'),
    marginTop: heightPercentageToDP('2%'),
    fontSize: RF(3),
  },
  foodImage: {
    width: widthPercentageToDP('52%'),
    height: widthPercentageToDP('52%') * 9 / 16,
    margin: widthPercentageToDP('3.5%'),
    marginBottom: heightPercentageToDP('1%'),
    borderRadius: widthPercentageToDP('52%') / 25,
  },
  foodName: {
    fontSize: RF(2.2),
    marginLeft: widthPercentageToDP('4%'),
    width: widthPercentageToDP('51%'),
    marginRight: widthPercentageToDP('0.5%'),
    color: '#333333',
  },
});

const FoodItems = props => {
  const { title, items } = props;
  return (
    <View style={styles.container}>
      <Text style={styles.categoryLabelStyle}>{title}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {items.map(item => {
          const foodImgLink = item.img
            ? {
                uri: item.img,
              }
            : require('../assets/img/default_foodImg.png');
          return (
            <View key={item.img}>
              <Image style={styles.foodImage} source={foodImgLink} />
              <Text style={styles.foodName} numberOfLines={2}>
                {item.name}
              </Text>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

FoodItems.propTypes = {
  title: PropTypes.string,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
    }),
  ),
};

FoodItems.defaultProps = {
  title: '',
  items: [],
};

export default FoodItems;
