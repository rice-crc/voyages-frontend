import { Dispatch } from '@reduxjs/toolkit';

import { resetSlice as resetScrollEnslaved } from './getScrollEnslavedPageSlice';

export const resetBlockNameAndPageName = () => (dispatch: Dispatch) => {
  dispatch(resetScrollEnslaved());
};
