import React, { useState } from 'react';

import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Checkbox,
  FormControlLabel,
  Paper,
  Link,
  Alert,
} from '@mui/material';

interface FormData {
  email: string;
  firstName: string;
  lastName: string;
  institution: string;
  description: string;
  captcha: string;
  password: string;
  passwordConfirm: string;
  agreeToTerms: boolean;
}

// Define a separate interface for error messages
interface FormErrors {
  email?: string;
  firstName?: string;
  lastName?: string;
  institution?: string;
  description?: string;
  captcha?: string;
  password?: string;
  passwordConfirm?: string;
  agreeToTerms?: string;
}
interface SignUpFormProps {
  nextPath?: string;
}

const SignUpForm: React.FC<SignUpFormProps> = () => {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    firstName: '',
    lastName: '',
    institution: '',
    description: '',
    captcha: '',
    password: '',
    passwordConfirm: '',
    agreeToTerms: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Valid email is required';
    }
    if (!formData.firstName) {
      newErrors.firstName = 'First name is required';
    }
    if (!formData.lastName) {
      newErrors.lastName = 'Last name is required';
    }
    if (!formData.institution) {
      newErrors.institution = 'Institution is required';
    }
    if (!formData.description) {
      newErrors.description = 'Description is required';
    }
    if (!formData.captcha) {
      newErrors.captcha = 'Captcha is required';
    }
    if (!formData.password || formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    if (formData.password !== formData.passwordConfirm) {
      newErrors.passwordConfirm = 'Passwords do not match';
    }
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      console.log('Form submitted:', formData);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  return (
    <div className="contribute-sign-in-form" id="sign-in">
      <h1 className="page-title-1"> Sign-up</h1>
      <Typography sx={{ mb: 3 }}>
        Already have an account? Then please{' '}
        <Link href="/accounts/signin" underline="hover">
          sign in
        </Link>
      </Typography>
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography
            className="label-signup"
            sx={{ width: 150 }}
            component="label"
            htmlFor="email"
          >
            E-mail:
          </Typography>
          <TextField
            required
            id="email"
            name="email"
            autoComplete="email"
            value={formData.email}
            onChange={handleInputChange}
            error={!!errors.email}
            helperText={errors.email}
          />
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography
            className="label-signup"
            sx={{ width: 150 }}
            component="label"
            htmlFor="email"
          >
            First name:
          </Typography>
          <TextField
            margin="normal"
            required
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            error={!!errors.firstName}
            helperText={errors.firstName}
          />
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography
            sx={{ width: 150 }}
            component="label"
            htmlFor="email"
            className="label-signup"
          >
            Last name:
          </Typography>
          <TextField
            margin="normal"
            required
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            error={!!errors.lastName}
            helperText={errors.lastName}
          />
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography
            sx={{ width: 150 }}
            component="label"
            htmlFor="email"
            className="label-signup"
          >
            Institution:
          </Typography>

          <TextField
            margin="normal"
            required
            id="institution"
            name="institution"
            value={formData.institution}
            onChange={handleInputChange}
            error={!!errors.institution}
            helperText={errors.institution}
          />
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography
            sx={{ width: 150 }}
            component="label"
            htmlFor="email"
            className="label-signup"
          >
            Brief description of new material and sources:
          </Typography>

          <TextField
            margin="normal"
            required
            id="description"
            name="description"
            rows={1}
            value={formData.description}
            onChange={handleInputChange}
            error={!!errors.description}
            helperText={errors.description}
          />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography
            sx={{ width: 150 }}
            component="label"
            htmlFor="email"
            className="label-signup"
          >
            Captcha:
          </Typography>

          <img
            // src will need backend generate code
            src="https://www.slavevoyages.org/captcha/image/e0b62a73d783d2c899785d6115778d872cbd5d52/"
            alt="Captcha"
            style={{
              backgroundColor: '#f0f0f0',
              borderRadius: 4,
            }}
          />
          <TextField
            required
            id="captcha"
            name="captcha"
            size="small"
            value={formData.captcha}
            onChange={handleInputChange}
            error={!!errors.captcha}
            helperText={errors.captcha}
            sx={{ width: 150 }}
          />
        </Box>

        <Box sx={{ mt: 2, mb: 1, bgcolor: '#f5f5f5', p: 2, borderRadius: 1 }}>
          <Typography gutterBottom className="label-signup">
            Terms and Conditions:
          </Typography>
          <Paper
            variant="outlined"
            sx={{
              p: 2,
              maxHeight: 100,
              overflow: 'auto',
              bgcolor: 'background.paper',
              mb: 1,
            }}
          >
            <Typography>
              I warrant that I have the right to contribute the following data
              to the Voyages Database and its inclusion in the Voyages Database
              will not infringe anyone's intellectual property rights. I also
              agree that this data will become part of the Voyages: The
              Trans-Atlantic Slave Trade Database website and will be governed
              by any applicable licenses.
            </Typography>
          </Paper>
          <FormControlLabel
            control={
              <Checkbox
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleInputChange}
              />
            }
            label={
              <span className="label-signup">
                Agree to the terms and conditions above
              </span>
            }
          />
          {errors.agreeToTerms && (
            <Alert severity="error" sx={{ mt: 1 }}>
              {errors.agreeToTerms}
            </Alert>
          )}
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography
            sx={{ width: 150 }}
            component="label"
            htmlFor="email"
            className="label-signup"
          >
            Password:
          </Typography>

          <TextField
            margin="normal"
            required
            name="password"
            type="password"
            id="password"
            autoComplete="new-password"
            value={formData.password}
            onChange={handleInputChange}
            error={!!errors.password}
            helperText={errors.password}
          />
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography
            sx={{ width: 150 }}
            component="label"
            htmlFor="email"
            className="label-signup"
          >
            Password (again):
          </Typography>

          <TextField
            margin="normal"
            required
            name="passwordConfirm"
            type="password"
            id="passwordConfirm"
            autoComplete="new-password"
            value={formData.passwordConfirm}
            onChange={handleInputChange}
            error={!!errors.passwordConfirm}
            helperText={errors.passwordConfirm}
          />
        </Box>
        <button type="submit">Sign-up</button>
      </Box>
    </div>
  );
};

export default SignUpForm;
