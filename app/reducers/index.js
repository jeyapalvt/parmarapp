import {combineReducers} from 'redux';
import AuthReducer from './auth';
import ApplicationReducer from './application';
import AuthapiReducer from './authapi';
import ApiBook from './apibook';
import ApiServerRes from './apiserverReducer';
import dataForOnlinePay from './bookDataonlinepay';
export default combineReducers({
  auth: AuthReducer,
  application: ApplicationReducer,
  authapi: AuthapiReducer,
  apibook: ApiBook,
  apiserverres: ApiServerRes,
  dataforonlinepay: dataForOnlinePay,
});
