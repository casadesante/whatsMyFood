import React from 'react';
import { Text, View, ScrollView, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import RF from 'react-native-responsive-fontsize';
import SmallFoodCard from './SmallFoodCard';
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
});

const FoodItems = props => {
  const { title, items } = props;
  return (
    <View style={styles.container}>
      <Text style={styles.categoryLabelStyle}>{title}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {items.map(item => {
          console.log(item);
          const foodImgLink = item.img || null;
          return (
            <SmallFoodCard key={item.img} foodName={item.name} foodImage={foodImgLink} />
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
