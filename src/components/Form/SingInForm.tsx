// SignInForm.tsx
import React, { useState } from 'react';
import '@/style/contributeContent.scss';


// Define types for form values
interface SignInFormProps {
    nextPath?: string; 
    handleSignUpClick: () => void
  }
  const SignInForm: React.FC<SignInFormProps> = ({ nextPath = '/contribute/legal',handleSignUpClick }) => {
    const [formValues, setFormValues] = useState({
        email: '',
        password: '',
        remember: false,
      });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const { name, value, type, checked } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value, // Handle checkbox and text inputs
    }));
  };

  const handleFormSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    // Simulate form submission
    console.log('Form submitted:', formValues);
  };

  const handleGoogleSignIn = () => {
    // Simulate Google Sign-In
    alert('Signing in with Google...');
  };

  return (
    <div className="contribute-sign-in-form" id="sign-in">
      <h2>Sign in</h2>
      <div className='form-inorder'>In order to access the Contribute section, please sign in.</div>
      <div className='sign-in-form-submit'>
      <form
      method="post"
      action="/accounts/login/"
      onSubmit={handleFormSubmit}
      className="sign-in-form"
    >
      {/* CSRF Token */}
      <input
        type="hidden"
        name="csrfmiddlewaretoken"
        value="0vije7yXjc0TqC3CqWZ4qHPfMiCd2MSbCdZgAlJHuwnmaeKIz9Ix8iDzfdQ7Ugvn"
      />

      <table>
        <tbody>
          {/* Email Field */}
          <tr>
            <th>
              <label htmlFor="id_email">E-mail:</label>
            </th>
            <td>
              <input
                type="email"
                name="email"
                id="id_email"
                placeholder="E-mail address"
                value={formValues.email}
                onChange={handleInputChange}
                required
                autoFocus
              />
            </td>
          </tr>

          {/* Password Field */}
          <tr>
            <th>
              <label htmlFor="id_password">Password:</label>
            </th>
            <td>
              <input
                type="password"
                name="password"
                id="id_password"
                placeholder="Password"
                value={formValues.password}
                onChange={handleInputChange}
                required
              />
            </td>
          </tr>

          {/* Remember Me Checkbox */}
          <tr>
            <th>
              <label htmlFor="id_remember">Remember Me:</label>
            </th>
            <td>
              <input
                className='checkbox'
                type="checkbox"
                name="remember"
                id="id_remember"
                checked={formValues.remember}
                onChange={handleInputChange}
              />
            </td>
          </tr>
        </tbody>
      </table>
      <input type="hidden" name="next" value={nextPath} />

      <button type="submit" className="local_account_login_btn">
        Sign in
      </button>
    </form>
      <button onClick={handleGoogleSignIn}>
      <img src="https://www.slavevoyages.org/static/images/site/google_logo.png" width="16px" height="16px"/>
        Sign in with Google</button>
      <p>
        If you don't have an account, <span className="create-account" onClick={handleSignUpClick}>Create an Account</span>.
      </p>
      <p>
        Forgot your password? <a href="#retrieve-password">Retrieve Password</a>.
      </p>
      </div>
    </div>
  );
};

export default SignInForm;
