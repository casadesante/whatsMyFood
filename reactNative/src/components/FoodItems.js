import React, { Component } from 'react';
import { Text, View, ScrollView, StyleSheet, ActionSheetIOS, Alert } from 'react-native';
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

class FoodItems extends Component {
  foodActionSheet = (item, restaurantName) => {
    const { navigation } = this.props;
    item.restaurantName = restaurantName;
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ['Cancel', 'Edit food', 'Remove food'],
        destructiveButtonIndex: 2,
        cancelButtonIndex: 0,
      },
      buttonIndex => {
        if (buttonIndex === 1) {
          navigation.navigate('EditFood', { item });
        } else if (buttonIndex === 2) {
          this.deleteFood(item);
          // navigation.navigate('EditRestaurant', { restaurantData: restaurant });
        }
      },
    );
  }

  deleteFood = (item) => {
    const { navigation, showModal } = this.props;
    showModal(true);
    const deleteFoodRequest = {
      foodID: item.id,
      firebaseID: item.firebaseID,
      restaurantID: item.restaurantID,
    };

    fetch('https://us-central1-whatsmyfood.cloudfunctions.net/deleteFood',
      {
        method: 'POST',
        body: JSON.stringify(deleteFoodRequest),
      })
      .then(deleteFoodApiResponse => {
        if (deleteFoodApiResponse.status === 200) {
          showModal(false);
          return deleteFoodApiResponse.json();
        }
        throw deleteFoodApiResponse;
      })
      .then((restaurant) => {
        navigation.navigate('Restaurant', { restaurant, parentPage: 'Back' });
      })
      .catch(err => {
        if (err._bodyText) {
          Alert.alert(
            'Error',
            err._bodyText,
            [{ text: 'OK',
              onPress: () => {
                showModal(false);
              } }],
          );
        } else {
          Alert.alert(
            'Unexpected Error',
            'Something went wrong. Please report this error.',
            [{ text: 'OK',
              onPress: () => {
                showModal(false);
              } }],
          );
        }
        console.log(`Error encountered while deleting restaurant: ${JSON.stringify(err)}`);
      });
  }

  render() {
    const { title, navigation, items, restaurantName } = this.props;
    this.navigation = navigation;

    return (
      <View style={styles.container}>
        <Text style={styles.categoryLabelStyle}>{title}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {items.map(item => {
            const foodImgLink = item.img || null;
            return (
              <SmallFoodCard foodAction={this.foodActionSheet} item={item} restaurantName={restaurantName} key={item.id} foodID={item.id} foodName={item.name} foodImage={foodImgLink} />
            );
          })}
        </ScrollView>
      </View>
    );
  }
}

FoodItems.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
  showModal: PropTypes.func.isRequired,
  title: PropTypes.string,
  restaurantName: PropTypes.string,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
    }),
  ),
};

FoodItems.defaultProps = {
  title: '',
  items: [],
  restaurantName: '',
};

export default FoodItems;
