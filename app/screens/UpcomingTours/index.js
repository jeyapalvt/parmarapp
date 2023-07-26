import React, {useState, useEffect} from 'react';
import {FlatList, RefreshControl, View, Animated} from 'react-native';
import {BaseStyle, useTheme} from '@config';
import {Header, SafeAreaView, Icon, HotelItem, TextInput} from '@components';
import styles from './styles';
import * as Utils from '@utils';
import {useTranslation} from 'react-i18next';

import {RequestUrl} from '../../api';
import axios from 'axios';
export default function UpcomingTours({navigation, route}) {
  const {colors} = useTheme();
  const {t} = useTranslation();
  const upcomTour = route.params.upcomTour;

  const [modeView, setModeView] = useState('block');

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

  const [allAttractions, setallAttractions] = useState(upcomTour);
  useEffect(() => {
    //getAllAttractions();
  }, []);

  //Get All attraction And set based on there catogery
  const getAllAttractions = () => {
    axios
      .post(RequestUrl + 'getattractionall', {
        attractionId: 1,
        agencyId: 0,
        agencyUserId: 0,
      })
      .then(response => {
        const temp = response.data.filter(item => item.attractionsId == 45);
        // (
        //   `You Attractions list :\n\n${JSON.stringify(temp, null, 2)}`,
        // );

        setallAttractions(response.data);
      })
      .catch(error => {});
  };

  const [search, setsearch] = useState('');
  const filterAttraction = allAttractions.filter(attract => {
    return attract.attName.toLowerCase().includes(search.toLocaleLowerCase());
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
              data={filterAttraction}
              key={'block'}
              keyExtractor={(item, index) => item.attractionsId}
              renderItem={({item, index}) => (
                <HotelItem
                  block
                  image={item.attBannerImage}
                  name={item.attName}
                  location={item.attCity}
                  price={item.price + ' AED'}
                  // available={item.available}
                  // rate={item.rate}
                  // rateStatus={item.rateStatus}
                  // numReviews={item.numReviews}
                  // services={item.services}
                  style={{
                    paddingBottom: 10,
                  }}
                  onPress={() =>
                    navigation.navigate('AttractionDetails', {
                      attractionId: item.attractionsId,
                    })
                  }
                  // onPressTag={() => navigation.navigate('Review')}
                />
              )}
            />
            {/* <Animated.View
              style={[
                styles.navbar,
                {transform: [{translateY: navbarTranslate}]},
              ]}>
              <FilterSort
                modeView={modeView}
                onChangeSort={onChangeSort}
                onChangeView={onChangeView}
                onFilter={onFilter}
              />
            </Animated.View> */}
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
              data={filterAttraction}
              key={'grid'}
              keyExtractor={(item, index) => item.attractionsId}
              renderItem={({item, index}) => (
                <HotelItem
                  grid
                  image={item.attBannerImage}
                  name={item.attName}
                  location={item.attCity}
                  price={item.price + ' AED'}
                  // available={item.available}
                  // rate={item.rate}
                  // rateStatus={item.rateStatus}
                  // numReviews={item.numReviews}
                  // services={item.services}
                  onPress={() =>
                    navigation.navigate('AttractionDetails', {
                      attractionId: item.attractionsId,
                    })
                  }
                  style={{
                    marginBottom: 15,
                    marginLeft: 15,
                  }}
                />
              )}
            />
            {/* <Animated.View
              style={[
                styles.navbar,
                {
                  transform: [{translateY: navbarTranslate}],
                },
              ]}>
              <FilterSort
                modeView={modeView}
                onChangeSort={onChangeSort}
                onChangeView={onChangeView}
                onFilter={onFilter}
              />
            </Animated.View> */}
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
              data={filterAttraction}
              key={'list'}
              keyExtractor={(item, index) => item.attractionsId}
              renderItem={({item, index}) => (
                <HotelItem
                  list
                  image={item.attBannerImage}
                  name={item.attName}
                  location={item.attCity}
                  price={item.price + ' AED'}
                  // available={item.available}
                  // rate={item.rate}
                  // rateStatus={item.rateStatus}
                  // numReviews={item.numReviews}
                  // services={item.services}
                  style={{
                    marginHorizontal: 20,
                    marginBottom: 15,
                  }}
                  onPress={() => {
                    navigation.navigate('AttractionDetails', {
                      attractionId: item.attractionsId,
                    });
                  }}
                />
              )}
            />
            {/* <Animated.View
              style={[
                styles.navbar,
                {
                  transform: [{translateY: navbarTranslate}],
                },
              ]}>
              <FilterSort
                modeView={modeView}
                onChangeSort={onChangeSort}
                onChangeView={onChangeView}
                onFilter={onFilter}
              />
            </Animated.View> */}
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
              data={filterAttraction}
              key={'block'}
              keyExtractor={(item, index) => item.attractionsId}
              renderItem={({item, index}) => (
                <HotelItem
                  block
                  image={item.attBannerImage}
                  name={item.attName}
                  location={item.attCity}
                  price={item.price + ' AED'}
                  // location={item.location}
                  // price={item.price}
                  // available={item.available}
                  // rate={item.rate}
                  // rateStatus={item.rateStatus}
                  // numReviews={item.numReviews}
                  // services={item.services}
                  style={{
                    marginBottom: 10,
                  }}
                  onPress={() =>
                    navigation.navigate('AttractionDetails', {
                      attractionId: item.attractionsId,
                    })
                  }
                  // onPressTag={() => navigation.navigate('Preview')}
                />
              )}
            />
            {/* <Animated.View
              style={[
                styles.navbar,
                {transform: [{translateY: navbarTranslate}]},
              ]}>
              <FilterSort
                modeView={modeView}
                onChangeSort={onChangeSort}
                onChangeView={onChangeView}
                onFilter={onFilter}
              />
            </Animated.View> */}
          </View>
        );
    }
  };

  return (
    <View style={{flex: 1}}>
      <Header
        title="Upcoming Tours"
        subTitle="Find Your Attractions Here"
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
            placeholder="Search Your Attraction Here"
            value={search}
          />
        </View>
        {renderContent()}
      </SafeAreaView>
    </View>
  );
}
