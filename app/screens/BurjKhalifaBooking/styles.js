import React from 'react';
import {StyleSheet} from 'react-native';
import {BaseColor} from '@config';

export default StyleSheet.create({
  textInput: {
    height: 46,
    backgroundColor: BaseColor.fieldColor,
    borderRadius: 5,
    marginTop: 10,
    padding: 10,
    width: '100%',
  },
  contain: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    flex: 1,
  },
  gridSystem:{
    marginTop: 10,
    marginRight:15,
    paddingLeft:15,
    flexDirection: "row",
    
  },
  rowleft:{

  },
  rowright:{

  }
});
