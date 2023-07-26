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
import {useSelector, useDispatch} from 'react-redux';
import {onlineticketBook} from '@actions';

export default function ComboBook({route, navigation, props}) {
  // const tourPackageId = route.params.tourPackageId;
  // const tourName = route.params.tourName;

  const [childPrice, setchildPrice] = useState('');
  const [adultPrice, setadultPrice] = useState('');
  const ComboOfferId = route.params.ComboOfferId;
  const offerPrice = route.params.offerPrice;
  const offerChildPrice = route.params.offerChildPrice;
  const offerB2bAdultPrice = route.params.offerB2bAdultPrice;
  const offerB2bChildPrice = route.params.offerB2bChildPrice;

  const authapi = useSelector(state => state.authapi);
  const login = authapi.success;
  const dispatch = useDispatch();
  // ("authapi", authapi);
  const {colors} = useTheme();
  const {t} = useTranslation();
  const offsetKeyboard = Platform.select({
    ios: 0,
    android: 20,
  });

  const [showPayMethod, setshowPayMethod] = useState(false);
  useEffect(() => {
    if (
      authapi.userType == 1 ||
      authapi.userType == 2 ||
      authapi.userType == 3
    ) {
      setshowPayMethod(true);
      setchildPrice(offerB2bChildPrice);
      setadultPrice(offerB2bAdultPrice);
    } else if (authapi.userType == 4) {
      setbookPayMethod(1);
      setchildPrice(offerPrice);
      setadultPrice(offerChildPrice);
    }

    // console.log('offerPrice', offerPrice);
    // console.log('offerChildPrice', offerChildPrice);

    // console.log('offerB2bAdultPrice', offerB2bAdultPrice);
    // console.log('offerB2bChildPrice', offerB2bChildPrice);
  }, []);

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
  const [adult, setadult] = useState('');
  const [child, setchild] = useState('');
  const [bookdate, setbookDate] = useState('');

  const [bookPayMethod, setbookPayMethod] = useState(2);
  //Error state
  const [contactNameErr, setContactNameErr] = useState('');
  const [emailErr, setEmailErr] = useState('');
  const [phoneErr, setPhoneErr] = useState('');
  const [msgErr, setmsgErr] = useState('');
  const [adultErr, setadultErr] = useState('');
  const [childErr, setchildErr] = useState('');
  const [bookdateErr, setbookDateErr] = useState('');
  //const [allErr, setallErr] = useState(false)
  const [serverRes, setserverRes] = useState('');

  const radioButtonsData = [
    {
      id: '1', // acts as primary key, should be unique and non-empty string
      label: 'Online',
      value: '1',
    },
    {
      id: '2',
      label: 'Credit',
      value: '2',
      selected: true,
    },
  ];
  const [radioButtons, setRadioButtons] = useState(radioButtonsData);

  function onPressRadioButton(radioButtonsArray) {
    for (let i = 0; i < radioButtonsArray.length; i++) {
      if (radioButtonsArray[i].selected) {
        setbookPayMethod(radioButtonsArray[i].value);
      }
    }

    setRadioButtons(radioButtonsArray);
  }

  const dateFun = val => {
    setbookDate(val);
  };

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
    if (adult == '') {
      setadultErr('Minimum One Persion');
      allErr = false;
    } else {
      setadultErr('');
    }
    if (phone == '') {
      setbookDateErr('Date Required');
      allErr = false;
    } else {
      setbookDateErr('');
    }

    var currentdate = new Date();

    let booktotal = Number(adult * adultPrice) + Number(child * childPrice);

    const sumbmitData = {
      comboId: ComboOfferId,
      superAdminId: 0,
      bookCustomerName: contactName,
      bookMobileNumber: phone,
      bookCustomerEmail: email,
      bookPaymentMode: bookPayMethod,
      bookTravellDate: bookdate,
      bookTotal: booktotal,
      bookNofAdult: adult,
      bookNofChild: child,
      bookB2bId: authapi.agencyId,
      apiTicket: 'false',
      bookedByBackOffice: 'false',
      secretKey: 'uZFEucIHAbqvgT7p87qC4Ms4tjqG34su',
    };

    if (allErr == true) {
      if (login == true) {
        if (bookPayMethod == 2) {
          axios
            .post(RequestUrl + 'setComboBooking', sumbmitData)
            .then(response => {
              if (
                response.data.errorCode == 505 ||
                response.data.errorCode == 504
              ) {
                setserverErr('Ticket Not Available');
              } else if (response.data.errorCode == 100) {
                setserverErr('Insuffecient Balance');
              } else if (response.data.errorCode == 100) {
                setserverErr('Some Technical Problem from server side');
              } else {
                const tktPath =
                  // "http://66.29.149.191:8080/filestorage/parmartour/images/" +
                  'https://www.parmartours.com/filestorage/' +
                  response.data.bookingTickPdfPath;
                navigation.navigate('TicketViewer', {tktPath: tktPath});

                setContactName('');
                setEmail('');
                setPhone('');
                setadult('');
                setchild('');
                setbookDate('');
              }
            })
            .catch(error => {});
        } else {
          dispatch(onlineticketBook.submitsaveOnlineBookData(sumbmitData));
          setContactName('');
          setEmail('');
          setPhone('');
          setadult('');
          setchild('');
          setbookDate('');
          navigation.navigate('StripPay', {
            ticketFor: 'combo',
            bookTotal: booktotal,
          });
          // setserverErr('Now Booking Only Using Credit');
        }
      } else {
        setLoading(false);
        navigation.navigate('LoginScreen');
      }
    } else {
      setTimeout(() => {
        setLoading(false);
        setContactNameErr('');
        setEmailErr('');
        setPhoneErr('');
        setadultErr('');
        setbookDateErr('');
      }, 2500);
    }

    // `Ticket Price:\n\n${JSON.stringify(sumbmitData, null, 2)}`;
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

            <View style={{flexDirection: 'row', marginTop: 10}}>
              <View style={{flex: 5}}>
                <TextInput
                  onChangeText={text => setadult(text)}
                  keyboardType="numeric"
                  placeholder="Adult"
                  value={adult}
                />
                {adultPrice && <Text>{'  ' + adultPrice + ' AED'}</Text>}
                {adultErr && <Text style={{color: 'red'}}>{adultErr}</Text>}
              </View>
              <View style={styles.inputItem}>
                <TextInput
                  onChangeText={text => setchild(text)}
                  placeholder="Child"
                  value={child}
                />
                {childPrice && <Text>{'  ' + childPrice + ' AED'}</Text>}
              </View>
            </View>

            <View>
              <DatePicker
                label="Travel Date"
                maxDate="2030-12-31"
                selected=""
                style={{flex: 7, marginTop: 10}}
                //onDayPress={day => calTest(day)}
                onChange={day => dateFun(day)}
                // onDateChange={()=> calTest(this.selected)}
              />
              {bookdateErr && <Text style={{color: 'red'}}>{bookdateErr}</Text>}
            </View>
            {showPayMethod && (
              <View style={{marginTop: 10}}>
                <Text>Select Payment Method</Text>
                <RadioGroup
                  radioButtons={radioButtons}
                  onPress={onPressRadioButton}
                  layout="row"
                />
              </View>
            )}

            <View style={{flexDirection: 'row', marginTop: 10}}>
              <View style={{flex: 5}}>
                <Text headline semibold style={{marginTop: 20}}>
                  Total Amount
                </Text>
              </View>

              <View style={styles.inputItem}>
                <Text headline semibold style={{marginTop: 20}}>
                  {Number(adult * adultPrice) + Number(child * childPrice)}
                </Text>
              </View>
            </View>

            <View>
              {serverErr && (
                <Text headline semibold style={{marginTop: 20, color: 'red'}}>
                  {serverErr}
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
