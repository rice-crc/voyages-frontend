import React from 'react';
import HeaderLogoSearch from '../components/FunctionComponents/Header/HeaderSearchLogo';
import HeaderVoyagesNavBar from '../components/FunctionComponents/Header/HeaderVoyagesNavBar';
import VoyagesScrollPage from '@/components/FunctionComponents/Scrolling/VoyagesScrollPage';
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
    <>
      <HeaderLogoSearch />
      <HeaderVoyagesNavBar />
      <div
        className="voyages-home-page"
        style={{
          backgroundColor: getColorVoyagePageBackground(styleName, currentPage),
        }}
      >
        <VoyagesScrollPage />
      </div>
    </>
  );
};

export default VoyagesPage;
