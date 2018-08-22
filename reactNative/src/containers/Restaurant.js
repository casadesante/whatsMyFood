import React, { Component } from 'react';
import HeaderImageScrollView from 'react-native-image-header-scroll-view';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  Image,
  TouchableOpacity,
  ActionSheetIOS,
  NetInfo,
} from 'react-native';
import PropTypes from 'prop-types';
import RF from '../../node_modules/react-native-responsive-fontsize';
import { getProfileInfo } from '../lib/Auth';
import FoodItems from '../components/FoodItems';
import OfflineNotice from '../components/Nointernet';
import helper from '../lib/Helper';
import { heightPercentageToDP, widthPercentageToDP } from '../lib/Responsive';

const styles = StyleSheet.create({
  container: {
    height: heightPercentageToDP('100%'),
  },
  linearGradient: {
    flex: 1,
  },
  image: {
    height: 200,
  },
  restaurantNameStyle: {
    color: 'black',
    fontSize: RF(4.3),
    fontFamily: 'SFProDisplay-Bold',
    marginLeft: widthPercentageToDP('4%'),
    width: widthPercentageToDP('78%'),
  },
  restaurantTitleBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderBottomColor: 'rgba(222, 222, 222, 0.5)',
    borderBottomWidth: 1,
    paddingTop: heightPercentageToDP('1.5%'),
    paddingBottom: heightPercentageToDP('1.5%'),
  },
  headerImage: {
    width: widthPercentageToDP('100%'),
    height: heightPercentageToDP('32%'),
    alignSelf: 'stretch',
    resizeMode: 'cover',
  },
});

export default class Restaurant extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerTintColor: 'white',
    headerStyle: {
      position: 'absolute',
      top: 0,
      right: 0,
      left: 0,
      elevation: 0,
      shadowColor: 'transparent',
      borderBottomWidth: 0,
      backgroundColor: 'transparent',
      shadowRadius: 0,
      shadowOffset: {
        height: 0,
      },
    },
    headerRight: (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('Addfood', { restaurantData: null });
        }}
      >
        <Ionicons
          style={{ paddingRight: 10 }}
          name="md-add"
          size={30}
          color="white"
        />
      </TouchableOpacity>
    ),
  });

  state = {
    isConnected: true,
  };

  componentDidMount() {
    const { navigation } = this.props;
    NetInfo.isConnected.addEventListener(
      'connectionChange',
      this.handleConnectivityChange,
    );
    /* eslint no-underscore-dangle: */
    this._navListener = navigation.addListener('didFocus', () => {
      StatusBar.setBarStyle('light-content');
    });
  }

  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener(
      'connectionChange',
      this.handleConnectivityChange,
    );
    this._navListener.remove();
  }

  handleConnectivityChange = isConnected => {
    if (isConnected) {
      this.setState({ isConnected });
    } else {
      this.setState({ isConnected });
    }
  };

  restaurantActionSheet = () => {
    const { navigation } = this.props;
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ['Cancel', 'Add food', 'Edit restaurant', 'Remove restaurant'],
        destructiveButtonIndex: 3,
        cancelButtonIndex: 0,
      },
      buttonIndex => {
        if (buttonIndex === 1) {
          navigation.navigate('Addfood', { restaurantData: null });
        } else if (buttonIndex === 2) {
          navigation.navigate('EditRestaurant', { restaurantData: null });
        } else if (buttonIndex === 3) {
          const restaurant = navigation.getParam('restaurant');
          this.deleteRestaurant(restaurant.restaurantID);
        }
      },
    );
  };

  deleteRestaurant = (restaurantID) => {
    const { navigation } = this.props;
    getProfileInfo()
      .then(user => user.uid)
      .then(firebaseID =>
        fetch(
          'https://us-central1-whatsmyfood.cloudfunctions.net/deleteRestaurant',
          {
            method: 'POST',
            body: JSON.stringify({ firebaseID, restaurantID }),
          },
        ),
      )
      .then(deletedRestaurant => {
        deletedRestaurant.status === 200 ? navigation.navigate('Home') : alert('Error while removing restaurant');
      })
      .catch(err => alert(err));
  }

  segregateFoodItems = foodItems => {
    const items = {
      1: [],
      2: [],
      3: [],
      4: [],
      5: [],
    };
    foodItems.forEach(item => {
      items[item.rating].push({
        name: item.foodName,
        img: item.foodPhotoURL,
        id: item.foodId,
      });
    });
    return items;
  };

  render() {
    const { navigation } = this.props;
    const { isConnected } = this.state;
    const restaurant = navigation.getParam('restaurant');
    const restaurantFoodDetails = this.segregateFoodItems(restaurant.foods);
    const restaurantImage = restaurant.hasOwnProperty('restaurantPhotoURL') ? (
      <Image
        source={{ uri: restaurant.restaurantPhotoURL }}
        style={styles.headerImage}
      />
    ) : (
      <Image
        source={require('../assets/img/default_restaurantImg.png')}
        style={styles.headerImage}
      />
    );
    return (
      <View style={styles.container}>
        {!isConnected ? <OfflineNotice /> : null}
        <HeaderImageScrollView
          maxHeight={heightPercentageToDP('32%')}
          minHeight={heightPercentageToDP('11%')}
          renderHeader={() => restaurantImage}
          maxOverlayOpacity={
            restaurant.hasOwnProperty('restaurantPhotoURL') ? 0.8 : 0.01
          }
          minOverlayOpacity={
            restaurant.hasOwnProperty('restaurantPhotoURL') ? 0.5 : 0.01
          }
          showsVerticalScrollIndicator={false}
        >
          <View style={{ marginBottom: heightPercentageToDP('12%') }}>
            <View style={styles.restaurantTitleBar}>
              <Text style={styles.restaurantNameStyle} numberOfLines={2}>
                {restaurant.restaurantName}
              </Text>
              <TouchableOpacity onPress={this.restaurantActionSheet}>
                <MaterialCommunityIcons
                  style={{
                    paddingLeft: widthPercentageToDP('3%'),
                    paddingRight: widthPercentageToDP('3%'),
                  }}
                  name="dots-horizontal-circle"
                  size={RF(5)}
                  color="#FF4444"
                />
              </TouchableOpacity>
            </View>
            {}
            {restaurantFoodDetails['5'].length !== 0 ? (
              <FoodItems title="😍 My fav" items={restaurantFoodDetails['5']} />
            ) : null}
            {restaurantFoodDetails['4'].length !== 0 ? (
              <FoodItems title="👌🏼 Good" items={restaurantFoodDetails['4']} />
            ) : null}
            {restaurantFoodDetails['3'].length !== 0 ? (
              <FoodItems title="😐 Meh" items={restaurantFoodDetails['3']} />
            ) : null}
            {restaurantFoodDetails['2'].length !== 0 ? (
              <FoodItems
                title="☹️ Not satisfied"
                items={restaurantFoodDetails['2']}
              />
            ) : null}
            {restaurantFoodDetails['1'].length !== 0 ? (
              <FoodItems title="🤢 Yuck" items={restaurantFoodDetails['1']} />
            ) : null}
          </View>
        </HeaderImageScrollView>
      </View>
    );
  }
}

Restaurant.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};
