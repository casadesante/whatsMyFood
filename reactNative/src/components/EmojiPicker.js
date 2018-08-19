import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import RF from 'react-native-responsive-fontsize';
import PropTypes from 'prop-types';
import * as Animatable from 'react-native-animatable';
import { widthPercentageToDP, heightPercentageToDP } from '../lib/Responsive';

// Emoji and its corresponding rating
const emojiList = [
  { rating: 1, emoji: '🤢' },
  { rating: 2, emoji: '🙅🏻' },
  { rating: 3, emoji: '😐' },
  { rating: 4, emoji: '👌🏼' },
  { rating: 5, emoji: '😍' },
];
// Freeze. No one can modify this anymore.
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
    paddingBottom: heightPercentageToDP('2.85%'),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  emojiContainer: {
    position: 'relative',
    height: RF(6),
    width: RF(6),
  },
});

export default class EmojiPicker extends Component {
  constructor() {
    super();
    this.state = { selectedRating: 5 };
  }

  emojiToggleStyle = (index, selectedrating) => {
    // Emoji bounce animation settings
    const emojiOpacity = index === selectedrating ? 1.0 : 0.4;
    const emojiSize = index === selectedrating ? 1.4 : 1;
    const emojiPosition = index === selectedrating ? RF(0.01) : 0;

    return {
      fontSize: RF(5),
      opacity: emojiOpacity,
      position: 'absolute',
      top: emojiPosition,
      transform: [{ scale: emojiSize }],
    };
  };

  // Return selected rating to parent component using callback method
  toggleEmoji = (newRating, callback) => {
    this.setState({ selectedRating: newRating });
    callback(newRating);
  };

  render() {
    const { selectedRating } = this.state;
    const { onEmojiSelect } = this.props;
    return (
      <View style={styles.emojiPicker}>
        <Text style={styles.emojiPickerLabel}>Pick one of them</Text>
        <View style={styles.emojiSpacing}>
          {emojiList.map(option => (
            <View key={option.rating} style={styles.emojiContainer}>
              <Animatable.Text
                easing="ease-in-out-back"
                duration={500}
                transition={['opacity', 'scale']}
                style={this.emojiToggleStyle(option.rating, selectedRating)}
                onPress={() => this.toggleEmoji(option.rating, onEmojiSelect)}
              >
                {option.emoji}
              </Animatable.Text>
            </View>
          ))}
        </View>
      </View>
    );
  }
}

EmojiPicker.propTypes = {
  // Need onEmjoSelect function to retrun selected emoji's rating
  onEmojiSelect: PropTypes.func.isRequired,
};
