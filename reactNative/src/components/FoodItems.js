import React from 'react';
import { Text, View, ScrollView, StyleSheet, ActionSheetIOS } from 'react-native';
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

foodActionSheet = (item) => {
  ActionSheetIOS.showActionSheetWithOptions(
    {
      options: ['Cancel', 'Edit food', 'Remove food'],
      destructiveButtonIndex: 2,
      cancelButtonIndex: 0,
    },
    buttonIndex => {
      if (buttonIndex === 1) {
        console.log(item);
        navigation.navigate('EditFood', { item });
      } else if (buttonIndex === 2) {
        this.deleteFood(item.id);
        // navigation.navigate('EditRestaurant', { restaurantData: restaurant });
      }
    },
  );
}

deleteFood = (foodID) => {
  fetch('https://us-central1-whatsmyfood.cloudfunctions.net/deleteFood', {
    method: 'POST',
    body: JSON.stringify({foodID})
  })
  .then((deleteFoodResponse) => {
    deleteFoodResponse.status === 200 ?
      this.navigation.navigate('Home') : 
      alert(deleteFoodResponse.body)
  })
  .catch(err => alert(err))
}

const FoodItems = props => {
  const { title, items, navigation } = props;
  this.navigation = navigation;

  return (
    <View style={styles.container}>
      <Text style={styles.categoryLabelStyle}>{title}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {items.map(item => {
          const foodImgLink = item.img || null;
          return (
            <SmallFoodCard foodAction={this.foodActionSheet} item={item} key={item.id} foodID={item.id} foodName={item.name} foodImage={foodImgLink} />
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
