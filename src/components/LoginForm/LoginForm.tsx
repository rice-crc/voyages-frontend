// SignInForm.tsx
import React, { useState } from 'react';
import '@/style/contributeContent.scss';


// Define types for form values
interface FormValues {
  email: string;
  password: string;
}

const SignInForm: React.FC = () => {
  const [formValues, setFormValues] = useState<FormValues>({
    email: '',
    password: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSignIn = (e: React.FormEvent): void => {
    e.preventDefault();
    alert(`Email: ${formValues.email}, Password: ${formValues.password}`);
  };

  const handleGoogleSignIn = (): void => {
    alert('Signing in with Google...');
  };

  return (
    <div className="contribute-sign-in-form" id="sign-in">
      <h2>Sign in</h2>
      <div className='form-inorder'>In order to access the Contribute section, please sign in.</div>
      <div>
      <form onSubmit={handleSignIn}>
        <label>
          E-mail:
          <input
            type="email"
            name="email"
            value={formValues.email}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          Password:
          <input
            type="password"
            name="password"
            value={formValues.password}
            onChange={handleInputChange}
            required
          />
        </label>
        <div>
          <button type="submit">Sign in</button>
        </div>
      </form>
      <button onClick={handleGoogleSignIn}>Sign in with Google</button>
      <p>
        If you don't have an account, <a href="#create-account">Create an Account</a>.
      </p>
      <p>
        Forgot your password? <a href="#retrieve-password">Retrieve Password</a>.
      </p>
      </div>
      
    </div>
  );
};

export default SignInForm;
