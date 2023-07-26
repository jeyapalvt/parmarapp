import React, {useState, useEffect} from 'react';

import {
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  I18nManager,
  Linking,
} from 'react-native';
import {BaseStyle, BaseColor, useTheme} from '@config';
import {
  Header,
  SafeAreaView,
  TextInput,
  Icon,
  Text,
  Button,
  DatePicker,
} from '@components';
import {useTranslation} from 'react-i18next';
import styles from './styles';
import {RequestUrl, secretKey} from '../../api';
import axios from 'axios';
import RadioGroup from 'react-native-radio-buttons-group';
import ModalSelector from 'react-native-modal-selector';
import {useSelector} from 'react-redux';

export default function TourBook({route, navigation, props}) {
  const tourPackageId = route.params.tourPackageId;
  const tourName = route.params.tourName;

  const authapi = useSelector(state => state.authapi);
  const login = authapi.success;

  // ("authapi", authapi);
  const {colors} = useTheme();
  const {t} = useTranslation();
  const offsetKeyboard = Platform.select({
    ios: 0,
    android: 20,
  });

  const [showPayMethod, setshowPayMethod] = useState(false);
  useEffect(() => {}, []);

  /**
   *
   *
   *
   *
   *
   * Called when process checkout
   *
   * const [loading, setLoading] = useState(false);
   */

  const [serverErr, setserverErr] = useState('');

  const [loading, setLoading] = useState(false);
  const onCheckOut = () => {
    const bookingType = route.params?.bookingType;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      switch (bookingType) {
        case 'Event':
          navigation.navigate('EventTicket');
          break;
        case 'Bus':
          navigation.navigate('BusTicket');
          break;
        default:
          navigation.navigate('PaymentMethod');
          break;
      }
    }, 500);
  };

  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setmessage] = useState('');
  //Error state
  const [contactNameErr, setContactNameErr] = useState('');
  const [emailErr, setEmailErr] = useState('');
  const [phoneErr, setPhoneErr] = useState('');
  const [msgErr, setmsgErr] = useState('');

  const [serverRes, setserverRes] = useState('');
  //const [allErr, setallErr] = useState(false)
  const bookTicket = e => {
    // navigation.navigate('TicketViewer', {pdfPath: pdfPath});
    // e.preventdefault()
    setLoading(true);

    let allErr = true;

    setserverErr('');
    if (contactName == '') {
      setContactNameErr('Name Required');
      allErr = false;
    } else {
      setContactNameErr('');
    }
    if (email == '') {
      setEmailErr('Email Required');
      allErr = false;
    } else {
      setEmailErr('');
    }
    if (phone == '') {
      setPhoneErr('Mobile Required');
      allErr = false;
    } else {
      setPhoneErr('');
    }
    if (message == '') {
      setmsgErr('Required');
      allErr = false;
    } else {
      setmsgErr('');
    }

    var currentdate = new Date();
    const enquiryData = {
      enquiryId: '',
      tourPackageId: tourPackageId,
      tourPackageName: tourName,
      enqCusName: contactName,
      enqEmail: email,
      enqMobileNumber: phone,
      enqMessage: message,
      enquiryDate: currentdate,
      enqFollowUpStatus: '',
    };

    if (allErr == true) {
      axios
        .post(RequestUrl + 'setenquiry', enquiryData)
        .then(response => {
          setserverRes(
            'Thank You For Your Query, Our Executive Will Contact Soon',
          );
          setTimeout(() => {
            setLoading(false);
            setContactName('');
            setEmail('');
            setPhone('');
            setmessage('');
          }, 2500);
        })
        .catch(error => {});
    } else {
      setTimeout(() => {
        setLoading(false);
        setContactNameErr('');
        setEmailErr('');
        setPhoneErr('');
        setmsgErr('');
      }, 2500);
    }
  };

  return (
    <View style={{flex: 1}}>
      <Header
        title="Book Now"
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
        renderRight={() => {
          return (
            <Text headline primaryColor numberOfLines={1}>
              {t('reset')}
            </Text>
          );
        }}
        onPressLeft={() => {
          navigation.goBack();
        }}
        onPressRight={() => {}}
      />
      <SafeAreaView
        style={BaseStyle.safeAreaView}
        edges={['right', 'left', 'bottom']}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'android' ? 'height' : 'padding'}
          keyboardVerticalOffset={offsetKeyboard}
          style={{flex: 1}}>
          <ScrollView contentContainerStyle={{paddingHorizontal: 20}}>
            <Text headline semibold style={{marginTop: 20}}>
              Book Your Ticket
            </Text>
            <View>
              <TextInput
                style={{marginTop: 10}}
                onChangeText={text => setContactName(text)}
                placeholder="Name"
                value={contactName}
              />
              {contactNameErr && (
                <Text style={{color: 'red'}}>{contactNameErr}</Text>
              )}
            </View>

            <View>
              <TextInput
                style={{marginTop: 10}}
                onChangeText={text => setEmail(text)}
                placeholder="E-Mail"
                value={email}
              />
              {emailErr && <Text style={{color: 'red'}}>{emailErr}</Text>}
            </View>

            <View>
              <TextInput
                style={{marginTop: 10}}
                onChangeText={text => setPhone(text)}
                placeholder="Contact Number"
                value={phone}
              />
              {phoneErr && <Text style={{color: 'red'}}>{phoneErr}</Text>}
            </View>

            <View>
              <TextInput
                style={{marginTop: 10}}
                onChangeText={text => setmessage(text)}
                placeholder="Message"
                value={message}
              />
              {msgErr && <Text style={{color: 'red'}}>{msgErr}</Text>}
            </View>

            <View>
              {serverRes && (
                <Text
                  headline
                  semibold
                  style={{marginTop: 20, color: '#006400'}}>
                  {serverRes}
                </Text>
              )}
            </View>
          </ScrollView>
          <View style={{paddingHorizontal: 20, paddingVertical: 15}}>
            <Button loading={loading} full onPress={() => bookTicket()}>
              Book Now
            </Button>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
