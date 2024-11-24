import SignInForm from "@/components/Form/SingInForm";
import SignUpForm from "@/components/Form/SignUpForm";
import "@/style/contributeContent.scss";
import Guidelines from "./Guidelines";
interface ContributeContentProps {
  handleSignUpClick: () => void
  viewContent:string
}

const ContributeContent: React.FC<ContributeContentProps> = ({handleSignUpClick, viewContent}) => {

  let displayContent;
  if(viewContent === 'signin'){
    displayContent = 
    <div className="contribute-content">
      <h1 className="page-title-1">Contribute</h1>
      <p>
        The Contribute section allows users of the Voyages website to supply
        and/or revise existing information in the Voyages Database...
      </p>
      <p>
        For purposes of managing contributions to the website, contributors are
        asked to register for an account and provide an email address for
        communication.
      </p>
      <SignInForm handleSignUpClick={handleSignUpClick}/> 
    </div>
    
  }else if(viewContent === 'signup'){
    displayContent =  
    <div className="contribute-content">
    <SignUpForm/>
    </div>
  }else if(viewContent === 'guidelines'){
    displayContent =  <Guidelines/>
    
  }

  return displayContent
  
};

export default ContributeContent;
