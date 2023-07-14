import React from 'react';
import HeaderLogoSearch from '../components/header/HeaderSearchLogo';
import HeaderNavBar from '../components/header/HeaderNavBar';
import ScrollPage from '@/components/Voyages/ScrollPage';
import '@/style/page.scss';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { getColorVoyagePageBackground } from '@/utils/functions/getColorStyle';
import { CurrentPageInitialState } from '@/share/InterfaceTypes';

const VoyagesPage: React.FC = () => {
  const { styleName } = useSelector(
    (state: RootState) => state.getDataSetCollection
  );
  const { currentPage } = useSelector(
    (state: RootState) => state.getScrollPage as CurrentPageInitialState
  );
  return (
    <div
      className="voyages-home-page"
      style={{
        backgroundColor: getColorVoyagePageBackground(styleName, currentPage),
      }}
    >
      <HeaderLogoSearch />
      <HeaderNavBar />
      <ScrollPage />
    </div>
  );
};

export default VoyagesPage;
