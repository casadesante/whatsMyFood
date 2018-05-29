import React from 'react';
import { View, Text, FlatList, ListView, StyleSheet } from 'react-native';

const Restaurantlist = props => {
  const list = props.list;
  return (
    <View style={styles.container}>
      <FlatList
        data={[
          { key: 'Devin' },
          { key: 'Jackson' },
          { key: 'James' },
          { key: 'Joel' },
          { key: 'John' },
          { key: 'Jillian' },
          { key: 'Jimmy' },
          { key: 'Julie' },
        ]}
        renderItem={({ item }) => <Text style={styles.item}>{item.key}</Text>}
      />
      <Text>{list[0].name}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 22,
  },
  item: {
    fontSize: 18,
    height: 44,
  },
});

export default Restaurantlist;
