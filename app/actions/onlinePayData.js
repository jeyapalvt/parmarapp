import * as actionTypes from './actionTypes';

const saveOnlineBookData = data => {
  return {
    type: actionTypes.ONLINE_BOOK_DATA,
    data,
  };
};

export const submitsaveOnlineBookData = submitData => dispatch => {
  //call api and dispatch action case

  setTimeout(() => {
    let data = {
      submitData,
    };
    dispatch(saveOnlineBookData(data));
    // if (typeof callback === 'function') {
    //   callback({success: true,  userId: 45,});
    // }
  }, 500);
};
