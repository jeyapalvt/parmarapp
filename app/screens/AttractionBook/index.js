import React, {useState, useEffect} from 'react';

import {
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  I18nManager,
  Linking,
  ActivityIndicator,
  FlatList,
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
  TimeSlotButton,
} from '@components';
import {useTranslation} from 'react-i18next';
import styles from './styles';
import {RequestUrl, secretKey} from '../../api';
import axios from 'axios';
import RadioGroup from 'react-native-radio-buttons-group';
import ModalSelector from 'react-native-modal-selector-searchable';
import {Checkbox} from 'react-native-paper';

import {useSelector, useDispatch} from 'react-redux';
import {ApiTicketBook, ApiServerData, onlineticketBook} from '@actions';

export default function AttractionBook({route, navigation, props}) {
  const attractionId = route.params.attractionId;
  const attConnectWithApi = route.params.attConnectWithApi;
  const authapi = useSelector(state => state.authapi);

  const login = authapi.success;

  const dispatch = useDispatch();

  // ('authapi', authapi);
  const {colors} = useTheme();
  const {t} = useTranslation();
  const offsetKeyboard = Platform.select({
    ios: 0,
    android: 20,
  });

  const [showPayMethod, setshowPayMethod] = useState(false);
  const [bookPayMethod, setbookPayMethod] = useState(2);
  const [datedOrApitkt, setdatedOrApitkt] = useState('');
  const [attDetail, setattDetail] = useState('');
  useEffect(() => {
    getAttractionDetails();
    getAllTickets();
    // if (attConnectWithApi == true) {
    //   if (authapi.agencyId == 0) {
    //     setdatedOrApitkt(2);
    //   }
    // }

    console.log('authapi', authapi);
    if (
      authapi.userType == 1 ||
      authapi.userType == 2 ||
      authapi.userType == 3
    ) {
      setshowPayMethod(true);
    } else if (authapi.userType == 4) {
      setbookPayMethod(1);
      if (attConnectWithApi == true) {
        setdatedOrApitkt(2);
      }
    } else {
      if (attConnectWithApi == true) {
        setdatedOrApitkt(2);
      }
    }

    if (authapi.userType == 1) {
      getAllAgents();
    }
  }, []);

  const getAttractionDetails = () => {
    axios
      .post(RequestUrl + 'getattractiondetails', {
        attractionsId: attractionId,
        agencyId: 0,
        agencyUserId: 0,
      })
      .then(response => {
        setattDetail(response.data);
      })
      .catch(error => {
        error;
      });
  };
  const [apiTicket, setapiTicket] = useState([]);
  const [localTicket, setlocalTicket] = useState([]);

  const getAllTickets = () => {
    axios
      .post(RequestUrl + 'gettickettypelistbyattraction', {
        ttAttractionId: attractionId,
      })
      .then(response => {
        const tempData = response.data;

        let tempLocTkt = [...localTicket],
          tempApiTkt = [...apiTicket];
        tempLocTkt.length = 0;
        tempApiTkt.length = 0;
        tempLocTkt.push({label: 'Select Ticket', key: ''});
        tempApiTkt.push({
          label: 'Select Ticket',
          key: '',
          eventtypeId: '',
          resourceID: '',
        });
        for (let i = 0; i < tempData.length; i++) {
          if (tempData[i].resourceID == null || tempData[i].resourceID == 0) {
            tempLocTkt.push({
              label: tempData[i].ttTicketType,
              key: tempData[i].ticketTypeId,
            });
          } else {
            tempApiTkt.push({
              label: tempData[i].ttTicketType,
              key: tempData[i].ticketTypeId,
              eventtypeId: tempData[i].eventtypeId,
              resourceID: tempData[i].resourceID,
            });
          }
        }
        setlocalTicket(tempLocTkt);
        setapiTicket(tempApiTkt);
      })
      .catch(error => {
        error;
      });
  };

  const [agentList, setagentList] = useState(['']);
  const getAllAgents = () => {
    axios
      .post(RequestUrl + 'getagencylist', {
        attractionsId: 1,
        secretKey: secretKey,
      })
      .then(response => {
        // (
        //       `Agent List :\n\n${JSON.stringify(response.data, null, 2)}`,
        //     );
        let tempArr = [...agentList];
        tempArr.length = 0;
        let tempList = response.data;
        tempArr.push({label: 'Select Agent', key: ''});
        for (let i = 0; i < tempList.length; i++) {
          tempArr.push({
            label: tempList[i].agencyName,
            key: tempList[i].agencyId,
          });
        }
        setagentList(tempArr);
      })
      .catch(error => {
        error;
      });
  };
  const [selectedTicket, setselectedTicket] = useState('');
  const [childPrice, setchildPrice] = useState('');
  const [adultPrice, setadultPrice] = useState('');
  const [eventTypeID, seteventTypeID] = useState('');
  const [resourceID, setresourceID] = useState('');

  const getTicketPrice = tktId => {
    setadultErr('');
    settktTypeErr('');
    setchildPrice('');
    setadultPrice('');
    if ((tktId != '' && datedOrApitkt == 1) || datedOrApitkt == '') {
      let b2bId = 0,
        b2bUserId = 0;
      if (authapi.userType == 1 || authapi.userType == 2) {
        b2bId = authapi.agencyId;
      } else if (authapi.userType == 3) {
        b2bUserId = authapi.agencyId;
      } else {
        b2bUserId = 0;
      }

      axios
        .post(RequestUrl + 'getAttractionTicketTypePrice', {
          ticketTypeId: tktId,
          agencyId: b2bId,
          agencyUserId: b2bUserId,
          attractionsId: attractionId,
        })
        .then(response => {
          const tempData = response.data;

          //  ('res', tempData);

          if (tempData.errorCode == 505) {
            setadultErr('Tickets Not Available');
          } else {
            if (
              authapi.userType == 1 ||
              authapi.userType == 2 ||
              authapi.userType == 3
            ) {
              if (
                tempData.b2bAdultDisPrice == 0 &&
                tempData.b2bChildDisPrice == 0
              ) {
                setadultPrice(tempData.b2bAdultPrice);
                setchildPrice(tempData.b2bChildPrice);
              } else if (
                tempData.b2bAdultDisPrice != 0 &&
                tempData.b2bChildDisPrice == 0
              ) {
                setadultPrice(tempData.b2bAdultDisPrice);
                setchildPrice(tempData.b2bChildPrice);
              } else if (
                tempData.b2bAdultDisPrice == 0 &&
                tempData.b2bChildDisPrice != 0
              ) {
                setadultPrice(tempData.b2bAdultPrice);
                setchildPrice(tempData.b2bChildDisPrice);
              } else if (
                tempData.b2bAdultDisPrice != 0 &&
                tempData.b2bChildDisPrice != 0
              ) {
                setadultPrice(tempData.b2bAdultDisPrice);
                setchildPrice(tempData.b2bChildDisPrice);
              }
            } else {
              setadultPrice(tempData.b2cAdultPrice);
              setchildPrice(tempData.b2cChildPrice);
            }
          }

          // (
          //   `Ticket Price:\n\n${JSON.stringify(response.data, null, 2)}`,
          // );
        })
        .catch(error => {
          error;
        });
    } else {
      const tempVal = apiTicket.filter(item => item.key === tktId);

      seteventTypeID(tempVal[0].eventtypeId);
      setresourceID(tempVal[0].resourceID);
    }
    setselectedTicket(tktId);
  };

  const radioButtonsData = [
    {
      id: '1', // acts as primary key, should be unique and non-empty string
      label: 'Online',
      value: '1',
      labelStyle: {color: colors.text},
    },
    {
      id: '2',
      label: 'Credit',
      value: '2',

      selected: true,
      labelStyle: {color: colors.text},
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

  const radioDatedTicket = [
    {
      id: '1', // acts as primary key, should be unique and non-empty string
      label: 'Open Ticket',
      value: '1',
      labelStyle: {color: colors.text},
    },
    {
      id: '2',
      label: 'Dated Ticket',
      value: '2',
      labelStyle: {color: colors.text},
    },
  ];

  const radioAgenCredit = [
    {
      id: '1', // acts as primary key, should be unique and non-empty string
      label: 'Agent Credit',
      value: '1',
      selected: true,
      labelStyle: {color: colors.text},
    },
    {
      id: '2',
      label: 'Super Admin Credit',
      value: '2',
      labelStyle: {color: colors.text},
    },
  ];

  const [radioButtonsCredit, setRadioButtonsCredit] = useState(radioAgenCredit);

  function onPresscreditSelect(radioButtonsArray) {
    for (let i = 0; i < radioButtonsArray.length; i++) {
      if (radioButtonsArray[i].selected) {
        setcreditSelect(radioButtonsArray[i].value);
      }
    }

    setRadioButtonsCredit(radioButtonsArray);
  }

  const [datedTicket, setdatedTicket] = useState(radioDatedTicket);
  const radioDatedTicketChange = radioButtonsArray => {
    for (let i = 0; i < radioButtonsArray.length; i++) {
      if (radioButtonsArray[i].selected) {
        setdatedOrApitkt(radioButtonsArray[i].value);
      }
    }

    setdatedTicket(radioButtonsArray);
  };
  /**
   *
   *
   *
   *
   *
   * Called when process checkout
   */
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
  const [adult, setadult] = useState('');
  const [child, setchild] = useState('');
  const [bookdate, setbookDate] = useState('');
  const [bookdateFinal, setbookDateFInal] = useState('');
  const [loading, setLoading] = useState(false);
  const [bookForAgent, setbookForAgent] = useState(false);
  const [selectedAgent, setselectedAgent] = useState('');
  const [creditSelect, setcreditSelect] = useState(1);

  //Error state
  const [contactNameErr, setContactNameErr] = useState('');
  const [emailErr, setEmailErr] = useState('');
  const [phoneErr, setPhoneErr] = useState('');
  const [adultErr, setadultErr] = useState('');
  const [childErr, setchildErr] = useState('');
  const [bookdateErr, setbookDateErr] = useState('');
  const [tktTypeErr, settktTypeErr] = useState('');
  const [selectedAgentErr, setselectedAgentErr] = useState('');
  const [serverErr, setserverErr] = useState('');

  const [selectTimeSlotRes, setselectTimeSlotRes] = useState([]);
  //const [allErr, setallErr] = useState(false)
  const bookTicket = e => {
    // navigation.navigate('TicketViewer', {pdfPath: pdfPath});
    // e.preventdefault()
    if (login == true) {
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
        setadultErr('Required');
        allErr = false;
      } else {
        setadultErr('');
      }
      if (bookdate == '') {
        setbookDateErr('Date Required');
        allErr = false;
      } else {
        setbookDateErr('');
      }
      if (selectedTicket == '') {
        settktTypeErr('Select Ticket Type');
        allErr = false;
      } else {
        settktTypeErr('');
      }
      if (bookForAgent == true) {
        if (selectedAgent == '') {
          setselectedAgentErr('Please Select Agent');
          allErr = false;
        } else {
          setselectedAgentErr('');
        }
      }

      let b2bId = 0,
        b2bUserId = 0,
        bookb2cId = 0;
      if (authapi.userType == 1 || authapi.userType == 2) {
        b2bId = authapi.agencyId;
      } else if (authapi.userType == 3) {
        b2bUserId = authapi.agencyId;
      } else {
        bookb2cId = authapi.agencyId;
      }

      //selectedAgent --> creditSelect --> bookForAgent
      let totalAmount = Number(adult * adultPrice) + Number(child * childPrice);

      let superAdminId = 0,
        bookB2bId;

      if (bookForAgent == true) {
        superAdminId = authapi.agencyId;
        bookB2bId = selectedAgent;
      } else {
        bookB2bId = authapi.agencyId;
      }

      // (`bookData  .data:\n\n${JSON.stringify(bookData, null, 2)}`);

      const bookData = {
        bookedByBackOffice: bookForAgent,
        bookedCreditLimit: creditSelect,
        superAdminId: superAdminId,
        bookB2bId: bookB2bId,
        bookB2bUserId: b2bUserId,
        bookB2cId: bookb2cId,
        attractionsId: attractionId,
        bookCustomerName: contactName,
        bookCustomerEmail: email,
        bookMobileNumber: phone,
        ticketTypeId: selectedTicket,
        bookNofAdult: adult,
        bookNofChild: child,
        bookAdultPrice: adultPrice,
        bookChildPrice: childPrice,
        bookTravellDate: bookdate,
        bookPaymentMode: showPayMethod ? bookPayMethod : '1',
        bookTotal: totalAmount,
        bookingAddon: [],
        secretKey: secretKey,
      };

      //   ('login');
      if (allErr) {
        setLoading(true);
        //     ('login');
        if (datedOrApitkt == 2) {
          //api ticket
          const apiBookData = {
            bookedByBackOffice: bookForAgent,
            bookedCreditLimit: creditSelect,
            superAdminId: superAdminId,
            attractionId: attractionId,
            agencyId: bookB2bId,
            agencyUserId: b2bUserId,
            customerName: contactName,
            customerEmail: email,
            customerMobileNumber: phone,
            bookingDate: bookdate,
            eventId: selectTimeSlotRes.eventId,
            eventName: selectTimeSlotRes.eventName,
            eventTypeId: selectTimeSlotRes.eventTypeId,
            resourceId: selectTimeSlotRes.resourceId,
            startDateTime: selectTimeSlotRes.startDateTime,
            endDateTime: selectTimeSlotRes.endDateTime,
            available: selectTimeSlotRes.available,
            status: selectTimeSlotRes.status,
            adultPrice: selectTimeSlotRes.adultPrice,
            childPrice: selectTimeSlotRes.childPrice,
            nofAdult: adult,
            nofChild: child,
            nofInfant: '',
            agentServiceTicketTypes: selectTimeSlotRes.agentServiceTicketTypes,
            totalPrice: totalAmount,
            bookPaymentMode: showPayMethod ? bookPayMethod : '1',
            secretKey: secretKey,
          };
          if (bookPayMethod == 1) {
            //online payment
            const bookdataDis = {
              ...apiBookData,
              datedOrApitkt: 2,
            };

            dispatch(ApiTicketBook.submitFirstStateApiTicket(bookData));
            axios
              .post(RequestUrl + 'saveBurjTicket', apiBookData)
              .then(response => {
                // (
                //   `response :\n\n${JSON.stringify(response.data, null, 2)}`,
                // );

                dispatch(ApiServerData.submitApiServerRes(response.data));
                setContactName('');
                setEmail('');
                setPhone('');
                setadult('');
                setchild('');
                setbookDate('');
                navigation.navigate('StripPay', {
                  ticketFor: 'dated',
                  bookTotal: totalAmount,
                });
                setLoading(false);
              })
              .catch(error => {
                error;
              });
          } else {
            dispatch(ApiTicketBook.submitFirstStateApiTicket(bookData));
            axios
              .post(RequestUrl + 'saveBurjTicket', apiBookData)
              .then(response => {
                // (
                //   `response :\n\n${JSON.stringify(response.data, null, 2)}`,
                // );

                dispatch(ApiServerData.submitApiServerRes(response.data));
                navigation.navigate('BurjKhalifaBooking', {
                  attName: attDetail.attName,
                });
                setLoading(false);
              })
              .catch(error => {
                error;
              });
          }
        } else {
          //open ticket
          if (bookPayMethod == 1) {
            //   ('credit online');
            dispatch(onlineticketBook.submitsaveOnlineBookData(bookData));
            setContactName('');
            setEmail('');
            setPhone('');
            setadult('');
            setchild('');
            setbookDate('');
            navigation.navigate('StripPay', {
              ticketFor: 'open',
              bookTotal: totalAmount,
            });
          } else {
            axios
              .post(RequestUrl + 'setbooking', bookData)
              .then(response => {
                setLoading(false);
                const tempData = response.data;
                if (tempData.errorCode == 505) {
                  setserverErr('Adult Ticket Not Available');
                } else if (tempData.errorCode == 504) {
                  setserverErr('Child Ticket Not Available');
                } else if (tempData.errorCode == 303) {
                  setserverErr('Server Error');
                } else if (tempData.errorCode == 100) {
                  setserverErr('insufficient Balance');
                } else {
                  const tktPath =
                    'https://www.parmartours.com/filestorage/' +
                    tempData.bookingTickPdfPath;
                  navigation.navigate('TicketViewer', {tktPath: tktPath});
                  setContactName('');
                  setEmail('');
                  setPhone('');
                  setadult('');
                  setchild('');
                  setbookDate('');
                }
              })
              .catch(error => {
                setserverErr('Some Technical Error');
              });
          }
        }
      }
    } else {
      setLoading(false);
      navigation.navigate('LoginScreen');
    }
  };

  var newDate = new Date().getDate();

  const [timeSlotButton, settimeSlotButton] = useState(false);

  const [apiTimeSlot, setapiTimeSlot] = useState('');

  const dateFun = val => {
    settktTypeErr('');
    setbookDate(val);
    if (datedOrApitkt == 2) {
      if (selectedTicket == '') {
        settktTypeErr('Select Ticket Type');
      } else {
        settimeSlotButton(true);
        //eventTypeID, resourceID
        axios
          .post(RequestUrl + 'getBurjTimeSlotWithRates', {
            bookingDate: val,
            eventTypeId: eventTypeID,
            resourceId: resourceID,
            secretKey: 'uZFEucIHAbqvgT7p87qC4Ms4tjqG34su',
          })
          .then(response => {
            // (
            //   `You Tour list :\n\n${JSON.stringify(response.data, null, 2)}`,
            // );
            setapiTimeSlot(response.data.agentServiceEventsPrice);
            settimeSlotButton(false);
          })
          .catch(error => {
            error;
          });
      }
    }
  };

  const [timeSlotForButton, settimeSlotForButton] = useState('');
  const getApitktPrice = (
    eventID,
    eventTypeID,
    status,
    available,
    resourceID,
    eventName,
    startDateTime,
    endDateTime,
  ) => {
    setchildPrice('');
    setadultPrice('');

    let b2bId = 0,
      b2bUserId = 0,
      bookB2cId = 0;
    if (authapi.userType == 1 || authapi.userType == 2) {
      b2bId = authapi.agencyId;
    } else if (authapi.userType == 3) {
      b2bUserId = authapi.agencyId;
    } else if (authapi.userType == 4) {
      bookB2cId = authapi.agencyId;
    }

    settimeSlotForButton(startDateTime);
    const getRate = {
      agencyId: b2bId,
      agencyUserId: b2bUserId,
      bookB2cId: bookB2cId,
      available: available,
      endDateTime: endDateTime,
      eventId: eventID,
      eventName: eventName,
      eventTypeId: eventTypeID,
      resourceId: resourceID,
      startDateTime: startDateTime,
      status: status,
      secretKey: secretKey,
    };

    axios
      .post(RequestUrl + 'getBurjTicketTypeWithRates', getRate)
      .then(response => {
        setselectTimeSlotRes(response.data);
        //Math.round(response.data.adultPrice)
        setchildPrice(Math.round(response.data.childPrice));
        setadultPrice(Math.round(response.data.adultPrice));
      })
      .catch(error => {
        error;
      });
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

            {authapi.userType == 1 && (
              <View style={styles.horizontal1}>
                <Checkbox
                  status={bookForAgent ? 'checked' : 'unchecked'}
                  onPress={() => {
                    setbookForAgent(!bookForAgent);
                  }}
                />
                <Text style={{marginTop: 10, marginLeft: 10}}>
                  Book For Agent
                </Text>
              </View>
            )}
            {bookForAgent == true && (
              <>
                <View>
                  <ModalSelector
                    style={{marginTop: 10}}
                    data={agentList}
                    initValue="Select Agent "
                    onChange={option => {
                      setselectedAgent(option.key);
                    }}>
                    {/* <TextInput
                      style={{
                        borderWidth: 1,
                        borderColor: '#ccc',
                        padding: 10,
                        height: 30,
                      }}
                      editable={false}
                      placeholder="Select Agent"
                      value={searchAgent}
                    /> */}
                  </ModalSelector>

                  {selectedAgentErr && (
                    <Text style={{color: 'red'}}>{selectedAgentErr}</Text>
                  )}
                </View>
                <View style={{marginTop: 10}}>
                  <RadioGroup
                    radioButtons={radioButtonsCredit}
                    onPress={onPresscreditSelect}
                    layout="row"
                  />
                </View>
              </>
            )}
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
                placeholder="Email"
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

            {authapi.userType == 1 ||
            authapi.userType == 2 ||
            authapi.userType == 3 ? (
              <>
                {attConnectWithApi == true ? (
                  <>
                    <View style={{marginTop: 10}}>
                      <Text>Select Ticket Type</Text>
                      <RadioGroup
                        radioButtons={datedTicket}
                        onPress={radioDatedTicketChange}
                        layout="row"
                      />
                    </View>
                    {datedOrApitkt == 1 || datedOrApitkt == 2 ? (
                      <View>
                        <ModalSelector
                          style={{marginTop: 10}}
                          data={datedOrApitkt == 1 ? localTicket : apiTicket}
                          initValue="Select Ticket "
                          onChange={option => {
                            getTicketPrice(option.key);
                          }}
                        />
                        {tktTypeErr && (
                          <Text style={{color: 'red'}}>{tktTypeErr}</Text>
                        )}
                      </View>
                    ) : null}
                  </>
                ) : (
                  <>
                    <View>
                      <ModalSelector
                        style={{marginTop: 10}}
                        data={localTicket}
                        initValue="Select Ticket "
                        onChange={option => {
                          getTicketPrice(option.key);
                        }}
                      />
                      {tktTypeErr && (
                        <Text style={{color: 'red'}}>{tktTypeErr}</Text>
                      )}
                    </View>
                  </>
                )}
              </>
            ) : (
              <View>
                <ModalSelector
                  style={{marginTop: 10}}
                  data={attConnectWithApi == true ? apiTicket : localTicket}
                  initValue="Select Ticket "
                  onChange={option => {
                    getTicketPrice(option.key);
                  }}
                />
                {tktTypeErr && <Text style={{color: 'red'}}>{tktTypeErr}</Text>}
              </View>
            )}

            {/* //alert(`${option.label} (${option.key}) nom nom nom`) */}

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

            {timeSlotButton == true && (
              <View style={[styles.container, styles.horizontal]}>
                <ActivityIndicator size="large" color="#5DADE2" />
              </View>
            )}
            {apiTimeSlot != '' && (
              <FlatList
                data={apiTimeSlot}
                numColumns={2}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({item}) => {
                  return (
                    <TimeSlotButton
                      style={[
                        styles.slotButton,
                        {
                          backgroundColor:
                            item.available <= 0
                              ? '#dc3545'
                              : item.available <= 20
                              ? '#ffc107'
                              : '#28a745',
                        },
                      ]}
                      onPress={() =>
                        getApitktPrice(
                          item.eventID,
                          item.eventTypeID,
                          item.status,
                          item.available,
                          item.resourceID,
                          item.eventName,
                          item.startDateTime,
                          item.endDateTime,
                        )
                      }>
                      {item.startDateTime.slice(11, 16) +
                        '-' +
                        item.endDateTime.slice(11, 16) +
                        '(' +
                        item.available +
                        ')'}
                      {timeSlotForButton == item.startDateTime &&
                      item.available >= Number(adult) + Number(child) ? (
                        <Icon name="check" size={20} enableRTL={true} />
                      ) : null}
                    </TimeSlotButton>
                  );
                }}
              />
            )}

            {/*             
            <TouchableOpacity
              style={[styles.duration, {backgroundColor: colors.card}]}
              onPress={() => {setmModalVisible(true)}} ></TouchableOpacity> */}

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
              <FlatList />
            </View>
          </ScrollView>
          <View style={{paddingHorizontal: 20, paddingVertical: 15}}>
            <Button loading={loading} full onPress={() => bookTicket()}>
              Book Now
            </Button>
          </View>

          {/* 
          <View style={{paddingHorizontal: 20, paddingVertical: 15}}>
            <Button  full onPress={() => stripPay()}>
             Pay Now
            </Button>
          </View> */}
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
