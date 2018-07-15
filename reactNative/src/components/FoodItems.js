import React from 'react';
import { Text, View, ScrollView } from 'react-native';
import { CardViewWithImage } from 'react-native-simple-card-view';
import PropTypes from 'prop-types';

const FoodItems = props => {
  const { title, items } = props;
  return (
    <View>
      <Text
        style={{
          paddingLeft: 10,
          paddingTop: 20,
          paddingBottom: 5,
          fontSize: 20,
        }}
      >
        {title}
      </Text>
      <View style={{ flex: 1, flexDirection: 'row', paddingLeft: 7 }}>
        <ScrollView horizontal>
          {items.map(item => (
            <View key={item.img}>
              <CardViewWithImage
                source={{
                  uri: item.img,
                }}
                width={200}
                title={item.name}
                titleTextAlign="flex-start"
                imageWidth={200}
                imageHeight={100}
                roundedImage={false}
              />
            </View>
          ))}
        </ScrollView>
      </View>
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
