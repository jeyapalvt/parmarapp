import React, {useState, useEffect} from 'react';
import {
  View,
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableOpacity,
} from 'react-native';
import {BaseStyle, useTheme} from '@config';
import {Header, SafeAreaView, Icon, Button, TextInput} from '@components';
import styles from './styles';
import {useTranslation} from 'react-i18next';
import axios from 'axios';
import {RequestUrl} from '../../api';
import {useDispatch} from 'react-redux';
import {AuthApiAction} from '@actions';
export default function SignUp({navigation}) {
  const {colors} = useTheme();
  const {t} = useTranslation();
  const offsetKeyboard = Platform.select({
    ios: 0,
    android: 20,
  });

  const dispatch = useDispatch();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [conpassword, setConpassword] = useState('');
  const [loading, setLoading] = useState(false);

  const [nameErr, setnameErr] = useState('');
  const [emailErr, setemailErr] = useState('');
  const [mobileErr, setmobileErr] = useState('');
  const [passwordErr, setpasswordErr] = useState('');
  const [conpassErr, setconpassErr] = useState('');
  const [serverErr, setserverErr] = useState();
  const [success, setSuccess] = useState({
    name: true,
    email: true,
    mobile: true,
    password: true,
    conpassword: true,
  });

  /**
   * call when action signup
   *
   */
  const onSignUp = async () => {
    let allErr = true;
    setserverErr('');
    if (name == '') {
      setnameErr('Name Required');
      setTimeout(() => {
        setnameErr('');
      }, 2000);
      allErr = false;
    }
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
    if (mobile == '') {
      setmobileErr('Mobile Number Required');
      setTimeout(() => {
        setmobileErr('');
      }, 2000);
      allErr = false;
    } else if (!/^-?\d+\.?\d*$/.test(mobile)) {
      setmobileErr('Only Number  Required');
      setTimeout(() => {
        setmobileErr('');
      }, 2000);
    }

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

    if (allErr) {
      //setloginuserdetails
      setLoading(true);
      const userData = {
        userName: email,
        b2c: true,
        b2b: false,
        b2bUser: false,
        customer: {
          customerName: name,
          mobileNumber: mobile,
          eMailId: email,
          password: password,
        },
      };
      // (`Login Details :\n\n${JSON.stringify(userData, null, 2)}`);
      try {
        const res = await axios.post(
          RequestUrl + 'setloginuserdetails',
          userData,
        );
        // (`Login Details :\n\n${JSON.stringify(res.data, null, 2)}`);

        const tempRes = res.data;
        if (tempRes.errorCode == 101) {
          // ('otp verify');
          let regStatus = 'veryfyotp',
            userEmail = email;

          navigation.navigate('OtpScreen', {
            regStatus: regStatus,
            userEmail: userEmail,
          });
          setLoading(false);
        } else if (tempRes.errorCode == 208) {
          setserverErr(
            'Already Registerd Please Login With Your UserName and Password ',
          );
          setLoading(false);
        } else if (tempRes.errorCode == 51) {
          setserverErr(
            'Already Registerd Please Login With Your UserName and Password ',
          );
          setLoading(false);
        } else {
          let regStatus = 'newuser',
            userEmail = email;
          navigation.navigate('OtpScreen', {
            regStatus: regStatus,
            userEmail: userEmail,
            userType: 'b2c',
          });
        }
      } catch (error) {
        setLoading(false);
        setserverErr('Someting wrong');
        setTimeout(() => {
          setserverErr('');
        }, 1500);
      }
    }
  };

  return (
    <View style={{flex: 1}}>
      <Header
        title={t('sign_up')}
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
          <View style={styles.contain}>
            <TextInput
              onChangeText={text => setName(text)}
              placeholder="Name"
              success={success.name}
              value={name}
            />
            {nameErr && (
              <View style={{marginTop: 10}}>
                <Text style={{color: 'red'}}>{nameErr}</Text>
              </View>
            )}

            <TextInput
              style={{marginTop: 10}}
              onChangeText={text => setEmail(text)}
              placeholder="E-mail"
              success={success.email}
              value={email}
            />
            {emailErr && (
              <View style={{marginTop: 10}}>
                <Text style={{color: 'red'}}>{emailErr}</Text>
              </View>
            )}
            <TextInput
              style={{marginTop: 10}}
              onChangeText={text => setMobile(text)}
              placeholder="Mobile"
              success={success.mobile}
              value={mobile}
            />
            {mobileErr && (
              <View style={{marginTop: 10}}>
                <Text style={{color: 'red'}}>{mobileErr}</Text>
              </View>
            )}
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
            {serverErr && (
              <View style={{marginTop: 10}}>
                <Text style={{color: 'red'}}>{serverErr}</Text>
              </View>
            )}
            <Button
              full
              style={{marginTop: 20}}
              loading={loading}
              onPress={() => onSignUp()}>
              {t('sign_up')}
            </Button>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
