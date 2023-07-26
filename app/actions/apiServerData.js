import * as actionTypes from './actionTypes';

const saveApiServerRes = data => {
  return {
    type: actionTypes.API_SERVER_RESPONCE,
    data,
  };
};

export const submitApiServerRes = (responceData) => dispatch => {
  //call api and dispatch action case

  setTimeout(() => {
    let data = {
        responceData
    };
    dispatch(saveApiServerRes(data));
    // if (typeof callback === 'function') {
    //   callback({success: true,  userId: 45,});
    // }
  }, 500);
};
