import React, {useState, useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {AuthActions, AuthApiAction} from '@actions';

import {
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {BaseStyle, useTheme} from '@config';
import {Header, SafeAreaView, Icon, Text, Button, TextInput} from '@components';
import styles from './styles';
import axios from 'axios';
import {RequestUrl} from '../../api';

export default function LoginScreen({navigation}) {
  const {colors} = useTheme();
  const offsetKeyboard = Platform.select({
    ios: 0,
    android: 20,
  });
  const [userName, setuserName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState({userName: true, password: true});
  const [serverError, setserverError] = useState('');
  const dispatch = useDispatch();
  /**
   * call when action login
   *
   */
  useEffect(() => {
    setserverError('');
    setuserName('');
    setPassword('');
  }, []);

  const onLogin = () => {
    setserverError('');
    if (userName == '' && password == '') {
      setserverError('User name & Password Required');
      setTimeout(() => {
        setserverError('');
      }, 1500);
    } else if (userName == '') {
      setserverError('User name Required');
      setTimeout(() => {
        setserverError('');
      }, 1500);
    } else if (password == '') {
      setserverError('Password  Required');
      setTimeout(() => {
        setserverError('');
      }, 1500);
    } else {
      setLoading(true);

      axios
        .post(RequestUrl + 'getloginuserdetails', {
          userName: userName,
          password: password,
        })
        .then(response => {
          console.log(response.data);
          let tempData = response.data,
            agencyId,
            userType,
            userName,
            userMobile,
            userEmail,
            creditLimit = 'null',
            currentBalance = 'null',
            creditUtilized = 'null';

          if (tempData.errorCode == 420) {
            setserverError('Invalid User E-Mail Or Password');

            setLoading(false);
          } else if (tempData.errorCode == 100) {
            setserverError('Someting wrong');
            setTimeout(() => {
              setserverError('');
            }, 1500);
            setLoading(false);
          } else if (tempData.errorCode == 0) {
            agencyId = tempData.customer.customerId;
            userName = tempData.customer.customerName;
            userEmail = tempData.customer.eMailId;
            userMobile = tempData.customer.mobileNumber;
            creditLimit = 0;
            currentBalance = 0;
            creditUtilized = 0;
            userType = 4;
            dispatch(
              AuthApiAction.authenticationapi(
                agencyId,
                true,
                userType,
                userName,
                userEmail,
                userMobile,
                creditLimit,
                currentBalance,
                creditUtilized,
                '',
                response => {
                  setLoading(false);
                  navigation.goBack();
                },
              ),
            );
          } else if (tempData.errorCode == 301) {
            if (tempData.b2b == true) {
              agencyId = tempData.agency.agencyId;
              userName = tempData.agency.agencyName;
              userEmail = tempData.agency.agencyEmail;
              userMobile = tempData.agency.agencyPhoneNumber;
              creditLimit = tempData.agency.creditLimit;
              currentBalance = tempData.agency.currentBalance;
              creditUtilized = tempData.agency.creditUtilized;

              if (tempData.agency.superAdmin == true) {
                userType = 1;
              } else {
                userType = 2;
              }

              dispatch(
                AuthApiAction.authenticationapi(
                  agencyId,
                  true,
                  userType,
                  userName,
                  userEmail,
                  userMobile,
                  creditLimit,
                  currentBalance,
                  creditUtilized,
                  '',
                  response => {
                    setLoading(false);
                    navigation.goBack();
                  },
                ),
              );
            }
          } else if (tempData.errorCode == 302) {
            if (tempData.b2bUser == true) {
              agencyId = tempData.agencyUser.agencyId;
              userEmail = tempData.agencyUser.userEmail;
              userName =
                tempData.agencyUser.userFirstName +
                ' ' +
                tempData.agencyUser.userLastName;
              userType = 3;
              dispatch(
                AuthApiAction.authenticationapi(
                  agencyId,
                  true,
                  userType,
                  userName,
                  userEmail,
                  userMobile,
                  creditLimit,
                  currentBalance,
                  creditUtilized,
                  '',
                  response => {
                    setLoading(false);
                    navigation.goBack();
                  },
                ),
              );
            }
          } else {
            setserverError('Someting wrong');
            setTimeout(() => {
              setserverError('');
            }, 1500);
          }
        })
        .catch(error => {
          setLoading(false);
          setserverError('Someting wrong');
          setTimeout(() => {
            setserverError('');
          }, 1500);
        });
    }

    // dispatch(AuthApiAction.authenticationapi(id, password , response=>{
    //   setLoading(false);
    //   navigation.goBack();
    // } ))
    // dispatch(
    //   AuthActions.authentication(true, response => {
    //     setLoading(false);
    //     navigation.goBack();
    //   }),
    // );
  };

  return (
    <View style={{flex: 1}}>
      <Header
        title="Sign in"
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
          navigation.navigate('Home');
        }}
      />
      <SafeAreaView
        style={BaseStyle.safeAreaView}
        edges={['right', 'left', 'bottom']}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'android' ? 'height' : 'padding'}
          keyboardVerticalOffset={offsetKeyboard}
          style={{flex: 1}}>
          <View style={styles.contain}>
            <TextInput
              onChangeText={text => setuserName(text)}
              placeholder="Email ID"
              value={userName}
            />

            <TextInput
              style={{marginTop: 10}}
              onChangeText={text => setPassword(text)}
              placeholder="Password"
              secureTextEntry={true}
              value={password}
            />
            {serverError && (
              <View style={{marginTop: 10}}>
                <Text style={{color: 'red'}}>{serverError}</Text>
              </View>
            )}

            <Button
              style={{marginTop: 20}}
              full
              loading={loading}
              onPress={() => {
                onLogin();
              }}>
              Sign in
            </Button>
            <TouchableOpacity
              onPress={() => navigation.navigate('ResetPassword')}>
              <Text body1 grayColor style={{marginTop: 25}}>
                Forget Your Password?
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              //PreviewPayment   SignUp
              onPress={() => navigation.navigate('SignUp')}>
              <Text body1 grayColor style={{marginTop: 25}}>
                New User? Register Here
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

// dispatch(
//   AuthApiAction.authenticationapi(
//     agencyId,
//     true,
//     userType,
//     userName,
//     userEmail,
//     response => {
//       setLoading(false);
//       // navigation.goBack();
//     },
//   ),
// );
