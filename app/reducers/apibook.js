import * as actionTypes from '@actions/actionTypes';

const initialState = {

    firstSubmit: {
        success: false,
      }
};

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case actionTypes.API_FIRST_SUBMIT:
      return {
        firstSubmit: action.data,
      };
 
    default:
      return state;
  }
};
