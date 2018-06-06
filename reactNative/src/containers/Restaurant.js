import React, { Component } from 'react';
import HeaderImageScrollView, {
  TriggeringView,
} from 'react-native-image-header-scroll-view';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
} from 'react-native';

export default class Restaurant extends Component {
  static navigationOptions = {
    headerTintColor: 'white',
    headerStyle: {
      position: 'absolute',
      top: 0,
      right: 0,
      left: 0,
      elevation: 0,
      shadowColor: 'transparent',
      backgroundColor: 'transparent',
      shadowRadius: 0,
      shadowOffset: {
        height: 0,
      },
    },
    headerRight: (
      <Ionicons
        style={{ paddingRight: 10 }}
        name="md-add"
        size={30}
        color="white"
      />
    ),
  };

  componentDidMount() {
    console.log(this.props.navigation.state);
  }
  render() {
    const { navigation } = this.props;
    const restaurantId = navigation.getParam('id');
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <HeaderImageScrollView
          maxHeight={300}
          minHeight={100}
          headerImage={require('../assets/img/tgif.jpg')}
          maxOverlayOpacity={0.6}
          minOverlayOpacity={0.5}
        >
          <View style={{ height: 1000 }}>
            <TriggeringView onHide={() => console.log('text hidden')}>
              <Text>Scroll Me!</Text>
            </TriggeringView>
          </View>
        </HeaderImageScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  linearGradient: {
    flex: 1,
  },
  image: {
    height: 200,
  },
});
