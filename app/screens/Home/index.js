import React, {useState, useEffect} from 'react';
import {
  View,
  Animated,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import {
  Image,
  Text,
  Icon,
  HotelItem,
  CardCustome,
  Button,
  SafeAreaView,
  EventCard,
  TextInput,
} from '@components';
import {BaseStyle, Images, useTheme} from '@config';
import * as Utils from '@utils';
import styles from './styles';
import {PromotionData, TourData, HotelData} from '@data';
import {useTranslation} from 'react-i18next';
import axios from 'axios';
import {RequestUrl, ImagePath} from '../../api';
import {useSelector} from 'react-redux';

export default function Home({navigation}) {
  const {t} = useTranslation();
  const {colors} = useTheme();
  const [icons] = useState([
    {
      icon: 'calendar-alt',
      name: 'Attractions',
      route: 'Attractions',
    },
    {
      icon: 'map-marker-alt',
      name: 'tours',
      route: 'Tour',
    },
    // {
    //   icon: 'car-alt',
    //   name: 'car',
    //   route: 'OverViewCar',
    // },
    {
      icon: 'plane',
      name: 'Visa',
      route: 'VisaService',
    },

    {
      icon: 'globe',
      name: 'Combo',
      route: 'Combopack',
    },

    {
      icon: 'star',
      name: 'event',
      route: 'DashboardEvent',
    },
    {
      icon: 'ellipsis-h',
      name: 'more',
      route: 'More',
    },

    // {
    //   icon: 'ship',
    //   name: 'cruise',
    //   route: 'CruiseSearch',
    // },
    // {
    //   icon: 'bus',
    //   name: 'bus',
    //   route: 'BusSearch',
    // },
    // {
    //   icon: 'star',
    //   name: 'event',
    //   route: 'DashboardEvent',
    // },
    // {
    //   icon: 'ellipsis-h',
    //   name: 'more',
    //   route: 'More',
    // },
  ]);
  const [relate] = useState([
    {
      id: '0',
      image: Images.event4,
      title: 'BBC Music Introducing',
      time: 'Thu, Oct 31, 9:00am',
      location: 'Tobacco Dock, London',
    },
    {
      id: '1',
      image: Images.event5,
      title: 'Bearded Theory Spring Gathering',
      time: 'Thu, Oct 31, 9:00am',
      location: 'Tobacco Dock, London',
    },
  ]);
  const [promotion] = useState(PromotionData);
  const [tours] = useState(TourData);
  const [hotels] = useState(HotelData);
  const [heightHeader, setHeightHeader] = useState(Utils.heightHeader());
  const deltaY = new Animated.Value(0);

  /**
   * @description Show icon services on form searching
   * @author Passion UI <passionui.com>
   * @date 2019-08-03
   * @returns
   */
  const authapi = useSelector(state => state.authapi);
  useEffect(() => {
    if (authapi.userType == 1 || authapi.userType == 2) {
      getAllAttractions(authapi.agencyId, 0);
      getAllCombo();
    } else if (authapi.userType == 3) {
      getAllAttractions(0, authapi.agencyId);
      getAllCombo();
    } else {
      getAllAttractions();
      getAllCombo();
    }
    getAllTours();
  }, [authapi]);

  const [offAndDis, setoffAndDis] = useState([]);
  const [topAtt, settopAtt] = useState([]);
  const [topDes, setTopDes] = useState([]);
  const [upcomTour, setupcomTour] = useState([]);

  const [comboOffer, setcomboOffers] = useState([]);
  const [tourPackages, settourPackages] = useState([]);
  const [allAttractions, setallAttractions] = useState([]);
  const [allAttractionList, setallAttractionList] = useState([]);

  //Get All attraction And set based on there catogery
  const getAllAttractions = (agencyId, agencyUserId) => {
    axios
      .post(RequestUrl + 'getattractionall', {
        attractionId: 1,
        agencyId: agencyId,
        agencyUserId: agencyUserId,
        currencyCode: 'AED',
        platformId: 1,
      })
      .then(response => {
        // (
        //   `You Attractions list :\n\n${JSON.stringify(response.data, null, 2)}`,
        // );
        setallAttractionList(response.data);
        const tempData = response.data;
        // let tempdataArr = [];
        // for (let i = 0; i < 5; i++) {
        //   tempdataArr.push(tempData[i]);
        // }

        setallAttractions(tempData);

        setComponentsData(response.data);
      })
      .catch(error => {
        error;
      });
  };

  const [attShowAll, setattShowALl] = useState(true);
  const showAllAttraction = () => {
    if (attShowAll == false) {
      const tempData = allAttractionList;
      let tempdataArr = [];
      for (let i = 0; i < 5; i++) {
        tempdataArr.push(tempData[i]);
      }
      setallAttractions(tempdataArr);
    } else {
      setallAttractions(allAttractionList);
    }
    setattShowALl(!attShowAll);
  };

  const setComponentsData = attData => {
    let offAndDis = [],
      topAtt = [],
      topDes = [],
      upCom = [];
    for (let i = 0; i < attData.length; i++) {
      if (attData[i].attOffersAndDiscount) {
        offAndDis.push(attData[i]);
      }
      if (attData[i].attTopAttractions) {
        topAtt.push(attData[i]);
      }
      if (attData[i].attTopDestination) {
        topDes.push(attData[i]);
      }
      if (attData[i].attUpComingTours) {
        upCom.push(attData[i]);
      }
    }

    setoffAndDis(offAndDis);
    settopAtt(topAtt);
    setTopDes(topDes);
    setupcomTour(upCom);
  };

  //get All tours
  const getAllTours = () => {
    axios
      .post(RequestUrl + 'gettourpackageall', {
        currencyCode: 'AED',
        platformId: 1,
      })
      .then(response => {
        // (
        //   `You Tour list :\n\n${JSON.stringify(response.data, null, 2)}`,
        // );
        settourPackages(response.data);
      })
      .catch(error => {});
  };

  // get all combo pack
  const getAllCombo = () => {
    axios
      .post(RequestUrl + 'getComboOfferList', {
        currencyCode: 'AED',
        platformId: 1,
      })
      .then(response => {
        setcomboOffers(response.data);
      })
      .catch(() => {});
  };

  const [search, setsearch] = useState('');
  const filterAttraction = allAttractions.filter(attract => {
    return attract.attName.toLowerCase().includes(search.toLocaleLowerCase());
  });

  // const searchData = allAttractions.filter( task => task.attName.includes(searcString))
  const renderIconService = () => {
    return (
      <FlatList
        data={icons}
        numColumns={3}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => {
          return (
            <TouchableOpacity
              style={styles.itemService}
              activeOpacity={0.9}
              onPress={() => {
                navigation.navigate(item.route);
              }}>
              <View
                style={[styles.iconContent, {backgroundColor: colors.card}]}>
                <Icon name={item.icon} size={18} color={colors.primary} solid />
              </View>
              <Text footnote grayColor numberOfLines={1}>
                {t(item.name)}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
    );
  };

  const heightImageBanner = Utils.scaleWithPixel(250);
  const marginTopBanner = heightImageBanner - heightHeader;

  //url("https://parmartours.com:8443/filestorage/parmartour/images/8465661044376206832.png")

  return (
    <View style={{flex: 1}}>
      <Animated.Image
        //source={{uri:'https://parmartours.com:8443/filestorage/parmartour/images/8465661044376206832.png'}}
        source={Images.homeBanner}
        style={[
          styles.imageBackground,
          {
            height: deltaY.interpolate({
              inputRange: [
                0,
                Utils.scaleWithPixel(100),
                Utils.scaleWithPixel(100),
              ],
              outputRange: [heightImageBanner, heightHeader, 0],
            }),
          },
        ]}
      />
      <SafeAreaView style={{flex: 1}} edges={['right', 'left']}>
        <FlatList
          onScroll={Animated.event([
            {
              nativeEvent: {
                contentOffset: {y: deltaY},
              },
            },
          ])}
          onContentSizeChange={() => setHeightHeader(Utils.heightHeader())}
          scrollEventThrottle={8}
          ListHeaderComponent={
            <View style={{paddingHorizontal: 20}}>
              <View
                style={[
                  styles.searchForm,
                  {
                    marginTop: marginTopBanner,
                    backgroundColor: colors.background,
                    borderColor: colors.border,
                    shadowColor: colors.border,
                  },
                ]}>
                {renderIconService()}
                <View style={{marginTop: 10}}>
                  <TextInput
                    onChangeText={text => setsearch(text)}
                    placeholder="Search Your Attraction Here"
                    value={search}
                  />
                </View>
              </View>
            </View>
          }
          ListFooterComponent={
            <View>
              {/* All attractions */}
              <View>
                <View style={styles.inlineText}>
                  <Text title3 semibold style={styles.titleView}>
                    All Attractions
                  </Text>
                  {allAttractionList != '' && (
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate('Attractions', {
                          allAttractionList: allAttractionList,
                        })
                      }>
                      <Text semibold style={styles.titleView}>
                        Show All{' '}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>

                {allAttractionList == '' ? (
                  <ActivityIndicator color={colors.primary} />
                ) : (
                  <FlatList
                    contentContainerStyle={{paddingLeft: 5, paddingRight: 20}}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    data={filterAttraction.slice(0, 5)}
                    maxToRenderPerBatch={5}
                    keyExtractor={(item, index) => item.attractionsId}
                    renderItem={({item, index}) => (
                      <CardCustome
                        style={[styles.promotionItem, {marginLeft: 15}]}
                        image={item.attThumbnailImage}
                        onPress={() =>
                          navigation.navigate('AttractionDetails', {
                            attractionId: item.attractionsId,
                          })
                        }>
                        <Text subhead whiteColor>
                          {item.attName}
                        </Text>
                        {/* <Text title2 whiteColor semibold>
                        {item.title2}
                      </Text> */}
                        <View style={styles.contentCartPromotion}>
                          <Button
                            style={styles.btnPromotion}
                            onPress={() => {
                              navigation.navigate('AttractionBook', {
                                attractionId: item.attractionsId,
                                attConnectWithApi: item.attConnectWithApi,
                              });
                            }}>
                            <Text body2 semibold whiteColor>
                              {t('book_now')}
                            </Text>
                          </Button>
                        </View>
                      </CardCustome>
                    )}
                  />
                )}
              </View>

              {/* Hiking */}
              <View style={styles.inlineText}>
                <Text title3 semibold style={styles.titleView}>
                  All Tours
                </Text>
                {tourPackages != '' && (
                  <TouchableOpacity onPress={() => navigation.navigate('Tour')}>
                    <Text semibold style={styles.titleView}>
                      Show All{' '}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

              {tourPackages == '' ? (
                <ActivityIndicator color={colors.primary} />
              ) : (
                <FlatList
                  contentContainerStyle={{paddingLeft: 5, paddingRight: 20}}
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                  data={tourPackages.slice(0, 5)}
                  maxToRenderPerBatch={5}
                  keyExtractor={(item, index) => item.tourPackageId}
                  renderItem={({item, index}) => (
                    <CardCustome
                      style={[styles.promotionItem, {marginLeft: 15}]}
                      image={item.tourThumbnailImage}
                      onPress={() =>
                        navigation.navigate('TourDetail', {
                          tourPackageId: item.tourPackageId,
                        })
                      }>
                      <Text subhead whiteColor semibold>
                        {item.tourName}
                      </Text>
                    </CardCustome>
                  )}
                />
              )}

              {/* Event*/}
              <View style={styles.inlineText}>
                <Text title3 semibold style={styles.titleView}>
                  Combo Offers
                </Text>
                {comboOffer != '' && (
                  <TouchableOpacity
                    onPress={() => navigation.navigate('Combopack')}>
                    <Text semibold style={styles.titleView}>
                      Show All{' '}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

              {comboOffer == '' ? (
                <ActivityIndicator color={colors.primary} />
              ) : (
                <View>
                  <FlatList
                    contentContainerStyle={{
                      paddingRight: 20,
                      paddingLeft: 5,
                    }}
                    horizontal={true}
                    data={comboOffer.slice(0, 5)}
                    maxToRenderPerBatch={5}
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item, index) => item.comboOfferId}
                    renderItem={({item, index}) => (
                      <EventCard
                        image={item.thumbImageFile}
                        title={item.comboName}
                        // time={item.time}
                        // location={item.location}
                        onPress={() =>
                          navigation.navigate('EventDetail', {
                            comboOfferId: item.comboOfferId,
                          })
                        }
                        style={{marginLeft: 15}}
                      />
                    )}
                  />
                </View>
              )}

              {/* Promotion */}
              <View style={styles.titleView}>
                <View style={styles.inlineText}>
                  <Text title3 semibold>
                    Top Attraction
                  </Text>
                  {topAtt != '' && (
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate('TopAttractions', {
                          topAtt: topAtt,
                        })
                      }>
                      <Text semibold>Show All </Text>
                    </TouchableOpacity>
                  )}
                </View>
                <Image source={Images.banner1} style={styles.promotionBanner} />
                <View style={[styles.line, {backgroundColor: colors.border}]} />
              </View>

              {topAtt == '' ? (
                <ActivityIndicator color={colors.primary} />
              ) : (
                <FlatList
                  columnWrapperStyle={{paddingLeft: 5, paddingRight: 20}}
                  numColumns={2}
                  data={topAtt.slice(0, 5)}
                  maxToRenderPerBatch={5}
                  keyExtractor={(item, index) => item.attractionsId}
                  renderItem={({item, index}) => (
                    <HotelItem
                      grid
                      image={item.attThumbnailImage}
                      name={item.attName}
                      location={item.attCity}
                      price={'AED' + item.adultPrice}
                      // available={item.available}
                      // rate={item.rate}
                      // rateStatus={item.rateStatus}
                      // numReviews={item.numReviews}
                      // services={item.services}
                      style={{marginLeft: 15, marginBottom: 15}}
                      onPress={() =>
                        navigation.navigate('AttractionDetails', {
                          attractionId: item.attractionsId,
                        })
                      }
                    />
                  )}
                />
              )}

              {/* Promotion */}
              <View style={styles.titleView}>
                <View style={styles.inlineText}>
                  <Text title3 semibold>
                    Top Destination
                  </Text>
                  {topDes != '' && (
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate('TopDestinations', {
                          topDes: topDes,
                        })
                      }>
                      <Text semibold>Show All </Text>
                    </TouchableOpacity>
                  )}
                </View>
                <Image source={Images.banner1} style={styles.promotionBanner} />
                <View style={[styles.line, {backgroundColor: colors.border}]} />
              </View>

              {topDes == '' ? (
                <ActivityIndicator color={colors.primary} />
              ) : (
                <FlatList
                  columnWrapperStyle={{paddingLeft: 5, paddingRight: 20}}
                  numColumns={2}
                  data={topDes.slice(0, 5)}
                  maxToRenderPerBatch={5}
                  keyExtractor={(item, index) => item.attractionsId}
                  renderItem={({item, index}) => (
                    <HotelItem
                      grid
                      image={item.attThumbnailImage}
                      name={item.attName}
                      location={item.attCity}
                      price={'AED' + item.adultPrice}
                      // available={item.available}
                      // rate={item.rate}
                      // rateStatus={item.rateStatus}
                      // numReviews={item.numReviews}
                      // services={item.services}
                      style={{marginLeft: 15, marginBottom: 15}}
                      onPress={() =>
                        navigation.navigate('AttractionDetails', {
                          attractionId: item.attractionsId,
                        })
                      }
                    />
                  )}
                />
              )}

              {/* Promotion */}
              <View style={styles.titleView}>
                <View style={styles.inlineText}>
                  <Text title3 semibold>
                    Offers & Discounts
                  </Text>
                  {offAndDis != '' && (
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate('OffersAndDiscounts', {
                          offAndDis: offAndDis,
                        })
                      }>
                      <Text semibold>Show All </Text>
                    </TouchableOpacity>
                  )}
                </View>
                <Image source={Images.banner1} style={styles.promotionBanner} />
                <View style={[styles.line, {backgroundColor: colors.border}]} />
              </View>

              {offAndDis == '' ? (
                <ActivityIndicator color={colors.primary} />
              ) : (
                <FlatList
                  columnWrapperStyle={{paddingLeft: 5, paddingRight: 20}}
                  numColumns={2}
                  data={offAndDis.slice(0, 5)}
                  maxToRenderPerBatch={5}
                  keyExtractor={(item, index) => item.attractionsId}
                  renderItem={({item, index}) => (
                    <HotelItem
                      grid
                      image={item.attThumbnailImage}
                      name={item.attName}
                      location={item.attCity}
                      price={'AED' + item.adultPrice}
                      // available={item.available}
                      // rate={item.rate}
                      // rateStatus={item.rateStatus}
                      // numReviews={item.numReviews}
                      // services={item.services}
                      style={{marginLeft: 15, marginBottom: 15}}
                      onPress={() =>
                        navigation.navigate('AttractionDetails', {
                          attractionId: item.attractionsId,
                        })
                      }
                    />
                  )}
                />
              )}

              {/* Promotion */}
              <View style={styles.titleView}>
                <View style={styles.inlineText}>
                  <Text title3 semibold>
                    Upcoming Tours
                  </Text>
                  {upcomTour != '' && (
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate('UpcomingTours', {
                          upcomTour: upcomTour,
                        })
                      }>
                      <Text semibold>Show All </Text>
                    </TouchableOpacity>
                  )}
                </View>
                <Image source={Images.banner1} style={styles.promotionBanner} />
                <View style={[styles.line, {backgroundColor: colors.border}]} />
              </View>

              {upcomTour == '' ? (
                <ActivityIndicator color={colors.primary} />
              ) : (
                <FlatList
                  columnWrapperStyle={{paddingLeft: 5, paddingRight: 20}}
                  numColumns={2}
                  data={upcomTour.slice(0, 5)}
                  maxToRenderPerBatch={5}
                  keyExtractor={(item, index) => item.attractionsId}
                  renderItem={({item, index}) => (
                    <HotelItem
                      grid
                      image={item.attThumbnailImage}
                      name={item.attName}
                      location={item.attCity}
                      price={'AED' + item.adultPrice}
                      // available={item.available}
                      // rate={item.rate}
                      // rateStatus={item.rateStatus}
                      // numReviews={item.numReviews}
                      // services={item.services}
                      style={{marginLeft: 15, marginBottom: 15}}
                      onPress={() =>
                        navigation.navigate('AttractionDetails', {
                          attractionId: item.attractionsId,
                        })
                      }
                    />
                  )}
                />
              )}
            </View>
          }
        />
      </SafeAreaView>
    </View>
  );
}
