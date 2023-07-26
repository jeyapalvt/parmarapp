import React, {useState, useEffect} from 'react';
import {
  View,
  ScrollView,
  FlatList,
  Animated,
  TouchableOpacity,
} from 'react-native';
import {BaseColor, Images, useTheme} from '@config';
import {
  Header,
  SafeAreaView,
  Icon,
  Text,
  ProfileGroup,
  Tag,
  Image,
  Button,
  EventCard,
} from '@components';
import {useTranslation} from 'react-i18next';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import * as Utils from '@utils';
import styles from './styles';
import {ImagePath, RequestUrl} from '../../api';
import axios from 'axios';
import {useSelector} from 'react-redux';

export default function EventDetail({navigation, route}) {
  const {comboOfferId} = route.params;

  const deltaY = new Animated.Value(0);
  const heightImageBanner = Utils.scaleWithPixel(250, 1);
  const {colors} = useTheme();
  const {t} = useTranslation();

  const [heightHeader, setHeightHeader] = useState(Utils.heightHeader());
  const [region] = useState({
    latitude: 1.352083,
    longitude: 103.819839,
    latitudeDelta: 0.009,
    longitudeDelta: 0.004,
  });

  const [isLoaded, setisLoaded] = useState(false);
  const [comboList, setcomboList] = useState([]);
  const authapi = useSelector(state => state.authapi);
  const [comboData, setComboData] = useState([]);
  const [showPrice, setshowPrice] = useState();
  useEffect(() => {
    getComboPack();
  }, [isLoaded, authapi]);

  const getComboPack = () => {
    axios
      .post(RequestUrl + 'getComboOfferList', {
        currencyCode: 'AED',
        platformId: 1,
      })
      .then(response => {
        let tempData = response.data;

        const comboData = tempData.filter(
          item => item.comboOfferId == comboOfferId,
        );

        console.log('combo data', JSON.stringify(comboData[0], null, 2));
        if (
          authapi.userType == 1 ||
          authapi.userType == 2 ||
          authapi.userType == 3
        ) {
          setshowPrice(comboData[0].offerB2bAdultPrice);
        } else {
          setshowPrice(comboData[0].offerPrice);
        }
        setcomboList(comboData);
        setisLoaded(true);
      })
      .catch(error => {
        error;
      });
  };

  let comboDescription;
  if (isLoaded) {
    comboDescription = comboList[0].comboDescription.replace(/<[^>]+>/g, '');
  }

  return (
    <View style={{flex: 1}}>
      <Animated.View
        style={[
          styles.imgBanner,
          {
            height: deltaY.interpolate({
              inputRange: [
                0,
                Utils.scaleWithPixel(140),
                Utils.scaleWithPixel(140),
              ],
              outputRange: [heightImageBanner, heightHeader, heightHeader],
            }),
          },
        ]}>
        {isLoaded && (
          <Image
            source={{uri: ImagePath + comboList[0].bannerImageFile}}
            style={{flex: 1}}
          />
        )}

        <Animated.View
          style={{
            position: 'absolute',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            paddingHorizontal: 20,
            width: '100%',
            bottom: 15,
            opacity: deltaY.interpolate({
              inputRange: [
                0,
                Utils.scaleWithPixel(140),
                Utils.scaleWithPixel(140),
              ],
              outputRange: [1, 0, 0],
            }),
          }}></Animated.View>
      </Animated.View>
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

      <SafeAreaView style={{flex: 1}} edges={['right', 'left', 'bottom']}>
        <ScrollView
          onScroll={Animated.event([
            {
              nativeEvent: {
                contentOffset: {y: deltaY},
              },
            },
          ])}
          onContentSizeChange={() => {
            setHeightHeader(Utils.heightHeader());
          }}
          scrollEventThrottle={8}>
          <View style={{height: 255 - heightHeader}} />

          <View
            style={{
              paddingHorizontal: 20,
              marginBottom: 20,
            }}>
            <Text title1 semibold numberOfLines={1} style={{marginBottom: 10}}>
              {isLoaded && comboList[0].comboName}
            </Text>

            <Text title3 semibold style={{marginTop: 10, marginBottom: 5}}>
              {t('price')}
            </Text>
            <View style={[styles.itemPrice, {borderColor: colors.border}]}>
              <View style={styles.linePrice}>
                <Text
                  title3
                  primaryColor
                  semibold
                  style={{
                    textDecorationLine: 'line-through',
                    textDecorationStyle: 'solid',
                  }}>
                  {isLoaded && comboList[0].actualPrice + ' AED'}
                </Text>
                <View style={styles.iconRight}>
                  <Text title3 primaryColor semibold>
                    {isLoaded && showPrice + 'AED'}
                  </Text>
                </View>
              </View>
            </View>

            <Text body2 semibold style={{marginTop: 20, marginBottom: 10}}>
              Description
            </Text>
            <Text body2 grayColor lineHeight={20}>
              {isLoaded && comboDescription && comboDescription}
            </Text>

            <View
              style={{
                height: 180,
              }}>
              <MapView
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                region={region}
                onRegionChange={() => {}}>
                <Marker
                  coordinate={{
                    latitude: 1.352083,
                    longitude: 103.819839,
                  }}
                />
              </MapView>
            </View>
          </View>
        </ScrollView>
        {/* Pricing & Booking Process */}
        <View
          style={[styles.contentButtonBottom, {borderTopColor: colors.border}]}>
          <View>
            <Text caption1 semibold grayColor>
              {t('avg_price')}
            </Text>
            <Text title3 primaryColor semibold>
              {isLoaded && showPrice + ' AED'}
            </Text>
            <Text caption1 semibold grayColor style={{marginTop: 5}}>
              {t('person_ticket')}
            </Text>
          </View>
          <Button
            onPress={() =>
              navigation.navigate('ComboBook', {
                ComboOfferId: comboList[0].comboOfferId,
                offerPrice: comboList[0].offerPrice,
                offerChildPrice: comboList[0].offerChildPrice,
                offerB2bAdultPrice: comboList[0].offerB2bAdultPrice,
                offerB2bChildPrice: comboList[0].offerB2bChildPrice,
              })
            }>
            {t('book_now')}
          </Button>
        </View>
      </SafeAreaView>
    </View>
  );
}
