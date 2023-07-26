import * as actionTypes from '@actions/actionTypes';

const initialState = {
  bookdataOnline: '',
};

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case actionTypes.ONLINE_BOOK_DATA:
      return {
        bookdataOnline: action.data,
      };

    default:
      return state;
  }
};
