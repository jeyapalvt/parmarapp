import * as actionTypes from './actionTypes';

const onLogin = data => {
  return {
    type: actionTypes.LOGIN_API,
    data,
  };
};

export const authenticationapi =
  (
    agencyId,
    success,
    userType,
    userName,
    userEmail,
    userMobile,
    creditLimit,
    currentBalance,
    creditUtilized,
    regStatus,
    callback,
  ) =>
  dispatch => {
    //call api and dispatch action case

    setTimeout(() => {
      let data = {
        agencyId: agencyId,
        success: success,
        userType: userType,
        userName: userName,
        userEmail: userEmail,
        userMobile: userMobile,
        creditLimit: creditLimit,
        currentBalance: currentBalance,
        creditUtilized: creditUtilized,
        regStatus: regStatus,
      };
      dispatch(onLogin(data));
      // if (typeof callback === 'function') {
      //   callback({success: success});
      // }
    }, 500);
  };
