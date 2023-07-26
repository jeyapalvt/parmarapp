import React, {useState} from 'react';
import {View, ScrollView, KeyboardAvoidingView, Platform} from 'react-native';
import {BaseStyle, useTheme} from '@config';
import {
  Image,
  Header,
  SafeAreaView,
  Icon,
  Text,
  Button,
  TextInput,
} from '@components';
import styles from './styles';
import {UserData} from '@data';
import {useTranslation} from 'react-i18next';
import {useSelector} from 'react-redux';


export default function ProfileEdit({navigation}) {


  const authapi = useSelector(state => state.authapi);
  const {colors} = useTheme();
  const {t} = useTranslation();
  const offsetKeyboard = Platform.select({
    ios: 0,
    android: 20,
  });

  
  const [name, setName] = useState(authapi.userName);
  const [email, setEmail] = useState(authapi.userEmail);
;
  const [loading, setLoading] = useState(false);

  return (
    <View style={{flex: 1}}>
      <Header
        title={t('edit_profile')}
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
        onPressRight={() => {}}
      />
      <SafeAreaView
        style={BaseStyle.safeAreaView}
        edges={['right', 'left', 'bottom']}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'android' ? 'height' : 'padding'}
          keyboardVerticalOffset={offsetKeyboard}
          style={{flex: 1}}>
          <ScrollView contentContainerStyle={styles.contain}>
            <View>
            
            </View>
      
    
            <View style={styles.contentTitle}>
              <Text headline semibold>
                {t('name')}
              </Text>
            </View>
            <TextInput
              onChangeText={text => setName(text)}
              placeholder={t('input_name')}
              value={name}
            />
            <View style={styles.contentTitle}>
              <Text headline semibold>
                {t('email')}
              </Text>
            </View>
            <TextInput
              onChangeText={text => setEmail(text)}
              placeholder={t('input_email')}
              value={email}
            />
   
          </ScrollView>
          <View style={{paddingVertical: 15, paddingHorizontal: 20}}>
            <Button
              loading={loading}
              full
              onPress={() => {
                setLoading(true);
                setTimeout(() => {
                  navigation.goBack();
                }, 500);
              }}>
              {t('confirm')}
            </Button>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
