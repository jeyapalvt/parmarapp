import React, {useState} from 'react';
import {View, KeyboardAvoidingView, Platform, Text} from 'react-native';
import {BaseStyle, useTheme} from '@config';
import {Header, SafeAreaView, Icon, TextInput, Button} from '@components';
import styles from './styles';
import {useTranslation} from 'react-i18next';
import axios from 'axios';
import {RequestUrl} from '../../api';

export default function ResetPassword({navigation}) {
  const {colors} = useTheme();
  const {t} = useTranslation();
  const offsetKeyboard = Platform.select({
    ios: 0,
    android: 20,
  });

  const [email, seteEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState({email: true});
  const [emailErr, setemailErr] = useState('');
  /**
   * call when action reset pass
   */
  const onReset = async () => {
    let allErr = true;
    if (email == '') {
      setemailErr('Email Required');
      setTimeout(() => {
        setemailErr('');
      }, 2000);
      allErr = false;
    } else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/.test(email)) {
      setemailErr('Invalid Email Id');
      setTimeout(() => {
        setemailErr('');
      }, 2000);
      allErr = false;
    }

    if (allErr) {
      setLoading(true);
      try {
        const res = await axios.post(RequestUrl + 'setotpforexistinguser', {
          userName: email,
        });

        //  console.log('res.data', res.data);
        if (res.data.errorCode == 0) {
          let regStatus = 'forgetPassword';
          let userType;
          if (res.data.b2b === true) {
            userType = 'b2b';
          } else if (res.data.b2bUser === true) {
            userType = 'b2bUser';
          } else if (res.data.b2c === true) {
            userType = 'b2c';
          }
          navigation.navigate('OtpScreen', {
            regStatus: regStatus,
            userEmail: email,
            userType: userType,
          });
        }
        // res.data;
        //navigation.navigate('SignIn');
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    }
  };

  return (
    <View style={{flex: 1}}>
      <Header
        title={t('reset_password')}
        renderLeft={() => {
          return (
            <Icon
              name="arrow-left"
              size={20}
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
        <KeyboardAvoidingView
          behavior={Platform.OS === 'android' ? 'height' : 'padding'}
          keyboardVerticalOffset={offsetKeyboard}
          style={{flex: 1}}>
          <View
            style={{
              flex: 1,
              padding: 20,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <TextInput
              onChangeText={text => seteEmail(text)}
              placeholder={t('email_address')}
              success={success.email}
              value={email}
              selectionColor={colors.primary}
            />
            {emailErr && (
              <View style={{marginTop: 10}}>
                <Text style={{color: 'red'}}>{emailErr}</Text>
              </View>
            )}
            <Button
              style={{marginTop: 20}}
              full
              onPress={() => {
                onReset();
              }}
              loading={loading}>
              {t('reset_password')}
            </Button>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
