import React, {useState} from 'react';
import {View, ScrollView, TouchableOpacity} from 'react-native';
import {useDispatch} from 'react-redux';
import {AuthActions, AuthApiAction} from '@actions';
import {BaseStyle, useTheme} from '@config';
import {
  Header,
  SafeAreaView,
  Icon,
  Text,
  Button,
  ProfileDetail,
  ProfilePerformance,
} from '@components';
import styles from './styles';
import {UserData} from '@data';
import {useTranslation} from 'react-i18next';
import {useSelector} from 'react-redux';

export default function Profile({navigation}) {
  const authapi = useSelector(state => state.authapi);

  // ("AUthAPi", authapi)
  const {colors} = useTheme();
  const {t} = useTranslation();

  const [loading, setLoading] = useState(false);
  const [userData] = useState(UserData[0]);
  const dispatch = useDispatch();

  /**
   * @description Simple logout with Redux
   * @author Passion UI <passionui.com>
   * @date 2019-08-03
   */
  const onLogOut = () => {
    setLoading(true);
    dispatch(AuthApiAction.authenticationapi(0, false, response => {}));
  };

  // ('sjhdisbdisdbsds', authapi);
  return (
    <View style={{flex: 1}}>
      <Header
        title={t('profile')}
        // renderRight={() => {
        //   return <Icon name="bell" size={24} color={colors.primary} />;
        // }}
        // onPressRight={() => {
        //   navigation.navigate('Notification');
        // }}
      />
      <SafeAreaView
        style={BaseStyle.safeAreaView}
        edges={['right', 'left', 'bottom']}>
        <ScrollView>
          <View style={styles.contain}>
            <ProfileDetail
              image={userData.image}
              textFirst={authapi.userName}
              textSecond={authapi.userEmail}
            />

            <TouchableOpacity
              style={[
                styles.profileItem,
                {borderBottomColor: colors.border, borderBottomWidth: 1},
              ]}
              onPress={() => {
                navigation.navigate('ProfileEdit');
              }}>
              <Text body1>{t('edit_profile')}</Text>
              <Icon
                name="angle-right"
                size={18}
                color={colors.primary}
                style={{marginLeft: 5}}
                enableRTL={true}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.profileItem,
                {borderBottomColor: colors.border, borderBottomWidth: 1},
              ]}
              onPress={() => {
                navigation.navigate('ChangePassword');
              }}>
              <Text body1>{t('change_password')}</Text>
              <Icon
                name="angle-right"
                size={18}
                color={colors.primary}
                style={{marginLeft: 5}}
                enableRTL={true}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.profileItem,
                {borderBottomColor: colors.border, borderBottomWidth: 1},
              ]}
              onPress={() => {
                navigation.navigate('Setting');
              }}>
              <Text body1>{t('setting')}</Text>
              <Icon
                name="angle-right"
                size={18}
                color={colors.primary}
                style={{marginLeft: 5}}
                enableRTL={true}
              />
            </TouchableOpacity>
            {/* 
            <TouchableOpacity
              style={[
                styles.profileItem,
               
              ]}
              onPress={() => {
                navigation.navigate('WalletInfo');
              }}>
              <Text body1>Wallet Info</Text>
              <Icon
                name="angle-right"
                size={18}
                color={colors.primary}
                style={{marginLeft: 5}}
                enableRTL={true}
              />
            </TouchableOpacity> */}

            {authapi.userType == 1 || authapi.userType == 2 ? (
              <>
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
              </>
            ) : (
              <></>
            )}
          </View>
        </ScrollView>
        <View style={{paddingHorizontal: 20, paddingVertical: 15}}>
          <Button full loading={loading} onPress={() => onLogOut()}>
            {t('sign_out')}
          </Button>
        </View>
      </SafeAreaView>
    </View>
  );
}
