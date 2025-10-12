import MetaTag from '@/components/MetaTag/MetaTag';
import AboutComponent from '@/components/PresentationComponents/About/AboutComponent';

const AboutPage: React.FC = () => {
  return (
    <div>
      <MetaTag
        pageTitle="About - Slave Voyages"
        pageDescription="Learn about the Slave Voyages project and database."
      />
      <AboutComponent />
    </div>
  );
};
export default AboutPage;
