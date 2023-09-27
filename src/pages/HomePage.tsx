import React from 'react';
import '@/style/homepage.scss';
import VideoBackground from '@/components/PresentationComponents/VideoBackground/VideoBackground';
import MenuButtonHomePage from '@/components/SelectorComponents/ButtonComponents/MenuButtonHomePage';
import SlaveVoyageLogo from '@/components/NavigationComponents/LogoComponent/SlaveVoyageLogo';
import AutoGlobalSearchBar from '@/components/PresentationComponents/GlobalSearch/AutoGlobalSearchBar';
import GlobalHomeNavigations from '@/components/PresentationComponents/GlobalSearch/GlobalHomeNavigations';
const HomePage: React.FC = () => {
  return (
    <div id="home-voyagepage-container" style={{ zIndex: 100 }}>
      <div className="home-voyagepage-content">
        <VideoBackground />
        <MenuButtonHomePage />
        <SlaveVoyageLogo />
        <div className="voyages-search-box">
          <div className="voyages-search-box-content">
            <AutoGlobalSearchBar />
          </div>
        </div>
        <GlobalHomeNavigations />
        <div className="document-resources-container">
          <div className="about-project">
            <div className="about-project-btn">About the Project</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
