import SignInForm from "@/components/Form/SingInForm";
import SignUpForm from "@/components/Form/SignUpForm";
import "@/style/contributeContent.scss";
import Guidelines from "./Guidelines";
import PasswordReset from "@/components/Form/PasswordRestForm";
import { Link } from "react-router-dom";
import { useNavigation } from "@/hooks/useNavigation";
import { usePageRouter } from "@/hooks/usePageRouter";
import TermsAndConditions from "./TermsAndConditions";
import SignOut from "./SignOut";
import ContributeHomeWelcome from "./ContributeHomeWelcome";

const ContributeContent: React.FC = () => {
  const {
    handleClickGuidelines,
    handleResetPasswordClick,
  } = useNavigation();
  const { contributePath, endpointPath } = usePageRouter()
  console.log({ endpointPath })

  let displayContent;

  if (contributePath === 'signin') {
    displayContent =
      <div className="contribute-content">
        <h1 className='page-title-1'>Contribute</h1>
        <p>
          The Contribute section allows users of the Voyages website to supply and/or revise existing information in the Voyages Database. A team of slave trade scholars will review each contribution as part of the peer-review process. New and/or revised information will be incorporated in the subsequent updates to the Voyages Database.
        </p>
        <p>
          The Contribute feature facilitates collaborative research and information sharing among the global network of scholars working to continuously improve the store of knowledge about the slave trade. These scholars are increasingly working across diverse forms of media, from written documents to collections of machine-readable data. The Voyages Database is itself the product of extensive revisions since the publication of the CD-ROM version in 1999. The Contribute section allows the database to continue evolving in a way that respects the high standards of scholarship governing the construction of the original database.
        </p>
        <p>
          Step-by-step instructions on how to use the Contribute forms are provided in the Voyages Guide, a PDF file accessible in <Link to="#" >"Understanding the Database"</Link>. For further advice on contributing new data, we ask you to read our <a onClick={handleClickGuidelines} style={{ cursor: 'pointer' }}>"Guidelines for Contributors."</a>
        </p>
        <p>
          For purposes of managing contributions to the website, contributors are asked to register for an account and provide an email address for communication.
        </p>
        <SignInForm />
      </div>

  } else if (contributePath === 'signup') {
    displayContent =
      <div className="contribute-content">
        <SignUpForm />
      </div>
  } else if (contributePath === 'guidelines') {
    displayContent = <Guidelines />
  } else if (contributePath === 'password') {
    displayContent = <PasswordReset handleResetPassword={handleResetPasswordClick} />
  } else if (contributePath === 'legal') {
    displayContent = <TermsAndConditions />
  } else if (contributePath === 'logout') {
    displayContent = <SignOut />
  } else if (endpointPath === 'contribute') {
    displayContent = <ContributeHomeWelcome />
  }

  return displayContent

};

export default ContributeContent;
