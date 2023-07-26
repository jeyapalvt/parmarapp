import React, {useState} from 'react';
import {View, ScrollView, ImageBackground, FlatList} from 'react-native';
import {useTranslation} from 'react-i18next';
import {BaseStyle, Images, useTheme} from '@config';
import {
  Header,
  SafeAreaView,
  Icon,
  Text,
  Card,
  ProfileDescription,
} from '@components';
import styles from './styles';

export default function AboutUs({navigation}) {
  const {t} = useTranslation();
  const {colors} = useTheme();
  const [ourTeam] = useState([
    {
      id: '1',
      screen: 'Profile1',
      image: Images.profile2,
      subName: 'CEO Founder',
      name: 'Kondo Ieyasu',
      description:
        'In the world of Internet Customer Service, it’s important to remember your competitor is only one mouse click away.',
    },
    {
      id: '2',
      screen: 'Profile2',
      image: Images.profile3,
      subName: 'Sale Manager',
      name: 'Yeray Rosales',
      description:
        'In the world of Internet Customer Service, it’s important to remember your competitor is only one mouse click away.',
    },
    {
      id: '3',
      screen: 'Profile3',
      image: Images.profile5,
      subName: 'Product Manager',
      name: 'Alf Huncoot',
      description:
        'In the world of Internet Customer Service, it’s important to remember your competitor is only one mouse click away.',
    },
    {
      id: '4',
      screen: 'Profile4',
      image: Images.profile4,
      subName: 'Designer UI/UX',
      name: 'Chioke Okonkwo',
      description:
        'In the world of Internet Customer Service, it’s important to remember your competitor is only one mouse click away.',
    },
  ]);

  return (
    <View style={{flex: 1}}>
      <Header
        title={t('about_us')}
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
        <ScrollView style={{flex: 1}}>
          <ImageBackground source={Images.trip4} style={styles.banner}>
            <Text title1 semibold whiteColor>
              {t('about_us')}
            </Text>
            <Text subhead whiteColor>
              {t('sologan_about_us')}
            </Text>
          </ImageBackground>
          <View style={styles.content}>
            <Text headline semibold>
              {t('who_we_are').toUpperCase()}
            </Text>
            <Text body2 style={{marginTop: 5}}>
              Parmar Tourism comprise of professionals in the tourism industry.
              It was a big challenge to establish a company but through hard
              work, dedication and strong determination, we became one of the
              leading tour operators in the UAE. In this rapidly growing
              industry, we aim to utilize the current trend to infiltrate the
              market and intend to provide competitive travel and adventure
              packages to tourists. Our services will be of extremely high
              quality, informative and modified to suit the clients’ needs. Our
              goal is to provide tailor-made packages at a competitive cost in
              the market. We will ensure that guest will have plenty of packages
              to choose from and fits their budget.
            </Text>
            <Text headline semibold style={{marginTop: 20}}>
              {t('what_we_do').toUpperCase()}
            </Text>
            <Text body2 style={{marginTop: 5}}>
              Our services will be extremely high quality, comfortable,
              informative and modified to the clients’ needs. Our goal is to
              make the right information available to the right target
              customers. We will ensure that our prices take into consideration
              peoples' budgets, that these people appreciate the service(s).it
              is important to recognize that we do not intend to just take
              individuals on sightseeing pleasure trip, but also to ensure that
              they appreciate nature through informative briefing on objects'
              origins. Hence we need to connect the right people in the right
              place at the right time if we are to guarantee best possible
              growth. We propose to develop our team so that Our People Can Grow
              As The Company Grows - A Mutually Valuable Relationship.
            </Text>
          </View>
     
 
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
