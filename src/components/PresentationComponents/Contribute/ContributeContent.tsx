import SignInForm from '@/components/PresentationComponents/Contribute/Form/SingInForm';
import SignUpForm from '@/components/PresentationComponents/Contribute/Form/SignUpForm';
import '@/style/contributeContent.scss';
import Guidelines from './Guidelines';
import PasswordReset from '@/components/PresentationComponents/Contribute/Form/PasswordRestForm';
import { Link } from 'react-router-dom';
import { useNavigation } from '@/hooks/useNavigation';
import { usePageRouter } from '@/hooks/usePageRouter';
import TermsAndConditions from './Form/TermsAndConditions';
import SignOut from './Form/SignOut';
import ContributeHomeWelcome from './ContributeHomeWelcome';
import PasswordChangeForm from '@/components/PresentationComponents/Contribute/Form/PasswordChangeForm';
import EditExistingVoyage from '@/components/PresentationComponents/Contribute/Form/EditExistingVoyage';
import MergeVoyages from '@/components/PresentationComponents/Contribute/Form/MergeVoyages';
import RecommendVoyageDeletion from '@/components/PresentationComponents/Contribute/Form/RecommendVoyageDeletion';
import NewVoyage from '@/components/PresentationComponents/Contribute/Form/NewVoyage';
import { translationLanguagesContribute } from '@/utils/functions/translationLanguages';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

const ContributeContent: React.FC = () => {
  const { handleClickGuidelines, handleResetPasswordClick } = useNavigation();
  const { contributePath, endpointPath } = usePageRouter();
  const { languageValue } = useSelector(
    (state: RootState) => state.getLanguages
  );
  const translatedContribute = translationLanguagesContribute(languageValue);

  let displayContent;

  if (contributePath === 'signin') {
    displayContent = (
      <div className="contribute-content">
        <h1 className="page-title-1">{translatedContribute.contribute}</h1>
        <p>{translatedContribute.contributeText1}</p>
        <p>{translatedContribute.contributeText2}</p>
        <p>
          {translatedContribute.contributeText3}{' '}
          <Link to="#">{translatedContribute.contributeText3Link1}</Link>{' '}{translatedContribute.contributeText4}{' '}
          <a onClick={handleClickGuidelines} style={{ cursor: 'pointer' }}>
            {translatedContribute.contributeText3Link2}
          </a>
        </p>
        <p>{translatedContribute.contributeText5}</p>
        <SignInForm />
      </div>
    );
  } else if (contributePath === 'signup') {
    displayContent = (
      <div className="contribute-content">
        <SignUpForm />
      </div>
    );
  } else if (contributePath === 'guidelines') {
    displayContent = <Guidelines />;
  } else if (contributePath === 'password') {
    displayContent = (
      <PasswordReset handleResetPassword={handleResetPasswordClick} />
    );
  } else if (contributePath === 'legal') {
    displayContent = <TermsAndConditions />;
  } else if (contributePath === 'logout') {
    displayContent = <SignOut />;
  } else if (contributePath === 'password_change') {
    displayContent = <PasswordChangeForm />;
  } else if (contributePath === 'interim') {
    displayContent = <NewVoyage />;
  } else if (contributePath === 'edit_voyage') {
    displayContent = <EditExistingVoyage />;
  } else if (contributePath === 'merge_voyages') {
    displayContent = <MergeVoyages />;
  } else if (contributePath === 'delete_voyage') {
    displayContent = <RecommendVoyageDeletion />;
  } else if (endpointPath === 'contribute') {
    displayContent = <ContributeHomeWelcome />;
  }
  return displayContent;
};

export default ContributeContent;
