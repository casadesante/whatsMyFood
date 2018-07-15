import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import RF from 'react-native-responsive-fontsize';
import PropTypes from 'prop-types';
import { widthPercentageToDP, heightPercentageToDP } from '../lib/Responsive';

const emojiList = [
  { rating: 1, emoji: '🤢' },
  { rating: 2, emoji: '🙅' },
  { rating: 3, emoji: '😐' },
  { rating: 4, emoji: '👌' },
  { rating: 5, emoji: '😍' },
];
emojiList.forEach(Object.freeze);

const styles = StyleSheet.create({
  emojiPicker: {
    paddingTop: heightPercentageToDP('1.25%'),
    paddingLeft: widthPercentageToDP('4.27%'),
    paddingRight: widthPercentageToDP('4.27%'),
    backgroundColor: 'white',
    borderBottomColor: 'rgb(188, 187, 193)',
    borderBottomWidth: 0.5,
  },
  emojiPickerLabel: {
    color: '#696969',
    fontFamily: 'SFProText-Regular',
    fontSize: RF(2.5),
  },
  emojiSpacing: {
    marginTop: heightPercentageToDP('1.85%'),
    marginBottom: heightPercentageToDP('1.85%'),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default class EmojiPicker extends Component {
  constructor() {
    super();
    this.state = { selectedRating: 5 };
  }

  emojiToggleStyle = (index, selectedrating) => {
    const emojiOpacity = (index === selectedrating) ? 1.0 : 0.3;

    return {
      fontSize: RF(5.5),
      opacity: emojiOpacity,
    };
  };

  render() {
    const { selectedRating } = this.state;
    return (
      <View style={styles.emojiPicker}>
        <Text style={styles.emojiPickerLabel}>
      Pick one of them
        </Text>
        <View style={styles.emojiSpacing}>
          {emojiList.map(option => (
            <Text
              key={option.rating}
              style={this.emojiToggleStyle(option.rating, selectedRating)}
            >
              {option.emoji}
            </Text>))}
        </View>
      </View>
    );
  }
}

EmojiPicker.propTypes = {
  onSelect: PropTypes.func,
};
