import React, { useEffect } from 'react';

import AOS from 'aos';

import 'aos/dist/aos.css';
import '@/style/homepage.scss';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import SlaveVoyageLogo from '@/components/NavigationComponents/LogoComponent/SlaveVoyageLogo';
import AutoGlobalSearchBar from '@/components/PresentationComponents/GlobalSearch/AutoGlobalSearchBar';
import GlobalHomeNavigations from '@/components/PresentationComponents/GlobalSearch/GlobalHomeNavigations';
import AfricanOrigins from '@/components/PresentationComponents/LadingPage/AfricanOrigins';
import EnslaversBlogs from '@/components/PresentationComponents/LadingPage/EnslaversBlogs';
import IntraAmerican from '@/components/PresentationComponents/LadingPage/IntraAmerican';
import NewsBlog from '@/components/PresentationComponents/LadingPage/NewsBlog';
import SouthSeaCompanyDocuments from '@/components/PresentationComponents/LadingPage/SouthSeaCompanyDocuments';
import TransAtlantic from '@/components/PresentationComponents/LadingPage/TransAtlantic';
import VideoBackground from '@/components/PresentationComponents/VideoBackground/VideoBackground';
import { FooterComponent } from '@/components/SelectorComponents/ButtonComponents/FooterComponents';
import MenuButtonHomePage from '@/components/SelectorComponents/ButtonComponents/MenuButtonHomePage';
import LanguagesDropdown from '@/components/SelectorComponents/DropDown/LanguagesDropdown';
import { RootState } from '@/redux/store';
import { BLOGPAGE } from '@/share/CONST_DATA';
import { translationHomepage } from '@/utils/functions/translationLanguages';

const HomePage: React.FC = () => {
  const { languageValue } = useSelector(
    (state: RootState) => state.getLanguages,
  );
  const translatedHomepage = translationHomepage(languageValue);
  const handleBackToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };
  useEffect(() => {
    const backToTopButton = document.getElementById('backToTop');

    const handleScroll = () => {
      if (backToTopButton) {
        if (window.scrollY > 100) {
          backToTopButton.style.display = 'block';
        } else {
          backToTopButton.style.display = 'none';
        }
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    AOS.init({ duration: 1800 });
  }, []);
  return (
    <div id="home-voyagepage-container">
      <div className="centered-content">
        <VideoBackground />
        <MenuButtonHomePage />
        <div className="languages-homepage">
          {' '}
          <LanguagesDropdown />
        </div>
        <div className="home-voyagepage-content">
          <div data-aos="flip-up">
            <SlaveVoyageLogo />
          </div>
          <div className="voyages-search-box">
            <div className="voyages-search-box-content">
              <AutoGlobalSearchBar />
            </div>
          </div>
          <div data-aos="fade-up">
            <GlobalHomeNavigations />
          </div>

          <div className="document-resources-container">
            <div className="about-project">
              <Link to={`/${BLOGPAGE}/slavevoyages-introduction/50`}>
                <div className="about-project-btn">
                  {translatedHomepage.aboutProject}
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div data-aos="fade-down">
        <NewsBlog />
      </div>
      <div data-aos="fade-up">
        <SouthSeaCompanyDocuments />
      </div>
      <div data-aos="fade-up">
        <EnslaversBlogs />
      </div>
      <div data-aos="fade-up">
        <AfricanOrigins />
      </div>
      <div data-aos="fade-up">
        <IntraAmerican />
      </div>
      <div data-aos="fade-up">
        <TransAtlantic />
      </div>
      <div className="backToTopBtn">
        <div
          className="btn"
          onClick={handleBackToTop}
          id="backToTop"
          title="Go to top"
        >
          {translatedHomepage.btnBackToTop}
        </div>
      </div>
      <FooterComponent />
    </div>
  );
};

export default HomePage;
