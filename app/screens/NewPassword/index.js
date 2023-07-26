import React, {useState} from 'react';
import {View, KeyboardAvoidingView, Platform, Text} from 'react-native';
import {BaseStyle, useTheme} from '@config';
import {Header, SafeAreaView, Icon, TextInput, Button} from '@components';
import styles from './styles';
import {useTranslation} from 'react-i18next';
import axios from 'axios';
import {RequestUrl} from '../../api';

export default function NewPassword({route, navigation}) {
  const {colors} = useTheme();
  const {t} = useTranslation();
  const offsetKeyboard = Platform.select({
    ios: 0,
    android: 20,
  });
  const regStatus = route.params.regStatus;
  const userEmail = route.params.userEmail;
  const userType = route.params.userEmail;

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState({email: true});
  const [password, setPassword] = useState('');
  const [conpassword, setConpassword] = useState('');

  const [passwordErr, setpasswordErr] = useState('');
  const [conpassErr, setconpassErr] = useState('');

  const [severRes, setseverRes] = useState('');
  /**
   * call when action reset pass
   */
  const onReset = async () => {
    let allErr = true;

    if (password == '') {
      setpasswordErr('Password Required');
      setTimeout(() => {
        setpasswordErr('');
      }, 2000);
      allErr = false;
    } else if (password.length < 8) {
      setpasswordErr('Minimum be 8 characters or more');
      setTimeout(() => {
        setpasswordErr('');
      }, 2000);
      allErr = false;
    } else if (!/[A-Z]/.test(password)) {
      setpasswordErr('Minimum one upper Case');
      setTimeout(() => {
        setpasswordErr('');
      }, 2000);
      allErr = false;
    } else if (!/[\d`~!@#$%\^&*()+=|;:'",.<>\/?\\\-]/.test(password)) {
      setpasswordErr('Minimum one special Charecter');
      setTimeout(() => {
        setpasswordErr('');
      }, 2000);
      allErr = false;
    }

    if (conpassword == '') {
      setconpassErr('Password Required');
      setTimeout(() => {
        setconpassErr('');
      }, 2000);
      allErr = false;
    } else if (password != conpassword) {
      setconpassErr('Password Miss Matched');
      setTimeout(() => {
        setconpassErr('');
      }, 2000);
      allErr = false;
    }

    let b2b = false,
      b2c = false,
      c = false;
    if (userType === 'b2b') {
      b2b = true;
    } else if (userType === 'b2c') {
      b2c = true;
    } else if (userType === 'b2bUser') {
      b2bUser = true;
    }
    if (allErr == true) {
      const userData = {
        userName: userEmail,
        b2c: b2c,
        b2b: b2b,
        b2bUser: b2c,
        password: conpassword,
      };
      setLoading(true);
      try {
        const res = await axios.post(
          RequestUrl + 'updatePasswordForUser',
          userData,
        );

        //    (res.data);
        if (res.data.errorCode == 0) {
          setseverRes('Your Password updated, please login with new password');
          setTimeout(() => {
            navigation.navigate('LoginScreen');
          }, 5000);
        }
      } catch (error) {
        // (error);
      }
      // navigation.navigate('SignIn');
    }
  };

  return (
    <View style={{flex: 1}}>
      <Header
        title={t('reset_password')}
        // renderLeft={() => {
        //   return (
        //     <Icon
        //       name="arrow-left"
        //       size={20}
        //       color={colors.primary}
        //       enableRTL={true}
        //     />
        //   );
        // }}
        // onPressLeft={() => {
        //   navigation.goBack();
        // }}
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
              style={{marginTop: 10}}
              onChangeText={text => setPassword(text)}
              placeholder="Password"
              value={password}
              secureTextEntry={true}
              success={success.password}
            />
            {passwordErr && (
              <View style={{marginTop: 10}}>
                <Text style={{color: 'red'}}>{passwordErr}</Text>
              </View>
            )}
            <TextInput
              style={{marginTop: 10}}
              onChangeText={text => setConpassword(text)}
              placeholder="Confirm Password"
              value={conpassword}
              secureTextEntry={true}
              success={success.password}
            />
            {conpassErr && (
              <View style={{marginTop: 10}}>
                <Text style={{color: 'red'}}>{conpassErr}</Text>
              </View>
            )}

            {severRes && (
              <View style={{marginTop: 10}}>
                <Text style={{color: '#00FF00'}}>{severRes}</Text>
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
