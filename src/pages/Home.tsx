import React from 'react';
import HomePage from '@/components/Home/HomePage';
import '@/style/homepage.scss';
const Home: React.FC = () => {
  return (
    <div id="home-voyagepage-container" style={{ zIndex: 100 }}>
      <div className="home-voyagepage-content">
        <HomePage />
        <div className="document-resources-container">
          <div className="about-project">
            <div className="about-project-btn">About the Project</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
