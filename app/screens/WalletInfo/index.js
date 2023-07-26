import React, {useState} from 'react';
import {useSelector} from 'react-redux';
import {View, TouchableOpacity, Switch, ScrollView} from 'react-native';
import {BaseStyle, BaseSetting, useTheme} from '@config';
import {Header, SafeAreaView, Icon, Text} from '@components';
import {useTranslation} from 'react-i18next';
import * as Utils from '@utils';
import styles from './styles';



export default function WalletInfo({navigation}) {

  const authapi = useSelector(state => state.authapi);
  const {t, i18n} = useTranslation();
  const {colors} = useTheme();

  const [reminders, setReminders] = useState(true);

  /**
   * @description Call when reminder option switch on/off
   */


  return (
    <View style={{flex: 1}}>
      <Header
        title='Wallet Info'
        renderLeft={() => {
          return (
            <Icon
              name="arrow-left"
              size={20}c
              color={colors.primary}
              enableRTL={true}
            />
          );
        }}
        onPressLeft={() => {
          navigation.goBack();
        }}
      />
      <SafeAreaView
        style={BaseStyle.safeAreaView}
        edges={['right', 'left', 'bottom']}>
        <ScrollView contentContainerStyle={styles.contain}>
          {/* <TouchableOpacity
            style={[
              styles.profileItem,
              {borderBottomColor: colors.border, borderBottomWidth: 1},
            ]}
            onPress={() => {
              navigation.navigate('ChangeLanguage');
            }}>
            <Text body1>{t('language')}</Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Text body1 grayColor>
                {Utils.languageFromCode(i18n.language)}
              </Text>
              <Icon
                name="angle-right"
                size={18}
                color={colors.primary}
                style={{marginLeft: 5}}
                enableRTL={true}
              />
            </View>
          </TouchableOpacity> */}

          <View style={styles.profileItem}>
            <Text body1>Credit Limit</Text>
            <Text body1 grayColor>
              {authapi.creditLimit}
            </Text>
          </View>

          <View style={styles.profileItem}>
            <Text body1>Credit Utilized</Text>
            <Text body1 grayColor>
            {authapi.creditUtilized}
            </Text>
          </View>

          <View style={styles.profileItem}>
            <Text body1>Current Balance</Text>
            <Text body1 grayColor>
            {authapi.currentBalance}
            </Text>
          </View>

        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
