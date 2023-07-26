// Import React Component
import React, {useState, useEffect} from 'react';

// Import React native Components
import {View, ScrollView} from 'react-native';
import {Header, SafeAreaView, Icon, Text, Button, TextInput} from '@components';
import {BaseStyle, useTheme} from '@config';
// Import RNFetchBlob for the file download
// import RNFetchBlob from 'rn-fetch-blob';
import styles from './styles';
import {useSelector} from 'react-redux';
import axios from 'axios';
import {RequestUrl, secretKey} from '../../api';

const BurjKhalifaBooking = ({navigation, route}) => {
  const {colors} = useTheme();
  //apiserverres: ApiServerRes
  const attName = route.params.attName;
  const apiServerRes = useSelector(state => state.apiserverres);
  const apiData = useSelector(state => state.apibook);
  const apiDataLocal = useState(apiData.firstSubmit.submitData);
  const serverData = useState(apiServerRes.apiServerRes.responceData);

  const [loading, setloading] = useState(false);

  const [serverRes, setserverRes] = useState('');

  const bookTicket = () => {
    // console.log('servewr res', JSON.stringify(serverData[0], null, 2));
    // console.log('apidaatyatsg', JSON.stringify(apiDataLocal[0], null, 2));

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

    // console.log(`submitData :\n\n${JSON.stringify(submitData, null, 2)}`);
    // (
    //   `submitData :\n\n${JSON.stringify(submitData, null, 2)}`,
    // );
    //confirmBurjTicket
    axios
      .post(RequestUrl + 'confirmBurjTicket', submitData)
      .then(response => {
        // (
        //   `response :\n\n${JSON.stringify(response.data, null, 2)}`,
        // );

        if (response.data.errCode == 700) {
          setserverRes(response.data.errMessage);
        } else if (response.data.errCode == 100) {
          // ("Insufficiend balance")

          setserverRes('insufficient Balance');
        } else if (response.data.errCode == 222) {
          setserverRes(response.data.errMessage);
        } else if (response.data.errCode == 0) {
          const tktPath =
            // "http://66.29.149.191:8080/filestorage/parmartour/images/" +
            'https://www.parmartours.com/filestorage/' +
            response.data.ticketFilePath;

          // ("ticket Path", tktPath)

          navigation.navigate('TicketViewer', {tktPath: tktPath});
        }
      })
      .catch(error => {});
  };
  return (
    <View style={{flex: 1}}>
      <Header
        title="Burj Khalifa Ticket"
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
        <ScrollView contentContainerStyle={{paddingHorizontal: 20}}>
          <View style={[styles.gridSystem]}>
            <Text>Park Name</Text>
            <Text style={{flex: 1, textAlign: 'right'}}>{attName}</Text>
          </View>

          <View style={[styles.gridSystem]}>
            <Text>Booking Customer Name</Text>
            <Text style={{flex: 1, textAlign: 'right'}}>
              {serverData[0].customerName && serverData[0].customerName}
            </Text>
          </View>

          <View style={[styles.gridSystem]}>
            <Text>Your Email</Text>
            <Text style={{flex: 1, textAlign: 'right'}}>
              {serverData[0].customerEmail && serverData[0].customerEmail}
            </Text>
          </View>

          <View style={[styles.gridSystem]}>
            <Text>Contact</Text>
            <Text style={{flex: 1, textAlign: 'right'}}>
              {serverData[0].customerMobileNumber &&
                serverData[0].customerMobileNumber}
            </Text>
          </View>

          <View style={[styles.gridSystem]}>
            <Text>Number Of Adult</Text>
            <Text style={{flex: 1, textAlign: 'right'}}>
              {serverData[0].nofAdult && serverData[0].nofAdult}
            </Text>
          </View>

          <View style={[styles.gridSystem]}>
            <Text>Number Of Child</Text>
            <Text style={{flex: 1, textAlign: 'right'}}>
              {serverData[0].nofChild && serverData[0].nofChild}
            </Text>
          </View>

          <View style={[styles.gridSystem]}>
            <Text>Date</Text>
            <Text style={{flex: 1, textAlign: 'right'}}>
              {serverData[0].startDateTime &&
                serverData[0].startDateTime.slice(0, 10)}
            </Text>
          </View>

          <View style={[styles.gridSystem]}>
            <Text>Time</Text>
            <Text style={{flex: 1, textAlign: 'right'}}>
              {serverData[0].startDateTime &&
                serverData[0].startDateTime.slice(11, 16)}
            </Text>
          </View>

          <View style={[styles.gridSystem]}>
            <Text>Total Amount</Text>
            <Text style={{flex: 1, textAlign: 'right'}}>
              {serverData[0].totalPrice && serverData[0].totalPrice}
            </Text>
          </View>

          <View>
            {serverRes && (
              <Text headline semibold style={{marginTop: 20, color: 'red'}}>
                {serverRes}
              </Text>
            )}
          </View>
        </ScrollView>
        <View style={{paddingHorizontal: 20, paddingVertical: 15}}>
          <Button full loading={loading} onPress={() => bookTicket()}>
            Book Now
          </Button>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default BurjKhalifaBooking;
