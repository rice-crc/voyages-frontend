import MetaTag from '@/components/MetaTag/MetaTag';
import DownloadComponent from '@/components/PresentationComponents/Download.tsx/DownloadComponent';

const DownloadPage: React.FC = () => {
  return (
    <div>
      <MetaTag
        pageTitle="Downloads - Slave Voyages"
        pageDescription="Download data and resources from the Slave Voyages database."
      />
      <DownloadComponent />;
    </div>
  );
};
export default DownloadPage;
