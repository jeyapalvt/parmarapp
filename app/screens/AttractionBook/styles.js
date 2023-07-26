import {StyleSheet} from 'react-native';
import {BaseColor} from '@config';

export default StyleSheet.create({
  inputItem: {
    flex: 6.5,
    paddingLeft: 10,
  },
  container: {
    flex: 1,
    justifyContent: "center"
  },
  horizontal: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10
  },
  slotButton:{
    marginTop: 10,
    marginRight:5,
    flex: 1,
    justifyContent: "center",
   
  },
  horizontal1: {
    flexDirection: "row",
    justifyContent: 'flex-start',
    padding: 10
  },
});
