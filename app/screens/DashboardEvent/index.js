import React, {useState, useEffect} from 'react';
import {
  View,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import {BaseStyle, BaseColor, Images, useTheme} from '@config';
import {
  Header,
  SafeAreaView,
  Icon,
  Text,
  TextInput,
  EventCard,
  EventItem,
} from '@components';
import {EventListData} from '@data';
import {useTranslation} from 'react-i18next';
import styles from './styles';
import {RequestUrl} from '../../api';
import axios from 'axios';

export default function DashboardEvent({navigation}) {
  const {colors} = useTheme();
  const {t} = useTranslation();

  const [search, setSearch] = useState('');
  const [loading] = useState(false);
  const [recommend] = useState(EventListData);
  const [services] = useState([
    {
      id: '1',
      color: colors.primaryLight,
      icon: 'compass',
      name: 'all',
    },
    {
      id: '2',
      color: BaseColor.kashmir,
      icon: 'music',
      name: 'music',
    },
    {
      id: '3',
      color: BaseColor.blueColor,
      icon: 'futbol',
      name: 'sports',
    },
    {
      id: '4',
      color: BaseColor.pinkColor,
      icon: 'star',
      name: 'shows',
    },
    {
      id: '5',
      color: colors.primary,
      icon: 'bullseye',
      name: 'discounts',
    },
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

  /**
   * onSearch change
   * @param {*} keyword
   */
  const onSearch = keyword => {};

  useEffect(() => {
    getAllTours();
    getAllCombo();
  }, []);
  const [comboOffer, setcomboOffers] = useState([]);
  const [tourPackages, settourPackages] = useState([]);

  //get All tours
  const getAllTours = () => {
    axios
      .post(RequestUrl + 'gettourpackageall', {attractionId: 1})
      .then(response => {
        //  (
        //   `You Tour list :\n\n${JSON.stringify(response.data, null, 2)}`,
        // );
        settourPackages(response.data);
      })
      .catch(error => {});
  };

  // get all combo pack
  const getAllCombo = () => {
    axios
      .post(RequestUrl + 'getComboOfferList', {ComboOfferId: 0})
      .then(response => {
        setcomboOffers(response.data);
        // (
        //   `You comboOffers list :\n\n${JSON.stringify(response.data, null, 2)}`,
        // );
      })
      .catch(() => {});
  };

  return (
    <View style={{flex: 1}}>
      <Header
        title={t('search')}
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
          if (loading) {
            return <ActivityIndicator size="small" color={colors.primary} />;
          }
        }}
        onPressLeft={() => {
          navigation.goBack();
        }}
      />
      <SafeAreaView
        style={BaseStyle.safeAreaView}
        edges={['right', 'left', 'bottom']}>
        <ScrollView>
          <View style={{padding: 20}}>
            {/* <TextInput
              onChangeText={text => setSearch(text)}
              placeholder={t('search')}
              value={search}
              onSubmitEditing={() => {
                onSearch(search);
              }}
              icon={
                <TouchableOpacity
                  onPress={() => {
                    setSearch('');
                  }}
                  style={styles.btnClearSearch}>
                  <Icon name="times" size={18} color={BaseColor.grayColor} />
                </TouchableOpacity>
              }
            /> */}
          </View>

          {comboOffer && (
            <>
              <Text title3 semibold style={{padding: 20}}>
                Combo Offers
              </Text>
              <View>
                <FlatList
                  contentContainerStyle={{
                    paddingRight: 20,
                    paddingLeft: 5,
                  }}
                  horizontal={true}
                  data={comboOffer}
                  showsHorizontalScrollIndicator={false}
                  keyExtractor={(item, index) => item.comboOfferId}
                  renderItem={({item, index}) => (
                    <EventCard
                      image={item.thumbImageFile}
                      title={item.comboName}
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
            </>
          )}

          {tourPackages && (
            <>
              <Text title3 semibold style={{padding: 20}}>
                Tour Packages
              </Text>
              <FlatList
                contentContainerStyle={{
                  paddingRight: 20,
                  paddingLeft: 5,
                  paddingBottom: 20,
                }}
                horizontal={true}
                data={tourPackages}
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item, index) => item.tourPackageId}
                renderItem={({item, index}) => (
                  <EventItem
                    grid
                    image={item.tourThumbnailImage}
                    title={item.tourName}
                    style={{marginLeft: 15, width: 200}}
                    onPress={() =>
                      navigation.navigate('TourDetail', {
                        tourPackageId: item.tourPackageId,
                      })
                    }
                  />
                )}
              />
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
