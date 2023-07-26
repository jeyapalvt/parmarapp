import * as actionTypes from '@actions/actionTypes';

const initialState = {
  agencyId: 0,
  success: false,
  userType: 0,
  userName: '',
  userEmail: '',
  userMobile: '',
  creditLimit: '',
  currentBalance: '',
  creditUtilized: '',
  regStatus: '',
};

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case actionTypes.LOGIN_API:
      return {
        ...state,
        agencyId: action.data.agencyId,
        success: action.data.success,
        userType: action.data.userType,
        userName: action.data.userName,
        userEmail: action.data.userEmail,
        userMobile: action.data.userMobile,
        creditLimit: action.data.creditLimit,
        currentBalance: action.data.currentBalance,
        creditUtilized: action.data.creditUtilized,
        regStatus: action.data.regStatus,
      };

    default:
      return state;
  }
};
