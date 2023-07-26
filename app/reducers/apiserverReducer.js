import * as actionTypes from '@actions/actionTypes';

const initialState = {

    apiServerRes: {
        success: false,
      }
};

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case actionTypes.API_SERVER_RESPONCE:
      return {
        apiServerRes: action.data,
      };
 
    default:
      return state;
  }
};
