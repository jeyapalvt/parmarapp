import * as actionTypes from './actionTypes';

const saveFirstState = data => {
  return {
    type: actionTypes.API_FIRST_SUBMIT,
    data,
  };
};

export const submitFirstStateApiTicket = (submitData) => dispatch => {
  //call api and dispatch action case

  setTimeout(() => {
    let data = {
        submitData
    };
    dispatch(saveFirstState(data));
    // if (typeof callback === 'function') {
    //   callback({success: true,  userId: 45,});
    // }
  }, 500);
};
