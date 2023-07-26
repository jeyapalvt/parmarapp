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
  TourItem,
  FilterSort,
  TextInput,
} from '@components';
import styles from './styles';
import * as Utils from '@utils';
import {TourData} from '@data';
import {useTranslation} from 'react-i18next';
import axios from 'axios';
import {RequestUrl} from '../../api';

export default function Tour({navigation}) {
  const {t} = useTranslation();
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
  const {colors} = useTheme();

  const [refreshing] = useState(false);
  const [modeView, setModeView] = useState('block');
  const [tours] = useState(TourData);

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

  const [tourList, settourList] = useState(['']);

  useEffect(() => {
    getAllTourList();
  }, []);

  const getAllTourList = async () => {
    await axios
      .post(RequestUrl + 'gettourpackageall', {
        currencyCode: 'AED',
        platformId: 1,
      })
      .then(response => {
        // console.log(
        //   `You ALl TOur list :\n\n${JSON.stringify(response.data, null, 2)}`,
        // );
        settourList(response.data);
      })
      .catch(err => {});
  };

  const [search, setsearch] = useState('');
  const filterTour = tourList.filter(item => {
    return (
      item.tourName &&
      item.tourName.toLowerCase().includes(search.toLocaleLowerCase())
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
              data={filterTour}
              key={'block'}
              keyExtractor={(item, index) => item.tourPackageId}
              renderItem={({item, index}) => (
                <TourItem
                  block
                  image={item.tourBannerImage}
                  name={item.tourName}
                  location={item.tourCity}
                  price={item.tourPrice + ' AED'}
                  // rate={item.rate}
                  // rateCount={item.rateCount}
                  // numReviews={item.numReviews}
                  // author={item.author}
                  // services={item.services}
                  style={{
                    marginBottom: 10,
                  }}
                  onPress={() => {
                    navigation.navigate('TourDetail', {
                      tourPackageId: item.tourPackageId,
                    });
                  }}
                  // onPressBookNow={() => {
                  //   navigation.navigate('PreviewBooking');
                  // }}
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
              showsVerticalScrollIndicator={false}
              numColumns={2}
              data={filterTour}
              key={'gird'}
              keyExtractor={(item, index) => item.tourPackageId}
              renderItem={({item, index}) => (
                <TourItem
                  grid
                  image={item.tourBannerImage}
                  name={item.tourName}
                  location={item.tourCity}
                  price={item.tourPrice + ' AED'}
                  style={{
                    marginBottom: 15,
                    marginLeft: 15,
                  }}
                  onPress={() => {
                    navigation.navigate('TourDetail', {
                      tourPackageId: item.tourPackageId,
                    });
                  }}
                  // onPressBookNow={() => {
                  //   navigation.navigate('PreviewBooking');
                  // }}
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
                paddingHorizontal: 20,
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
              data={filterTour}
              key={'list'}
              keyExtractor={(item, index) => item.tourPackageId}
              renderItem={({item, index}) => (
                <TourItem
                  list
                  image={item.tourBannerImage}
                  name={item.tourName}
                  location={item.tourCity}
                  price={item.tourPrice + ' AED'}
                  style={{
                    marginBottom: 20,
                  }}
                  onPress={() => {
                    navigation.navigate('TourDetail'),
                      {tourPackageId: item.tourPackageId};
                  }}
                  onPressBookNow={() => {
                    navigation.navigate('PreviewBooking');
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
              data={filterTour}
              key={'block'}
              keyExtractor={(item, index) => item.tourPackageId}
              renderItem={({item, index}) => (
                <TourItem
                  block
                  image={item.tourBannerImage}
                  name={item.tourName}
                  location={item.tourCity}
                  price={item.tourPrice + ' AED'}
                  style={{
                    marginBottom: 10,
                  }}
                  onPress={() => {
                    navigation.navigate('TourDetail', {
                      tourPackageId: item.tourPackageId,
                    });
                  }}
                  // onPressBookNow={() => {
                  //   navigation.navigate('PreviewBooking');
                  // }}
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
        title="Tours"
        subTitle="Find Your Best Tour Packages Here"
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
            placeholder="Search Your Tour Here"
            value={search}
          />
        </View>
        {tourList == '' ? (
          <ActivityIndicator color={colors.primary} />
        ) : (
          renderContent()
        )}
      </SafeAreaView>
    </View>
  );
}
