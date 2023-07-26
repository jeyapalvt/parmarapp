import React from 'react';
import {StyleSheet} from 'react-native';
import {BaseColor} from '@config';

export default StyleSheet.create({
  contain: {
    padding: 20,
  },
  textInput: {
    height: 46,
    backgroundColor: BaseColor.fieldColor,
    borderRadius: 5,
    marginTop: 10,
    padding: 10,
    width: '100%',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  header: {
    textAlign: 'center', // <-- the magic
    fontWeight: 'bold',
    fontSize: 18,
    marginTop: 0,
    width: '100%',
    marginTop: 20,
  },
  msg: {
    color: '#071c55',
    textAlign: 'center', // <-- the magic
    fontWeight: 'bold',
    fontSize: 14,
    marginTop: 10,
    width: '100%',
  },
});
