import React, {useEffect} from 'react';
import {ActivityIndicator, View} from 'react-native';
import {Images, BaseColor, useTheme} from '@config';
import {Image, Text} from '@components';
import styles from './styles';

export default function Loading({navigation}) {
  const {colors} = useTheme();

  useEffect(() => {
    setTimeout(() => {
      navigation.replace('Main');
    }, 500);
  }, [navigation]);

  return (
    <View style={[styles.container, {backgroundColor: colors.whiteColor}]}>
      <Image source={Images.logo} style={styles.logo} resizeMode="contain" />
      <View style={styles.content}>
   
        <ActivityIndicator
          size="large"
          color={BaseColor.whiteColor}
          style={{
            marginTop: 20,
          }}
        />
      </View>
    </View>
  );
}
