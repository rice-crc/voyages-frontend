// SignInForm.tsx
import React, { useState } from 'react';
import '@/style/contributeContent.scss';
import { useDispatch } from 'react-redux';
import { login } from '@/redux/getAuthUserSlice';
import { useNavigate } from 'react-router-dom';
import { useNavigation } from '@/hooks/useNavigation';

// Define types for form values
interface SignInFormProps {
  nextPath?: string;
}
const SignInForm: React.FC<SignInFormProps> = ({ nextPath = '/contribute/legal' }) => {

  const {
    handleSignUpClick,
    handleResetPasswordClick,
  } = useNavigation();

  const [formValues, setFormValues] = useState({
    email: 'meow@test.com',
    // password: '0vije7yXjc0TqC3CqWZ4qHPfMiCd2MSbCdZgAlJHuwnmaeKIz9Ix8iDzfdQ7Ugvn',
    password: '$12345',
    remember: false,
  });
  const mockUser = {
    email: 'meow@test.com',
    userName: 'Merry',
    token: '$12345',
  };



  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const { name, value, type, checked } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleFormSubmit = (e: React.FormEvent): void => {
    e.preventDefault();

    if (formValues.email === mockUser.email && formValues.password === mockUser.token) {
      dispatch(login({ email: mockUser.email, userName: mockUser.userName, token: mockUser.token }));
      navigate(nextPath)
    } else {
      alert('Invalid email or password');
    }
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
          <img src="https://www.slavevoyages.org/static/images/site/google_logo.png" width="16px" height="16px" />
          Sign in with Google</button>
        <span>
          <span>
            If you don't have an account, <span className="create-account" onClick={handleSignUpClick}>Create an Account</span>.
          </span>
          <span>
            If you have forgotten your password, <span className="create-account" onClick={handleResetPasswordClick}>Retrieve Password</span>.
          </span>
        </span>

      </div>
    </div>
  );
};

export default SignInForm;
