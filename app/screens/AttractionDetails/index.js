import React, {useState, useEffect} from 'react';
import {
  View,
  ScrollView,
  FlatList,
  Animated,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {BaseColor, Images, useTheme} from '@config';
import {
  Header,
  SafeAreaView,
  Icon,
  Text,
  StarRating,
  PostListItem,
  HelpBlock,
  Button,
  RoomType,
} from '@components';
import * as Utils from '@utils';
import {InteractionManager} from 'react-native';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import styles from './styles';
import {HelpBlockData} from '@data';
import {useTranslation} from 'react-i18next';
import axios from 'axios';
import {ImagePath, RequestUrl} from '../../api';
import {useSelector} from 'react-redux';

export default function AttractionDetails({navigation, route}) {
  const {attractionId} = route.params;
  const {colors} = useTheme();
  const {t} = useTranslation();

  const [heightHeader, setHeightHeader] = useState(Utils.heightHeader());
  const [renderMapView, setRenderMapView] = useState(false);
  const [region] = useState({
    latitude: 25.197308625435493,
    longitude: 55.274365668813886,
    latitudeDelta: 0.05,
    longitudeDelta: 0.004,
  });
  //25.197308625435493, 55.274365668813886

  const [helpBlock] = useState(HelpBlockData);
  const deltaY = new Animated.Value(0);

  const [attDetail, setattDetail] = useState('');
  const [bannerAddon, setbannerAddon] = useState([]);

  const authapi = useSelector(state => state.authapi);
  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      setRenderMapView(true);
    });

    if (authapi.userType == 1 || authapi.userType == 2) {
      getAttractionDetails(authapi.agencyId, 0);
    } else if (authapi.userType == 3) {
      getAttractionDetails(0, authapi.agencyId);
    } else {
      getAttractionDetails(0, 0);
    }

    getBannerAddons();
  }, [authapi]);

  const getAttractionDetails = (b2bid, b2buserid) => {
    axios
      .post(RequestUrl + 'getattractiondetails', {
        attractionsId: attractionId,
        agencyId: b2bid,
        agencyUserId: b2buserid,
      })
      .then(response => {
        setattDetail(response.data);
      })
      .catch(error => {
        error;
      });
  };

  var attDescription = '';
  if (attDetail != '') {
    attDescription = attDetail.attDescription.replace(/<[^>]+>/g, '');
  }

  const getBannerAddons = () => {
    axios
      .post(RequestUrl + 'getaddonbannerlist', {attractionId: attractionId})
      .then(response => {
        // (
        //   `You Banner Odd on :\n\n${JSON.stringify(response.data, null, 2)}`,
        // );
        setbannerAddon(response.data);
      })
      .catch(err => {});
  };

  const heightImageBanner = Utils.scaleWithPixel(250, 1);
  const marginTopBanner = heightImageBanner - heightHeader - 40;

  return (
    <View style={{flex: 1}}>
      <Animated.Image
        source={{uri: ImagePath + attDetail.attBannerImage}}
        style={[
          styles.imgBanner,
          {
            height: deltaY.interpolate({
              inputRange: [
                0,
                Utils.scaleWithPixel(200),
                Utils.scaleWithPixel(200),
              ],
              outputRange: [heightImageBanner, heightHeader, heightHeader],
            }),
          },
        ]}
      />
      {/* Header */}
      <Header
        title=""
        renderLeft={() => {
          return (
            <Icon
              name="arrow-left"
              size={20}
              color={BaseColor.whiteColor}
              enableRTL={true}
            />
          );
        }}
        // renderRight={() => {
        //   return <Icon name="images" size={20} color={BaseColor.whiteColor} />;
        // }}
        onPressLeft={() => {
          navigation.goBack();
        }}
        // onPressRight={() => {
        //   navigation.navigate('PreviewImage');
        // }}
      />
      {attDetail == '' ? (
        <ActivityIndicator color={colors.primary} />
      ) : (
        <SafeAreaView style={{flex: 1}} edges={['right', 'left', 'bottom']}>
          <ScrollView
            onScroll={Animated.event([
              {
                nativeEvent: {
                  contentOffset: {y: deltaY},
                },
              },
            ])}
            onContentSizeChange={() => setHeightHeader(Utils.heightHeader())}
            scrollEventThrottle={8}>
            {/* Main Container */}
            <View style={{paddingHorizontal: 20}}>
              {/* Information */}
              <View
                style={[
                  styles.contentBoxTop,
                  {
                    marginTop: marginTopBanner,
                    backgroundColor: colors.card,
                    shadowColor: colors.border,
                    borderColor: colors.border,
                  },
                ]}>
                <Text title2 semibold style={{marginBottom: 5}}>
                  {attDetail.attName}
                </Text>
                <Text
                  body2
                  style={{
                    marginTop: 5,
                    textAlign: 'center',
                  }}>
                  {'Adult  - ' +
                    attDetail.adultPrice +
                    ' AED' +
                    '                ' +
                    'Child  - ' +
                    attDetail.childPrice +
                    ' AED'}
                </Text>
              </View>

              {/* Description */}
              <View
                style={[styles.blockView, {borderBottomColor: colors.border}]}>
                <Text headline semibold>
                  About - {attDetail.attName}
                </Text>
                <Text body2 style={{marginTop: 5}}>
                  {attDescription}
                </Text>
              </View>
              {/* Facilities Icon */}
              {/* <View
              style={[
                styles.contentService,
                {borderBottomColor: colors.border},
              ]}>
              {[
                {key: '1', name: 'wifi'},
                {key: '2', name: 'coffee'},
                {key: '3', name: 'bath'},
                {key: '4', name: 'car'},
                {key: '5', name: 'paw'},
              ].map((item, index) => (
                <View style={{alignItems: 'center'}} key={'service' + index}>
                  <Icon name={item.name} size={24} color={colors.accent} />
                  <Text overline grayColor style={{marginTop: 4}}>
                    {item.name}
                  </Text>
                </View>
              ))}
            </View> */}
              {/* Map location */}
              <View
                style={[styles.blockView, {borderBottomColor: colors.border}]}>
                <Text headline style={{marginBottom: 5}} semibold>
                  {t('location')}
                </Text>
                <Text body2 numberOfLines={2}></Text>
                <View
                  style={{
                    height: 180,
                    width: '100%',
                    marginTop: 10,
                  }}>
                  {renderMapView && (
                    <MapView
                      provider={PROVIDER_GOOGLE}
                      style={styles.map}
                      region={region}
                      onRegionChange={() => {}}>
                      <Marker
                        coordinate={{
                          latitude: 25.197308625435493,
                          longitude: 55.274365668813886,
                        }}

                        //25.197308625435493, 55.274365668813886
                      />
                    </MapView>
                  )}
                </View>
              </View>
              {/* Open Time */}

              {/* Rooms */}

              {/* Todo Things */}

              {/* Help Block Information */}
              <View
                style={[styles.blockView, {borderBottomColor: colors.border}]}>
                <HelpBlock
                  title={helpBlock.title}
                  description={helpBlock.description}
                  phone={helpBlock.phone}
                  email={helpBlock.email}
                  style={{margin: 20}}
                  onPress={() => {
                    navigation.navigate('ContactUs');
                  }}
                />
              </View>
            </View>
          </ScrollView>
          {/* Pricing & Booking Process */}
          <View
            style={[
              styles.contentButtonBottom,
              {borderTopColor: colors.border},
            ]}>
            <View>
              <Text caption1 semibold>
                price
              </Text>
              <Text title3 primaryColor semibold>
                {attDetail.adultPrice + ' AED'}
              </Text>
              <Text caption1 semibold style={{marginTop: 5}}>
                Price May be Changed
              </Text>
              <Text caption1 semibold style={{marginTop: 0}}>
                Based Ticket Types
              </Text>
            </View>
            <Button
              onPress={() =>
                navigation.navigate('AttractionBook', {
                  attractionId: attractionId,
                  attConnectWithApi: attDetail.attConnectWithApi,
                })
              }>
              {t('book_now')}
            </Button>
          </View>
        </SafeAreaView>
      )}
    </View>
  );
}
