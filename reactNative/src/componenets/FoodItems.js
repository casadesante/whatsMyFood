import React from 'react';
import { Text, View, ScrollView } from 'react-native';
import { CardViewWithImage } from 'react-native-simple-card-view';

const FoodItems = props => (
  <View>
    <Text
      style={{
        paddingLeft: 10,
        paddingTop: 20,
        paddingBottom: 5,
        fontSize: 20,
      }}
    >
      {props.title}
    </Text>
    <View style={{ flex: 1, flexDirection: 'row', paddingLeft: 7 }}>
      <ScrollView horizontal={true}>
        {props.items.map(item => (
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

export default FoodItems;
