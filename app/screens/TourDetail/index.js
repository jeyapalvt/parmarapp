import React, {useState, useEffect} from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  FlatList,
  RefreshControl,
} from 'react-native';
import {BaseStyle, BaseColor, Images, useTheme} from '@config';
import {
  Image,
  Header,
  SafeAreaView,
  Icon,
  ProfileDescription,
  ProfilePerformance,
  Tag,
  Text,
  Card,
  TourDay,
  TourItem,
  Button,
  PackageItem,
  RateDetail,
  CommentItem,
} from '@components';
import {TabView, TabBar} from 'react-native-tab-view';
import styles from './styles';
import {UserData, ReviewData, TourData, PackageData} from '@data';
import {useTranslation} from 'react-i18next';
import {ImagePath, RequestUrl} from '../../api';
import axios from 'axios';

export default function TourDetail({navigation, route}) {
  const {tourPackageId} = route.params;

  const {colors} = useTheme();
  const {t} = useTranslation();

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    {key: 'information', title: t('information')},
    {key: 'tour', title: t('tours')},
    // {key: 'package', title: t('packages')},
    // {key: 'review', title: t('reviews')},
  ]);
  const [userData] = useState(UserData[0]);

  const [tourName, settourName] = useState('');

  // When tab is activated, set what's index value
  const handleIndexChange = index => setIndex(index);

  // Customize UI tab bar
  const renderTabBar = props => (
    <TabBar
      {...props}
      scrollEnabled
      indicatorStyle={[styles.indicator, {backgroundColor: colors.primary}]}
      style={[styles.tabbar, {backgroundColor: colors.background}]}
      tabStyle={styles.tab}
      inactiveColor={BaseColor.grayColor}
      activeColor={colors.text}
      renderLabel={({route, focused, color}) => (
        <View style={{flex: 1, width: 130, alignItems: 'center'}}>
          <Text headline semibold={focused} style={{color}}>
            {route.title}
          </Text>
        </View>
      )}
    />
  );

  const [tourDetails, settourDetails] = useState(['']);
  const [noOfDays, setnoOfDays] = useState(0);
  useEffect(() => {
    // const tourData = tours.filter(item => item.id == tourID);
    // settourDetails(tourData);
    getTourDetail();
  }, []);

  const getTourDetail = () => {
    axios
      .post(RequestUrl + 'gettourpackageDetails', {
        tourPackageId: tourPackageId,
      })
      .then(response => {
        setnoOfDays(response.data.packageDetail.length);

        settourDetails(response.data);
        //  (
        //         `You Tour Tab:\n\n${JSON.stringify(response.data, null, 2)}`,
        //       );

        settourName(response.data.tourName);
        // ("response.data.tourName", response.data.tourName)
      })
      .catch(error => {
        error;
      });
  };

  // Render correct screen container when tab is activated
  const renderScene = ({route, jumpTo}) => {
    switch (route.key) {
      case 'information':
        return (
          <InformationTab
            jumpTo={jumpTo}
            navigation={navigation}
            tourPackageId={tourPackageId}
          />
        );
      case 'tour':
        return (
          <TourTab
            jumpTo={jumpTo}
            navigation={navigation}
            tourPackageId={tourPackageId}
          />
        );
      // case 'package':
      //   return (
      //     <PackageTab
      //       jumpTo={jumpTo}
      //       navigation={navigation}
      //       tourPackageId={tourPackageId}
      //     />
      //   );
      // case 'review':
      //   return (
      //     <ReviewTab
      //       jumpTo={jumpTo}
      //       navigation={navigation}
      //       tourPackageId={tourPackageId}
      //     />
      //   );
    }
  };

  return (
    <View style={{flex: 1}}>
      <Header
        title="Tour Package Details"
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
        {/* <ProfileDescription
          image={userData.image}
          name={userData.name}
          subName={userData.major}
          description={userData.address}
          style={{marginTop: 25, paddingHorizontal: 20}}
        /> */}
        {/* <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 20,
          }}>
          <Tag primary style={{width: 80}}>
            + {t('follow')}
          </Tag>
          <View style={{flex: 1, paddingLeft: 10, paddingVertical: 5}}>
            <ProfilePerformance data={userData.performance} type="small" />
          </View>
        </View> */}
        <View style={{flex: 1}}>
          <TabView
            lazy
            navigationState={{index, routes}}
            renderScene={renderScene}
            renderTabBar={renderTabBar}
            onIndexChange={handleIndexChange}
          />
          <View
            style={[
              styles.contentButtonBottom,
              {borderTopColor: colors.border},
            ]}>
            <View>
              <Text caption1 semibold>
                {noOfDays + ' Days'}
              </Text>

              <Text caption1 semibold style={{marginTop: 5}}>
                {tourDetails.tourPrice + ' AED'}
              </Text>
            </View>
            <Button
              onPress={() =>
                navigation.navigate('TourBook', {
                  tourPackageId: tourPackageId,
                  tourName: tourName,
                })
              }>
              Book Now
            </Button>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

/**
 * @description Show when tab Information activated
 * @author Passion UI <passionui.com>
 * @date 2019-08-03
 * @class PreviewTab
 * @extends {Component}
 */

function InformationTab({navigation, tourPackageId}) {
  const [tourDetails, settourDetails] = useState(['']);
  const [information, setinformation] = useState(['']);

  const [dayTour, setdayTour] = useState([]);

  useEffect(() => {
    // const tourData = tours.filter(item => item.id == tourID);
    // settourDetails(tourData);
    getTourDetail();
  }, []);

  const getTourDetail = () => {
    axios
      .post(RequestUrl + 'gettourpackageDetails', {
        tourPackageId: tourPackageId,
      })
      .then(response => {
        settourDetails(response.data);
        collectInformation(response.data);
        setdayTour(response.data.packageDetail);
      })
      .catch(error => {});
  };

  const collectInformation = data => {
    let tempInformation = [];
    tempInformation.push({title: 'Name', detail: data.tourName});
    tempInformation.push({title: 'Location', detail: data.tourCity});
    tempInformation.push({
      title: 'Price per Participant ',
      detail: data.tourPrice + ' AED',
    });
    tempInformation.push({
      title: 'Days ',
      detail: data.packageDetail.length,
    });

    setinformation(tempInformation);
  };

  var tourDescription;
  if (tourDetails != '') {
    tourDescription =
      tourDetails.tourDescription &&
      tourDetails.tourDescription.replace(/<[^>]+>/g, '');
  }
  //tourDescription
  const [tours] = useState(TourData);

  const {colors} = useTheme();
  return (
    <ScrollView>
      <View style={{paddingHorizontal: 20}}>
        {information.map((item, index) => {
          return (
            <View
              style={[
                styles.lineInformation,
                {borderBottomColor: colors.border},
              ]}
              key={'information' + index}>
              <Text body2 grayColor>
                {item.title}
              </Text>
              <Text body2 semibold accentColor>
                {item.detail}
              </Text>
            </View>
          );
        })}
      </View>

      <View>
        <Text
          headline
          semibold
          style={{
            marginHorizontal: 20,
            marginTop: 20,
            marginBottom: 10,
          }}>
          Tour Information
        </Text>

        <FlatList
          contentContainerStyle={{paddingLeft: 5, paddingRight: 20}}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          data={dayTour}
          keyExtractor={(item, index) => item.packageDetailId}
          renderItem={({item, index}) => (
            <TourDay
              image={item.packageSitePhoto}
              day={'Day ' + Number(index + 1)}
              title={item.packageDayHeading}
              description={item.packageDayActivity}
              style={{marginLeft: 15}}
              onPress={() => {}}
            />
          )}
        />
      </View>
      <View style={{paddingHorizontal: 20, marginTop: 20}}>
        <Text headline semibold style={{marginBottom: 10}}>
          About
        </Text>
        <Text body2>{tourDescription}</Text>
      </View>
    </ScrollView>
  );
}

/**
 * @description Show when tab Tour activated
 * @author Passion UI <passionui.com>
 * @date 2019-08-03
 * @class PreviewTab
 * @extends {Component}
 */

function TourTab({navigation, tourPackageId}) {
  const [tourDetails, settourDetails] = useState(['']);
  useEffect(() => {
    // const tourData = tours.filter(item => item.id == tourID);
    // settourDetails(tourData);
    getTourDetail();
  }, []);

  const getTourDetail = () => {
    axios
      .post(RequestUrl + 'gettourpackageDetails', {
        tourPackageId: tourPackageId,
      })
      .then(response => {
        // (
        //   `You Tour Tab:\n\n${JSON.stringify(response.data, null, 2)}`,
        // );
        // (
        //   `You Tour Tab:\n\n${JSON.stringify(response.data.packageDetail, null, 2)}`,
        // );
        settourDetails(response.data.packageDetail);
      })
      .catch(error => {});
  };
  return (
    <ScrollView>
      <View style={{paddingHorizontal: 20, marginTop: 20}}>
        {tourDetails &&
          tourDetails.map((item, index) => {
            return (
              <>
                <View key={item.packageDetailId}>
                  <Text headline semibold style={{marginTop: 20}}>
                    {item.packageDayHeading}
                  </Text>
                  <Image
                    source={{uri: ImagePath + item.packageSitePhoto}}
                    style={{height: 120, width: '100%', marginTop: 10}}
                  />
                  <Text body2 style={{marginTop: 10}}>
                    {item.packageDayActivity}
                  </Text>
                </View>
              </>
            );
          })}
      </View>
    </ScrollView>
  );
}

/**
 * @description Show when tab Package activated
 * @author Passion UI <passionui.com>
 * @date 2019-08-03
 * @class PreviewTab
 * @extends {Component}
 */

// function PackageTab({navigation}) {
//   const [packageItem] = useState(PackageData[0]);
//   const [packageItem2] = useState(PackageData[2]);

//   return (
//     <ScrollView>
//       <View style={{paddingHorizontal: 20}}>
//         <Text body2 style={{marginTop: 20}}>
//           Europe welcomes millions of travelers every year. With Expat Explore
//           you can see all that Europe has to offer. Take the time to explore
//           small villages and big cities. There's lots to choose from in over 50
//           independent states. Our Europe multi-country tours are some of the
//           best packages. We offer you great prices, quality and convenience. Get
//           ready for the best European vacation! Europe has a list of possible
//           adventures for everyone.{' '}
//         </Text>
//         <PackageItem
//           packageName={packageItem.packageName}
//           price={packageItem.price}
//           type={packageItem.type}
//           description={packageItem.description}
//           services={packageItem.services}
//           onPressIcon={() => {
//             navigation.navigate('PricingTable');
//           }}
//           onPress={() => {
//             navigation.navigate('PreviewBooking');
//           }}
//           style={{marginBottom: 10, marginTop: 20}}
//         />
//         <PackageItem
//           detail
//           packageName={packageItem2.packageName}
//           price={packageItem2.price}
//           type={packageItem2.type}
//           description={packageItem2.description}
//           services={packageItem2.services}
//         />
//       </View>
//     </ScrollView>
//   );
// }

/**
 * @description Show when tab Review activated
 * @author Passion UI <passionui.com>
 * @date 2019-08-03
 * @class PreviewTab
 * @extends {Component}
 */

// function ReviewTab({navigation}) {
//   const [refreshing] = useState(false);
//   const [rateDetail] = useState({
//     point: 4.7,
//     maxPoint: 5,
//     totalRating: 25,
//     data: ['80%', '10%', '10%', '0%', '0%'],
//   });
//   const [reviewList] = useState(ReviewData);
//   const {colors} = useTheme();

//   return (
//     <FlatList
//       contentContainerStyle={{padding: 20}}
//       refreshControl={
//         <RefreshControl
//           colors={[colors.primary]}
//           tintColor={colors.primary}
//           refreshing={refreshing}
//           onRefresh={() => {}}
//         />
//       }
//       data={reviewList}
//       keyExtractor={(item, index) => item.id}
//       ListHeaderComponent={() => (
//         <RateDetail
//           point={rateDetail.point}
//           maxPoint={rateDetail.maxPoint}
//           totalRating={rateDetail.totalRating}
//           data={rateDetail.data}
//         />
//       )}
//       renderItem={({item}) => (
//         <CommentItem
//           style={{marginTop: 10}}
//           image={item.source}
//           name={item.name}
//           rate={item.rate}
//           date={item.date}
//           title={item.title}
//           comment={item.comment}
//         />
//       )}
//     />
//   );
// }
