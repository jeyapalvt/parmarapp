// Import React Component
import React, {useState, useEffect} from 'react';

// Import React native Components
import {
  View,
  Linking,
  Image,
  StyleSheet,
  Platform,
  TouchableOpacity,
  PermissionsAndroid,
} from 'react-native';
import {Header, SafeAreaView, Icon, Text, Button, TextInput} from '@components';
import {BaseStyle, useTheme} from '@config';
// Import RNFetchBlob for the file download
// import RNFetchBlob from 'rn-fetch-blob';
import styles from './styles';

const TicketViewer = ({navigation, route}) => {
  const {tktPath} = route.params;

  const {colors} = useTheme();
  const [loading, setLoading] = useState(false);
  const [screenMsg, setscreenMsg] = useState(
    'Your Ticket Has Been Booked Sucessfully, Press Download Button To Downlaod Ticket',
  );

  const downloadPdf = () => {
    Linking.openURL(tktPath);
    navigation.navigate('Main');
  };

  return (
    <View style={{flex: 1}}>
      <Header
        title="Ticket"
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
          navigation.navigate('Home');
        }}
      />
      <SafeAreaView
        style={BaseStyle.safeAreaView}
        edges={['right', 'left', 'bottom']}>
        <View style={styles.contain}>
          <Text headline semibold style={{marginTop: 20}}>
            {screenMsg}
          </Text>
          <Button
            style={{marginTop: 20}}
            full
            loading={loading}
            onPress={() => {
              downloadPdf();
            }}>
            Save Ticket
          </Button>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default TicketViewer;
