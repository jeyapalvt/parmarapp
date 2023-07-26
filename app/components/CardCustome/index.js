import React from 'react';
import {View, TouchableOpacity, Text} from 'react-native';
import styles from './styles';
import PropTypes from 'prop-types';
import {Image} from '@components';
import {Images, useTheme} from '@config';
import { ImagePath } from '../../api';


export default function CardCustome(props) {
  const {colors} = useTheme();
  const {style, children, styleContent, image, onPress} = props;
  return (
    <TouchableOpacity
      style={[styles.card, {borderColor: colors.border}, style]}
      onPress={onPress}
      activeOpacity={0.9}>
      <Image source={{uri: ImagePath+image}} style={styles.imageBanner} />
      <View style={[styles.content, styleContent]}>{children}</View>
    </TouchableOpacity>
    
  );
}

CardCustome.propTypes = {
  image: PropTypes.node.isRequired,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  styleContent: PropTypes.object,
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element),
  ]),
  onPress: PropTypes.func,
};

CardCustome.defaultProps = {
  image: Images.profile2,
  style: {},
  styleContent: {},
  onPress: () => {},
};
