import MetaTag from '@/components/MetaTag/MetaTag';
import ContributeComponent from '@/components/PresentationComponents/Contribute/Contribute';

const ContributePage: React.FC = () => {
  return (
    <div>
      <MetaTag
        pageTitle="Contribute - Slave Voyages"
        pageDescription="Contribute to the Slave Voyages database."
      />
      <ContributeComponent />;
    </div>
  );
};
export default ContributePage;
