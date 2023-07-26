import React, {useState, useEffect} from 'react';
import {
  View,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Text,
} from 'react-native';
import {BaseStyle, useTheme} from '@config';
import {Header, SafeAreaView, Icon, TextInput, Button} from '@components';
import styles from './styles';
import {useTranslation} from 'react-i18next';
import axios from 'axios';
import {RequestUrl} from '../../api';

export default function OtpScreen({route, navigation}) {
  const {colors} = useTheme();
  const {t} = useTranslation();
  const offsetKeyboard = Platform.select({
    ios: 0,
    android: 20,
  });

  const regStatus = route.params.regStatus;
  const userEmail = route.params.userEmail;
  const userType = route.params.userType;
  const [otp, setotp] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState({otp: true});

  const [counter, setCounter] = useState(120);
  const [startCountdown, setStartCountdown] = useState(false);
  const [showMsg, setshowMsg] = useState('');
  const [serverRes, setserverRes] = useState('');
  const [showLogin, setshowLogin] = useState(false);
  /**
   * call when action reset pass
   */
  useEffect(() => {
    //  ('regStatus', regStatus, 'userEmail', userEmail);
    if (regStatus == 'veryfyotp') {
      //  getOtp();
      //  getOtp();
      setshowMsg('Please enter OTP, that sent to your registered email ');
    } else if (regStatus == 'forgetPassword') {
      setshowMsg('Please enter OTP, that sent to your registered email ');
    } else {
      setshowMsg('Please enter OTP, that sent to your registered email ');
    }
  }, []);
  useEffect(() => {
    if (startCountdown) {
      const timer =
        counter > 0 && setInterval(() => setCounter(counter - 1), 1000);
      if (counter === 0) {
        // countdown is finished
        setStartCountdown(false);
      }
      return () => clearInterval(timer);
    }
  }, [counter, startCountdown]);

  const reset = () => {};
  const getOtp = async () => {
    try {
      const res = await axios.post(RequestUrl + 'setotpforexistinguser', {
        userName: userEmail,
      });
      setCounter(120);
      setStartCountdown(true);
      // ('res', res.data);
    } catch (error) {
      error;
    }
  };
  const onSubmit = async () => {
    setshowLogin(false);
    if (otp == '') {
      setSuccess({
        ...success,
        otp: false,
      });
    } else {
      let b2b = false,
        b2c = false,
        b2bUser = false;
      if (userType === 'b2b') {
        b2b = true;
      } else if (userType === 'b2c') {
        b2c = true;
      } else if (userType === 'b2bUser') {
        b2bUser = true;
      }
      const userData = {
        b2c: b2c,
        b2b: b2b,
        b2bUser: b2bUser,
        userName: userEmail,
        otp: otp,
      };
      setLoading(true);
      // console.log('user', userData);
      try {
        const res = await axios.post(RequestUrl + 'verifyotpuser', userData);
        console.log('res', res.data);
        const tempRes = res.data;
        if (tempRes.errorCode == 102) {
          setserverRes('Invalid OTP');
          setTimeout(() => {
            setserverRes('');
          }, 2000);
        } else if (tempRes.errorCode == 100) {
          if (regStatus == 'forgetPassword') {
            setTimeout(() => {
              navigation.navigate('NewPassword', {
                regStatus: 'forgetPassword',
                userEmail: userEmail,
                userType: userType,
              });
            }, 2500);
          } else {
            setserverRes(
              'OTP Verified, please login with your Email ID and Password',
            );

            setshowLogin(true);
            // setTimeout(() => {
            //   navigation.navigate('LoginScreen');
            // }, 5000);
          }
        }

        setLoading(false);
      } catch (error) {
        //(error);
        setLoading(false);
      }

      //  navigation.navigate('SignIn');
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
            <Text>{showMsg}</Text>
            <TextInput
              style={{marginTop: 10}}
              onChangeText={text => setotp(text)}
              placeholder="OTP"
              success={success.otp}
              value={otp}
            />
            <Button
              style={{marginTop: 20}}
              full
              onPress={() => {
                onSubmit();
              }}
              loading={loading}>
              Verify Now
            </Button>
            {serverRes && (
              <Text style={{marginTop: 20, color: 'red'}}>{serverRes}</Text>
            )}
            {startCountdown ? (
              <Text style={{marginTop: 20, color: 'red'}}>{counter}</Text>
            ) : (
              <TouchableOpacity onPress={() => getOtp()}>
                <Text body1 grayColor style={{marginTop: 25}}>
                  Resent OTP
                </Text>
              </TouchableOpacity>
            )}
            {showLogin && (
              <TouchableOpacity
                //PreviewPayment   SignUp
                onPress={() => navigation.navigate('LoginScreen')}>
                <Text body1 grayColor style={{marginTop: 25}}>
                  Login
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
