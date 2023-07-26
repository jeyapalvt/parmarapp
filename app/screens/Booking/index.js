import React, {useState, useEffect} from 'react';
import {
  FlatList,
  RefreshControl,
  View,
  KeyboardAvoidingView,
  Text,
} from 'react-native';
import {BaseStyle, useTheme} from '@config';
import {
  Header,
  SafeAreaView,
  BookingHistory,
  Icon,
  Button,
  DatePicker,
  TextInput,
} from '@components';
import {BookingHistoryData} from '@data';
import {useTranslation} from 'react-i18next';
import styles from './styles';
import {Card} from 'react-native-paper';
import {useSelector} from 'react-redux';
import axios from 'axios';
import {RequestUrl, secretKey} from '../../api';
import {useIsFocused} from '@react-navigation/native';

export default function Booking({navigation}) {
  const isFocused = useIsFocused();
  useEffect(() => {
    if (isFocused) {
      setstartDate('');
      setendDate('');
      setbookinglist('');
    }
  }, [isFocused]);
  const {t} = useTranslation();
  const {colors} = useTheme();

  const [refreshing] = useState(false);
  const [bookingHistory] = useState(bookinglist);

  /**
   * render Item
   *
   * @param {*} item
   * @returns
   */

  const authapi = useSelector(state => state.authapi);

  const offsetKeyboard = Platform.select({
    ios: 0,
    android: 20,
  });
  const [startDate, setstartDate] = useState('');
  const [endDate, setendDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState({id: true, password: true});
  const [serverError, setserverError] = useState('');

  const [bookinglist, setbookinglist] = useState([]);
  const renderItem = item => {
    return (
      <BookingHistory
        name={item.name}
        paxName={item.paxName}
        tktType={item.tktType}
        date={item.date}
        price={item.price}
        style={{paddingVertical: 10, marginHorizontal: 20}}
      />
    );
  };

  /**
   * @description Loading booking item history one by one
   * @author Passion UI <passionui.com>
   * @date 2019-08-03
   * @returns
   */

  const dateFrom = val => {
    setstartDate(val);
  };
  const dateTo = val => {
    setendDate(val);
  };

  const getReport = () => {
    if (startDate == '' && endDate == '') {
      setserverError('plese select date range');
      setTimeout(() => {
        setserverError('');
      }, 1500);
    } else if (startDate == '' || endDate == '') {
      setserverError('plese select date range');
      setTimeout(() => {
        setserverError('');
      }, 1500);
    } else if (startDate > endDate) {
      setserverError('To date Must Be after or same date to from date');
      setTimeout(() => {
        setserverError('');
      }, 1500);
    } else {
      setLoading(true);
      axios
        .post(RequestUrl + 'getSalesReportForB2b', {
          startDate: startDate,
          endDate: endDate,
          agencyId: authapi.agencyId,
          // agencyUserId: agencyUserid,
          secretKey: secretKey,
        })
        .then(response => {
          let tempData = response.data;
          let tempArr = [];

          for (let i = 0; i < tempData.length; i++) {
            tempArr.push({
              id: tempData[i].bookingId,
              name: tempData[i].attractionName,
              paxName: tempData[i].paxName,
              tktType: tempData[i].adultOrChild,
              date: tempData[i].bookingDate.substring(0, 10),
            });
          }
          setLoading(false);
          if (tempArr == '') {
            setserverError('No Record Found');
          }

          setbookinglist(tempArr);
        })
        .catch(error => {});
    }
  };
  return (
    <View style={{flex: 1}}>
      <Header
        title="Booking History"
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

      <View
        style={[
          {
            backgroundColor: colors.background,
            borderColor: colors.border,
            shadowColor: colors.border,
            marginLeft: 20,
            marginRight: 20,
          },
        ]}>
        {authapi.success == true ? (
          <>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'android' ? 'height' : 'padding'}
              keyboardVerticalOffset={offsetKeyboard}>
              <View style={{flexDirection: 'row'}}>
                <View style={{flex: 5, marginRight: 5}}>
                  <DatePicker
                    label="List From"
                    maxDate="2030-12-31"
                    minDate={'2020-01-01'}
                    selected={startDate}
                    style={{marginTop: 10}}
                    //onDayPress={day => calTest(day)}
                    onChange={day => dateFrom(day)}
                    // onDateChange={()=> calTest(this.selected)}
                  />
                </View>
                <View style={{flex: 5, marginLeft: 5}}>
                  <DatePicker
                    label="List To"
                    maxDate="2025-12-31"
                    minDate={'2020-01-01'}
                    selected={endDate}
                    style={{marginTop: 10}}
                    //onDayPress={day => calTest(day)}
                    onChange={day => dateTo(day)}
                    // onDateChange={()=> calTest(this.selected)}
                  />
                </View>
              </View>
              {serverError && (
                <View style={{alignItems: 'center'}}>
                  <Text style={{color: 'red'}}>{serverError}</Text>
                </View>
              )}
              <Button
                style={{marginTop: 20}}
                loading={loading}
                full
                onPress={() => {
                  getReport();
                }}>
                Search
              </Button>
            </KeyboardAvoidingView>
          </>
        ) : (
          <>
            <View style={{marginTop: 30, alignItems: 'center'}}>
              <Text headline semibold primaryColor>
                Please Login And View Booking History
              </Text>
            </View>
          </>
        )}
      </View>

      <SafeAreaView style={{flex: 1}} edges={['right', 'left', 'bottom']}>
        <FlatList
          refreshControl={
            <RefreshControl
              colors={[colors.primary]}
              tintColor={colors.primary}
              refreshing={refreshing}
              onRefresh={() => {}}
            />
          }
          data={bookinglist}
          keyExtractor={(item, index) => item.id}
          renderItem={({item}) => renderItem(item)}
        />
      </SafeAreaView>
    </View>
  );
}
