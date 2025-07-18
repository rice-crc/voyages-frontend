import { useSelector } from 'react-redux';

import { RootState } from '@/redux/store';
import { FilterObjectsState } from '@/share/InterfaceTypes';

import { usePageRouter } from './usePageRouter';

export const useFilterState = () => {
  const { styleName } = useSelector(
    (state: RootState) => state.getDataSetCollection,
  );
  const { varName } = useSelector(
    (state: RootState) => state.rangeSlider as FilterObjectsState,
  );
  const { labelVarName } = useSelector(
    (state: RootState) => state.getShowFilterObject,
  );
  const { filtersObj } = useSelector((state: RootState) => state.getFilter);
  const { styleName: styleNameRoute } = usePageRouter();

  return { styleName, varName, labelVarName, filtersObj, styleNameRoute };
};
