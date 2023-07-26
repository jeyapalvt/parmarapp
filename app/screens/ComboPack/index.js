import React, {useState, useEffect} from 'react';
import {
  FlatList,
  RefreshControl,
  View,
  Animated,
  ActivityIndicator,
} from 'react-native';
import {BaseStyle, useTheme} from '@config';
import {
  Header,
  SafeAreaView,
  Icon,
  HotelItem,
  FilterSort,
  TextInput,
} from '@components';
import styles from './styles';
import * as Utils from '@utils';
import {useTranslation} from 'react-i18next';
import {HotelData} from '@data';
import {RequestUrl} from '../../api';
import axios from 'axios';
import {useSelector} from 'react-redux';
export default function ComboPack({navigation}) {
  const {colors} = useTheme();
  const {t} = useTranslation();

  const [modeView, setModeView] = useState('block');
  const [hotels] = useState(HotelData);
  const [refreshing] = useState(false);
  const scrollAnim = new Animated.Value(0);
  const offsetAnim = new Animated.Value(0);
  const clampedScroll = Animated.diffClamp(
    Animated.add(
      scrollAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
        extrapolateLeft: 'clamp',
      }),
      offsetAnim,
    ),
    0,
    40,
  );

  const onChangeSort = () => {};

  /**
   * @description Open modal when filterring mode is applied
   * @author Passion UI <passionui.com>
   * @date 2019-08-03
   */
  const onFilter = () => {
    navigation.navigate('Filter');
  };

  /**
   * @description Open modal when view mode is pressed
   * @author Passion UI <passionui.com>
   * @date 2019-08-03
   */
  const onChangeView = () => {
    Utils.enableExperimental();
    switch (modeView) {
      case 'block':
        setModeView('grid');

        break;
      case 'grid':
        setModeView('list');

        break;
      case 'list':
        setModeView('block');

        break;
      default:
        setModeView('block');
        break;
    }
  };

  /**
   * @description Render container view
   * @author Passion UI <passionui.com>
   * @date 2019-08-03
   * @returns
   */

  const authapi = useSelector(state => state.authapi);
  const [comboOffer, setcomboOffers] = useState([]);
  useEffect(() => {
    getAllCombo();
  }, [authapi]);

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
  const filterCombo = comboOffer.filter(item => {
    return (
      item.comboName &&
      item.comboName.toLowerCase().includes(search.toLocaleLowerCase())
    );
  });
  const renderContent = () => {
    const navbarTranslate = clampedScroll.interpolate({
      inputRange: [0, 40],
      outputRange: [0, -40],
      extrapolate: 'clamp',
    });
    switch (modeView) {
      case 'block':
        return (
          <View style={{flex: 1}}>
            <Animated.FlatList
              contentContainerStyle={{
                paddingTop: 50,
              }}
              refreshControl={
                <RefreshControl
                  colors={[colors.primary]}
                  tintColor={colors.primary}
                  refreshing={refreshing}
                  onRefresh={() => {}}
                />
              }
              scrollEventThrottle={1}
              onScroll={Animated.event(
                [
                  {
                    nativeEvent: {
                      contentOffset: {
                        y: scrollAnim,
                      },
                    },
                  },
                ],
                {useNativeDriver: true},
              )}
              data={filterCombo}
              key={'block'}
              keyExtractor={(item, index) => item.comboOfferId}
              renderItem={({item, index}) => (
                <HotelItem
                  block
                  image={item.thumbImageFile}
                  name={item.comboName}
                  location="Dubai"
                  price={item.offerPrice + ' AED'}
                  style={{
                    paddingBottom: 10,
                  }}
                  onPress={() =>
                    navigation.navigate('EventDetail', {
                      comboOfferId: item.comboOfferId,
                    })
                  }
                  //   onPressTag={() => navigation.navigate('Review')}
                />
              )}
            />
          </View>
        );
      case 'grid':
        return (
          <View style={{flex: 1}}>
            <Animated.FlatList
              contentContainerStyle={{
                paddingTop: 50,
              }}
              columnWrapperStyle={{
                paddingLeft: 5,
                paddingRight: 20,
              }}
              refreshControl={
                <RefreshControl
                  colors={[colors.primary]}
                  tintColor={colors.primary}
                  refreshing={refreshing}
                  onRefresh={() => {}}
                />
              }
              scrollEventThrottle={1}
              onScroll={Animated.event(
                [
                  {
                    nativeEvent: {
                      contentOffset: {
                        y: scrollAnim,
                      },
                    },
                  },
                ],
                {useNativeDriver: true},
              )}
              numColumns={2}
              data={filterCombo}
              key={'grid'}
              keyExtractor={(item, index) => item.comboOfferId}
              renderItem={({item, index}) => (
                <HotelItem
                  grid
                  image={item.thumbImageFile}
                  name={item.comboName}
                  location="Dubai"
                  price={
                    authapi.userType == 1 ||
                    authapi.userType == 2 ||
                    authapi.userType == 3
                      ? item.offerB2bAdultPrice + 'AED'
                      : item.offerPrice + ' AED'
                  }
                  onPress={() =>
                    navigation.navigate('EventDetail', {
                      comboOfferId: item.comboOfferId,
                    })
                  }
                  style={{
                    marginBottom: 15,
                    marginLeft: 15,
                  }}
                />
              )}
            />
          </View>
        );
      case 'list':
        return (
          <View style={{flex: 1}}>
            <Animated.FlatList
              contentContainerStyle={{
                paddingTop: 50,
              }}
              refreshControl={
                <RefreshControl
                  colors={[colors.primary]}
                  tintColor={colors.primary}
                  refreshing={refreshing}
                  onRefresh={() => {}}
                />
              }
              scrollEventThrottle={1}
              onScroll={Animated.event(
                [
                  {
                    nativeEvent: {
                      contentOffset: {
                        y: scrollAnim,
                      },
                    },
                  },
                ],
                {useNativeDriver: true},
              )}
              data={filterCombo}
              key={'list'}
              keyExtractor={(item, index) => item.comboOfferId}
              renderItem={({item, index}) => (
                <HotelItem
                  list
                  image={item.thumbImageFile}
                  name={item.comboName}
                  location="Dubai"
                  price={
                    authapi.userType == 1 ||
                    authapi.userType == 2 ||
                    authapi.userType == 3
                      ? item.offerB2bAdultPrice + 'AED'
                      : item.offerPrice + ' AED'
                  }
                  style={{
                    marginHorizontal: 20,
                    marginBottom: 15,
                  }}
                  onPress={() => {
                    navigation.navigate('EventDetail', {
                      comboOfferId: item.comboOfferId,
                    });
                  }}
                />
              )}
            />
          </View>
        );
      default:
        return (
          <View style={{flex: 1}}>
            <Animated.FlatList
              contentContainerStyle={{
                paddingTop: 50,
              }}
              refreshControl={
                <RefreshControl
                  colors={[colors.primary]}
                  tintColor={colors.primary}
                  refreshing={refreshing}
                  onRefresh={() => {}}
                />
              }
              scrollEventThrottle={1}
              onScroll={Animated.event(
                [
                  {
                    nativeEvent: {
                      contentOffset: {
                        y: scrollAnim,
                      },
                    },
                  },
                ],
                {useNativeDriver: true},
              )}
              data={filterCombo}
              key={'block'}
              keyExtractor={(item, index) => item.comboOfferId}
              renderItem={({item, index}) => (
                <HotelItem
                  block
                  image={item.thumbImageFile}
                  name={item.comboName}
                  location="Dubai"
                  price={
                    authapi.userType == 1 ||
                    authapi.userType == 2 ||
                    authapi.userType == 3
                      ? item.offerB2bAdultPrice + 'AED'
                      : item.offerPrice + ' AED'
                  }
                  style={{
                    marginBottom: 10,
                  }}
                  onPress={() =>
                    navigation.navigate('EventDetail', {
                      comboOfferId: item.comboOfferId,
                    })
                  }
                  // onPressTag={() => navigation.navigate('Preview')}
                />
              )}
            />
          </View>
        );
    }
  };

  return (
    <View style={{flex: 1}}>
      <Header
        title="Combo Offers"
        subTitle="Find Best Combo Offers"
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
        // renderRight={() => {
        //   return <Icon name="search" size={20} color={colors.primary} />;
        // }}
        onPressLeft={() => {
          navigation.goBack();
        }}
        // onPressRight={() => {
        //   navigation.navigate('SearchHistory');
        // }}
      />
      <SafeAreaView
        style={BaseStyle.safeAreaView}
        edges={['right', 'left', 'bottom']}>
        <View style={{marginTop: 10, padding: 10}}>
          <TextInput
            onChangeText={text => setsearch(text)}
            placeholder="Search Your Combo Here"
            value={search}
          />
        </View>
        {comboOffer == '' ? (
          <ActivityIndicator color={colors.primary} />
        ) : (
          renderContent()
        )}
      </SafeAreaView>
    </View>
  );
}
