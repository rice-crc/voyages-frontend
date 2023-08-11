import React from 'react';
import MenuButtonHomePage from '@/components/Home/Menu';
import VideoBackground from '../components/Home/VideoBackground';
import HomeListCard from '@/components/Home/HomeSearch';
import '@/style/homepage.scss';
import SlaveVoyageLogo from '@/components/Home/SlaveVoyageLogo';
import AutoGlobalSearchBar from '@/components/Home/AutoGlobalSearchBar';

const HomePage: React.FC = () => {
  return (
    <div id="home-voyagepage-container" style={{ zIndex: 100 }}>
      <VideoBackground />
      <MenuButtonHomePage />
      <div className="home-voyagepage-content">
        <SlaveVoyageLogo />
        <div className="voyages-search-box">
          <div className="voyages-search-box-content">
            <AutoGlobalSearchBar />
          </div>
        </div>

        <HomeListCard />
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
