import { useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { usePageRouter } from '@/hooks/usePageRouter';
import { setIsViewButtonViewAllResetAll } from '@/redux/getShowFilterObjectSlice';
import { AppDispatch, RootState } from '@/redux/store';
import '@/style/homepage.scss';
import {
  TYPESOFDATASET,
  TYPESOFDATASETENSLAVERS,
  TYPESOFDATASETPEOPLE,
} from '@/share/InterfaceTypes';
import { translationHomepage } from '@/utils/functions/translationLanguages';

interface ViewAllButtonProps {
  varName: string;
  clusterNodeKeyVariable?: string;
  clusterNodeValue?: string;
  handleViewAll?: () => void;
}

export const ViewAllButton = (props: ViewAllButtonProps) => {
  const dispatch: AppDispatch = useDispatch();
  const { styleName: styleNameRoute } = usePageRouter();
  const { clusterNodeKeyVariable, clusterNodeValue, handleViewAll } = props;
  const { filtersObj } = useSelector((state: RootState) => state.getFilter);
  const { isView } = useSelector(
    (state: RootState) => state.getShowFilterObject,
  );
  const storedValue = localStorage.getItem('saveSearchID');
  const { languageValue } = useSelector(
    (state: RootState) => state.getLanguages,
  );
  const translatedHomepage = translationHomepage(languageValue);
  useEffect(() => {
    if (storedValue) {
      dispatch(setIsViewButtonViewAllResetAll(false));
    } else if (
      (styleNameRoute === TYPESOFDATASET.allVoyages ||
        styleNameRoute === TYPESOFDATASETPEOPLE.allEnslaved ||
        styleNameRoute === TYPESOFDATASETENSLAVERS.enslaver) &&
      filtersObj.length > 0
    ) {
      dispatch(setIsViewButtonViewAllResetAll(true));
    } else if (filtersObj.length > 1) {
      dispatch(setIsViewButtonViewAllResetAll(true));
    }
  }, [isView]);

  return (
    <>
      {isView || (clusterNodeKeyVariable && clusterNodeValue) ? (
        <button className="btn-navbar-reset-all" onClick={handleViewAll}>
          <i aria-hidden="true" className="fa fa-filter"></i>
          <span>{translatedHomepage.viewAll}</span>
        </button>
      ) : null}
    </>
  );
};
