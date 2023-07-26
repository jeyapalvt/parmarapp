import React from 'react';
import {TouchableOpacity, StyleSheet, ActivityIndicator} from 'react-native';
import {BaseColor, useTheme} from '@config';
import PropTypes from 'prop-types';
import {Text} from '@components';
import styles from './styles';

export default function TimeSlotButton(props) {
  const {colors} = useTheme();
  const {
    style,
    styleText,
    icon,
    outline,
    full,
    round,
    green,
    red,
    yellow,
    loading,
    children,
    ...rest
  } = props;

  return (
    <TouchableOpacity
      {...rest}
      style={StyleSheet.flatten([
        [styles.default, {backgroundColor: red ? '#dc3545' : yellow ? '#ffc107' : '#28a745' }],
        outline && [
          styles.outline,
          {backgroundColor: colors.card, borderColor: colors.primary},
        ],
        full && styles.full,
        round && styles.round,
        style,
      ])}
      activeOpacity={0.9}>
      {icon ? icon : null}
      <Text
        style={StyleSheet.flatten([
          styles.textDefault,
          outline && {color: colors.primary},
          styleText,
        ])}
        numberOfLines={2}>
        {children || 'Button'}
      </Text>
      {loading ? (
        <ActivityIndicator
          size="small"
          color={outline ? colors.primary : BaseColor.whiteColor}
          style={{paddingLeft: 5}}
        />
      ) : null}
    </TouchableOpacity>
  );
}

TimeSlotButton.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  icon: PropTypes.node,
  outline: PropTypes.bool,
  full: PropTypes.bool,
  round: PropTypes.bool,
  loading: PropTypes.bool,
};

TimeSlotButton.defaultProps = {
  style: {},
  icon: null,
  outline: false,
  full: false,
  round: false,
  loading: false,
};
