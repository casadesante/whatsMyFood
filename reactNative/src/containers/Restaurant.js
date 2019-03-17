import React, { Component } from 'react';
import HeaderImageScrollView from 'react-native-image-header-scroll-view';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import * as Animatable from 'react-native-animatable';
import { StackActions, NavigationActions } from 'react-navigation';
import { StyleSheet,
  Text,
  View,
  StatusBar,
  Image,
  TouchableOpacity,
  ActionSheetIOS,
  Alert,
  NetInfo,
  Modal,
  ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';
import RF from '../../node_modules/react-native-responsive-fontsize';
import { getProfileInfo } from '../lib/Auth';
import FoodItems from '../components/FoodItems';
import OfflineNotice from '../components/Nointernet';
// import helper from '../lib/Helper';
import { heightPercentageToDP, widthPercentageToDP } from '../lib/Responsive';

const styles = StyleSheet.create({
  modalContents: {
    height: heightPercentageToDP('100%'),
    width: widthPercentageToDP('100%'),
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderContainer: {
    height: widthPercentageToDP('25%'),
    width: widthPercentageToDP('25%'),
    backgroundColor: 'white',
    borderRadius: widthPercentageToDP('2%'),
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    height: heightPercentageToDP('100%'),
  },
  linearGradient: {
    height: '100%',
    width: '100%',
    position: 'relative',
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
  loader: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    borderRadius: 10,
    overflow: 'hidden',
  },
  loader1: {
    borderRadius: 10,
    position: 'absolute',
    height: '100%',
    width: '25%',
    left: '10%',
    transform: [
      { skewX: '5deg' },
    ],
  },
  loader2: {
    borderRadius: 10,
    position: 'absolute',
    height: '100%',
    width: '15%',
    left: '40%',
    transform: [
      { skewX: '5deg' },
    ],
  },
});

const loaderAnimation = {
  0: {
    left: '100%',
  },
  0.5: {
    left: '40%',
  },
  1: {
    left: '-100%',
  },
};

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
          const restaurant = navigation.getParam('restaurant');
          restaurant.name = restaurant.restaurantName;
          navigation.navigate('Addfood', { restaurantData: restaurant });
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
    headerLeft: (
      <TouchableOpacity
        onPress={() => {
          if (navigation.getParam('navigatedFrom') === 'addNewRestaurantAndFood') {
            const resetAction = StackActions.reset({
              index: 0,
              actions: [NavigationActions.navigate({ routeName: 'Newentry' })],
            });
            navigation.dispatch(resetAction);
            navigation.navigate('Home');
          } else {
            navigation.dispatch(NavigationActions.back());
          }
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Ionicons
            style={{ paddingLeft: 10 }}
            name="ios-arrow-back"
            size={30}
            color="white"
          />
          <Text style={{ paddingLeft: 10, color: '#FFFFFF', fontSize: 18 }}>{navigation.getParam('parentPage')}</Text>
        </View>

      </TouchableOpacity>
    ),
  });

  state = {
    isConnected: true,
    loaded: false,
    modalVisible: false,
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
    const restaurant = navigation.getParam('restaurant');
    restaurant.name = restaurant.restaurantName;
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ['Cancel', 'Add food', 'Edit restaurant', 'Remove restaurant'],
        destructiveButtonIndex: 3,
        cancelButtonIndex: 0,
      },
      buttonIndex => {
        if (buttonIndex === 1) {
          navigation.navigate('Addfood', { restaurantData: restaurant });
        } else if (buttonIndex === 2) {
          navigation.navigate('EditRestaurant', { restaurantData: restaurant });
        } else if (buttonIndex === 3) {
          this.deleteRestaurant(restaurant.restaurantID);
        }
      },
    );
  };

  deleteRestaurant = (restaurantID) => {
    this.setState({ modalVisible: true });
    const { navigation } = this.props;
    getProfileInfo()
      .then(user => user.uid)
      .then(firebaseID => fetch(
        'https://us-central1-whatsmyfood.cloudfunctions.net/deleteRestaurant',
        {
          method: 'POST',
          body: JSON.stringify({ firebaseID, restaurantID }),
        },
      ))
      .then(deletedRestaurant => {
        this.setState({ modalVisible: false });
        if (deletedRestaurant.status === 200) { navigation.navigate('Home'); } else { alert('Error while removing restaurant'); }
      })
      .catch(err => {
        this.setState({ modalVisible: false });
        Alert.alert('Error encountered while deleting restaurant');
        console.log(`Error encountered while deleting restaurant: ${err}`);
      });
  }

  segregateFoodItems = (foodItems, createdAt) => {
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
        firebaseID: item.firebaseID,
        restaurantID: item.restaurantID,
        createdAt,
        rating: item.rating,
      });
    });
    return items;
  };

  showPic = () => {
    this.setState({ loaded: true });
  };

  showModal = (visibility) => {
    this.setState({ modalVisible: visibility });
  }

  render() {
    const { navigation } = this.props;
    const { isConnected, loaded, modalVisible } = this.state;
    const restaurant = navigation.getParam('restaurant');
    const restaurantFoodDetails = this.segregateFoodItems(restaurant.foods, restaurant.createdAt);

    console.log(restaurant);
    const shine = ['rgba(255, 255, 255, 0.03)', 'rgba(255, 255, 255, 0.16)', 'rgba(255, 255, 255, 0.08)'];
    const redGradient = ['rgb(254, 108, 93)', 'rgb(253, 89, 89)'];

    const uploadedRestaurantImage = (
      <View>
        {loaded
          ? (true) : (
            <LinearGradient
              colors={redGradient}
              style={styles.linearGradient}
            >
              <Animatable.View duration={2000} delay={600} animation={loaderAnimation} iterationCount="infinite" style={styles.loader}>
                <LinearGradient colors={shine} style={styles.loader1} />
                <LinearGradient colors={shine} style={styles.loader2} />
              </Animatable.View>
            </LinearGradient>
          )}
        <Image
          source={{ uri: restaurant.restaurantPhotoURL }}
          style={styles.headerImage}
          onLoadEnd={this.showPic}
        />
      </View>
    );
    const restaurantImage = restaurant.restaurantPhotoURL ? (
      uploadedRestaurantImage
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
            restaurant.restaurantPhotoURL && loaded ? 0.8 : 0.01
          }
          minOverlayOpacity={
            restaurant.restaurantPhotoURL && loaded ? 0.5 : 0.01
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
              <FoodItems
                navigation={navigation}
                title="😍 My fav"
                items={restaurantFoodDetails['5']}
                restaurantName={restaurant.restaurantName}
                showModal={this.showModal}
              />
            ) : null}
            {restaurantFoodDetails['4'].length !== 0 ? (
              <FoodItems
                navigation={navigation}
                title="👌🏼 Good"
                items={restaurantFoodDetails['4']}
                restaurantName={restaurant.restaurantName}
                showModal={this.showModal}
              />
            ) : null}
            {restaurantFoodDetails['3'].length !== 0 ? (
              <FoodItems
                navigation={navigation}
                title="😐 Meh"
                items={restaurantFoodDetails['3']}
                restaurantName={restaurant.restaurantName}
                showModal={this.showModal}
              />
            ) : null}
            {restaurantFoodDetails['2'].length !== 0 ? (
              <FoodItems
                navigation={navigation}
                title="☹️ Not satisfied"
                items={restaurantFoodDetails['2']}
                restaurantName={restaurant.restaurantName}
                showModal={this.showModal}
              />
            ) : null}
            {restaurantFoodDetails['1'].length !== 0 ? (
              <FoodItems
                navigation={navigation}
                title="🤢 Yuck"
                items={restaurantFoodDetails['1']}
                restaurantName={restaurant.restaurantName}
                showModal={showModal}
              />
            ) : null}
          </View>
        </HeaderImageScrollView>
        <Modal
          animationType="fade"
          transparent
          visible={modalVisible}
        >
          <View style={styles.modalContents}>
            <View style={styles.loaderContainer}>
              <ActivityIndicator
                size="large"
                color="#FF4444"
                style={styles.activityIndicator}
              />
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

Restaurant.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};
