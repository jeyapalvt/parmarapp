import React, {useState, useEffect} from 'react';
import {
  View,
  Switch,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import {BaseStyle, useTheme, Images} from '@config';
import {
  Header,
  SafeAreaView,
  Icon,
  Text,
  TextInput,
  Button,
  Image,
} from '@components';
import {useTranslation} from 'react-i18next';
import styles from './styles';
import {
  useStripe,
  CardField,
  StripeProvider,
} from '@stripe/stripe-react-native';
import {useSelector, useDispatch} from 'react-redux';
import axios from 'axios';
import {RequestUrl} from '../../api';
const StripPay = ({navigation, route}) => {
  const dispatch = useDispatch();
  const {confirmPayment} = useStripe();
  const ticketFor = route.params.ticketFor;
  const bookTotal = route.params.bookTotal;
  const bookData = useSelector(
    state => state.dataforonlinepay.bookdataOnline.submitData,
  );
  const apiServerRes = useSelector(state => state.apiserverres);
  const apiData = useSelector(state => state.apibook);
  const apiDataLocal = useState(apiData.firstSubmit.submitData);
  const serverData = useState(apiServerRes.apiServerRes.responceData);

  const {colors} = useTheme();
  const {t} = useTranslation();
  const offsetKeyboard = Platform.select({
    ios: 0,
    android: 20,
  });

  const [loading, setLoading] = useState(false);

  const [serverRes, setserverRes] = useState('');

  const [paymentKey, setpaymentKey] = useState('');
  useEffect(() => {
    // createIntent();
    onAddPayment();
  }, []);

  const onAddPayment = async () => {
    setserverRes('');
    try {
      const res = await axios.post(
        RequestUrl + 'setStripePaymentsDetailForMobile',
        {paymentAmount: bookTotal},
      );

      setLoading(false);

      if (res.data.clientSecret != '') {
        // paymentStatus(res.data.clientSecret);
        setpaymentKey(res.data.clientSecret);
      }
    } catch (error) {
      //('error', error);
      setserverRes('Error On Payment Server');
      setLoading(false);
    }
  };

  const makePayment = async () => {
    setserverRes('');
    setLoading(true);
    const {paymentIntent, error} = await confirmPayment(paymentKey, {
      paymentMethodType: 'Card',
      billingDetails: {
        email: 'parmartoursdubai@gmail.com',
      },
    });

    if (error) {
      setLoading(false);
      // console.log('error', error);
      setserverRes(error.message);
      // Handle error here
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      // Handle successful payment here
      setLoading(false);
      if (ticketFor == 'dated') {
        bookDatedTicet();
      } else if (ticketFor == 'open') {
        bookOpenTicket();
      } else if (ticketFor == 'combo') {
        bookComboTicket();
      }
    }
  };

  const bookDatedTicet = () => {
    const submitData = {
      bookedByBackOffice: serverData[0].bookedByBackOffice,
      bookedCreditLimit: serverData[0].bookedCreditLimit,
      superAdminId: serverData[0].superAdminId,
      attractionId: serverData[0].attractionId,
      agencyId: serverData[0].agencyId,
      agencyUserId: serverData[0].agencyUserId,
      bookB2cId: serverData[0].bookB2cId,
      customerName: serverData[0].customerName,
      customerEmail: serverData[0].customerEmail,
      customerMobileNumber: serverData[0].customerMobileNumber,
      bookingDate: serverData[0].bookingDate,
      eventId: serverData[0].eventId,
      eventName: serverData[0].eventName,
      eventTypeId: serverData[0].eventTypeId,
      resourceId: serverData[0].resourceId,
      startDateTime: serverData[0].startDateTime,
      endDateTime: serverData[0].endDateTime,
      available: serverData[0].available,
      status: serverData[0].status,
      nofAdult: serverData[0].nofAdult,
      nofChild: serverData[0].nofChild,
      nofInfant: serverData[0].nofInfant,
      adultPrice: serverData[0].adultPrice,
      childPrice: serverData[0].childPrice,
      bookingId: serverData[0].bookingId,
      invoiceNo: serverData[0].invoiceNo,
      totalPrice: serverData[0].totalPrice,
      bookPaymentMode: serverData[0].bookPaymentMode,
      bookPaymentRefId: serverData[0].bookPaymentRefId,
      parmarTicketTypeId: apiDataLocal[0].ticketTypeId,
      ticketTypeId: apiDataLocal[0].ticketTypeId,
      bookingAddon: serverData[0].bookingAddon,
      secretKey: secretKey,
    };

    axios
      .post(RequestUrl + 'confirmBurjTicket', submitData)
      .then(response => {
        // (
        //   `response :\n\n${JSON.stringify(response.data, null, 2)}`,
        // );

        if (response.data.errCode == 0) {
          const tktPath =
            // "http://66.29.149.191:8080/filestorage/parmartour/images/" +
            'https://www.parmartours.com/filestorage/' +
            response.data.ticketFilePath;

          // ("ticket Path", tktPath)

          navigation.navigate('TicketViewer', {tktPath: tktPath});
        }
      })
      .catch(error => {
        error;
      });
  };
  const bookOpenTicket = async () => {
    await axios
      .post(RequestUrl + 'setbooking', bookData)
      .then(response => {
        setLoading(false);
        const tempData = response.data;

        if (tempData.errorCode == 505) {
          setserverRes('Adult Ticket Not Avilable');
        } else if (tempData.errorCode == 504) {
          setserverRes('Child Ticket Not Avialable');
        } else if (tempData.errorCode == 303) {
          setserverRes('Server Error');
        } else if (tempData.errorCode == 100) {
          setserverRes('Insufficient Balance');
        } else {
          const tktPath =
            'https://www.parmartours.com/filestorage/' +
            tempData.bookingTickPdfPath;
          navigation.navigate('TicketViewer', {tktPath: tktPath});
        }
      })
      .catch(error => {
        setserverRes('Some Technical Error');
      });
  };
  const bookComboTicket = () => {
    axios
      .post(RequestUrl + 'setComboBooking', bookData)
      .then(response => {
        if (response.data.errorCode == 505 || response.data.errorCode == 504) {
          setserverRes('Ticket Not Available');
        } else if (response.data.errorCode == 100) {
          setserverRes('Some Technical Problem from server side');
        } else {
          const tktPath =
            // "http://66.29.149.191:8080/filestorage/parmartour/images/" +
            'https://www.parmartours.com/filestorage/' +
            response.data.bookingTickPdfPath;
          navigation.navigate('TicketViewer', {tktPath: tktPath});
        }
      })
      .catch(error => {
        error;
      });
  };

  return (
    <View style={{flex: 1}}>
      <Header
        title={t('add_payment_method')}
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

      <StripeProvider
        //pk_live_51JQoFpBSCrSWtYu19dX95mhwnWQonST03GMmAdNnv6Y9b4SxLOFtV9WE8PEGa7I9tJnmUBuA08x2pDx5TkX0K3mB00JP0JEeVy
        //pk_test_51JQoFpBSCrSWtYu1Ifu7QPtGeZMNPvz8DpEX22Qa1SO3is0DElnMwWydO0wglXmqaUhP2sUATMPJ5cY7Ijg3z84d00OUOrWDfW
        publishableKey="pk_live_51JQoFpBSCrSWtYu19dX95mhwnWQonST03GMmAdNnv6Y9b4SxLOFtV9WE8PEGa7I9tJnmUBuA08x2pDx5TkX0K3mB00JP0JEeVy"
        merchantIdentifier="merchant.identifier">
        <SafeAreaView
          style={BaseStyle.safeAreaView}
          edges={['right', 'left', 'bottom']}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'android' ? 'height' : 'padding'}
            keyboardVerticalOffset={offsetKeyboard}
            style={{flex: 1}}>
            <ScrollView contentContainerStyle={{padding: 20}}>
              <Text headline>{t('card_information')}</Text>
              <Image
                source={Images.creditcard}
                style={styles.promotionBanner}
              />
              <CardField
                postalCodeEnabled={false}
                cardStyle={{
                  backgroundColor: '#FFFFFF',
                  textColor: '#000000',
                }}
                style={{
                  width: '100%',
                  height: 50,
                  marginVertical: 30,
                }}
              />

              <View>
                {serverRes && (
                  <Text headline semibold style={{marginTop: 20, color: 'red'}}>
                    {serverRes}
                  </Text>
                )}
              </View>
            </ScrollView>
            {paymentKey != '' && (
              <View style={{paddingVertical: 15, paddingHorizontal: 20}}>
                <Button loading={loading} full onPress={() => makePayment()}>
                  Pay Now
                </Button>
              </View>
            )}
          </KeyboardAvoidingView>
        </SafeAreaView>
      </StripeProvider>
    </View>
  );
};

export default StripPay;
