import React, {useState, useEffect} from 'react';
import {FlatList, RefreshControl, View, Animated} from 'react-native';
import {BaseStyle, useTheme} from '@config';
import {Header, SafeAreaView, Icon, HotelItem, Image, Text} from '@components';
import styles from './styles';
import * as Utils from '@utils';
import {useTranslation} from 'react-i18next';
import {VisaData} from '@data';
import axios from 'axios';
import {RequestUrl} from '../../api';

export default function VisaService({navigation}) {
  const {t} = useTranslation();
  const {colors} = useTheme();

  const [heightHeader, setHeightHeader] = useState(Utils.heightHeader());
  const deltaY = new Animated.Value(0);

  /**
   * @description Show icon services on form searching
   * @author Passion UI <passionui.com>
   * @date 2019-08-03
   * @returns
   */

  const [visa] = useState(VisaData);

  const [visaData, setvisaData] = useState([]);
  const [dubaiVisa, setDubaivisa] = useState(['']);
  const [abudabiVisa, setabudabiVisa] = useState(['']);
  let dVisa = [],
    abVisa = [];

  useEffect(() => {
    getVisa();
  }, []);

  const getVisa = () => {
    axios
      .post(RequestUrl + 'getVisaList', {visaId: 0})
      .then(response => {
        let tempVisa = response.data;
        // (
        //   `Your Visa Data:\n\n${JSON.stringify(response.data, null, 2)}`,
        // );

        setVisaCatogery(response.data);
      })
      .catch(error => {});
  };

  const setVisaCatogery = tempData => {
    for (let i = 0; i < tempData.length; i++) {
      if (tempData[i].country == 'Dubai') {
        dVisa.push({
          country: tempData[i].country,
          expressCost: tempData[i].expressCost,
          imageFile: tempData[i].imageFile,
          visaDuration: tempData[i].visaDuration,
          visaId: tempData[i].visaId,
          visaName: tempData[i].visaName,
          visaPrice: tempData[i].visaPrice,
          visaShortDescription: tempData[i].visaShortDescription,
        });
      }
      if (tempData[i].country == 'Abudabi') {
        abVisa.push({
          country: tempData[i].country,
          expressCost: tempData[i].expressCost,
          imageFile: tempData[i].imageFile,
          visaDuration: tempData[i].visaDuration,
          visaId: tempData[i].visaId,
          visaName: tempData[i].visaName,
          visaPrice: tempData[i].visaPrice,
          visaShortDescription: tempData[i].visaShortDescription,
        });
      }
    }
    // (
    //   `Your Dubai Data:\n\n${JSON.stringify(dVisa, null, 2)}`,
    // );
    // (
    //   `Your Abudabi  Data:\n\n${JSON.stringify(abVisa, null, 2)}`,
    // );
    setDubaivisa(dVisa);
    setabudabiVisa(abVisa);
  };
  return (
    <>
      <View style={{flex: 1}}>
        <Header
          title="Visa Services"
          subTitle=""
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
          {dubaiVisa && (
            <>
              <View style={styles.titleView}>
                <Text title3 semibold>
                  Dubai Visa Services
                </Text>
                <Text body2 grayColor></Text>
                {/* <Image source={Images.banner1} style={styles.promotionBanner} /> */}
                <View style={[styles.line, {backgroundColor: colors.border}]} />
              </View>
              <FlatList
                columnWrapperStyle={{paddingLeft: 5, paddingRight: 20}}
                numColumns={2}
                data={dubaiVisa}
                keyExtractor={(item, index) => item.visaId}
                renderItem={({item, index}) => (
                  <HotelItem
                    grid
                    image={item.imageFile}
                    name={item.visaName}
                    price={item.visaPrice + ' AED'}
                    location="Dubai "
                    // available={item.available}
                    // rate={item.rate}
                    // rateStatus={item.rateStatus}
                    // numReviews={item.numReviews}
                    // services={item.services}
                    style={{marginLeft: 15, marginBottom: 15}}
                    // onPress={() => navigation.navigate('HotelDetail' ,{attractionId: item.id})}
                  />
                )}
              />
            </>
          )}
          {abudabiVisa && (
            <>
              <View style={styles.titleView}>
                <Text title3 semibold>
                  Abudabi Visa Services
                </Text>
                <Text body2 grayColor></Text>
                {/* <Image source={Images.banner1} style={styles.promotionBanner} /> */}
                <View style={[styles.line, {backgroundColor: colors.border}]} />
              </View>
              <FlatList
                columnWrapperStyle={{paddingLeft: 5, paddingRight: 20}}
                numColumns={2}
                data={abudabiVisa}
                keyExtractor={(item, index) => item.visaId}
                renderItem={({item, index}) => (
                  <HotelItem
                    grid
                    image={item.imageFile}
                    name={item.visaName}
                    location="Abudabi "
                    price={item.visaPrice + ' AED'}
                    // available={item.available}
                    // rate={item.rate}
                    // rateStatus={item.rateStatus}
                    // numReviews={item.numReviews}
                    // services={item.services}
                    style={{marginLeft: 15, marginBottom: 15}}
                    // onPress={() => navigation.navigate('HotelDetail' ,{attractionId: item.id})}
                  />
                )}
              />
            </>
          )}
        </SafeAreaView>
      </View>
    </>
  );
}
