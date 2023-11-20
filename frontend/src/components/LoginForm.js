import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import './LoginForm.css'; // Import your CSS file for styling
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { getData } from '../reduxstore/dataslice';

const LoginForm = () => {
  const history = useNavigate();
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [registrationMessage, setRegistrationMessage] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const dispatch = useDispatch();

  const validateLoginForm = () => {
    let errors = {};

    if (!name.trim()) {
      errors.name = 'Username is required';
    }

    if (!password.trim()) {
      errors.password = 'Password is required';
    } else if (password.length < 6 || !/[A-Z]/.test(password) || !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.password =
        'Password must be at least 6 characters long with one capital letter and one special character';
    }

    setValidationErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const validateSignUpForm = () => {
    // You can add specific validation logic for Sign Up if needed in the future
    // ...

    // For now, return true since we don't have specific validation for Sign Up
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (e.nativeEvent.submitter.name === 'loginButton' && !validateLoginForm()) {
      return;
    }

    // The rest of your existing code for form submission...
    if (validateLoginForm()) {
      try {
        await axios.post('http://localhost:4000/login', {
          name,
          password,
        }).then((res) => {
          if (res.data.message === 'exists') {
            sessionStorage.setItem('id', res.data.id);
            localStorage.setItem('id', res.data.id);
            history('/Home/Dashboard');
          } else if (res.data === "User doesn't exist") {
            setRegistrationMessage("User doesn't exist. Go and sign up.");
          }
        }).catch((e) => {
          setRegistrationMessage('User not registered');
          console.log(e);
        });
      } catch (e) {
        setRegistrationMessage('Failed to send profile details');
        console.log(e);
      }
    }
  };

  useEffect(() => {
    dispatch(getData());
  }, []);

  return (
    <div className="container-form">
      <div className="login-form">
        <div className="form-group-head text-center">
          <h2 className="heading">Login</h2>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="title-label" htmlFor="username">
              <i className="fas fa-user"></i> Username
            </label>
            <input
              onChange={(e) => setName(e.target.value)}
              type="text"
              id="username"
              className={`form-control ${validationErrors.name ? 'is-invalid' : ''}`}
            />
            {validationErrors.name && (
              <div className="invalid-feedback">{validationErrors.name}</div>
            )}
          </div>
          <div className="form-group">
            <label className="title-label" htmlFor="password">
              <i className="fas fa-lock"></i> Password
            </label>
            <input
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              id="password"
              className={`form-control ${validationErrors.password ? 'is-invalid' : ''}`}
            />
            {validationErrors.password && (
              <div className="invalid-feedback">{validationErrors.password}</div>
            )}
          </div>
          <div className="form-check mb-3">
            <input
              className="form-check-input"
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
            />
            <label className="form-check-label" htmlFor="rememberMe">
              Remember Me
            </label>
          </div>

          {registrationMessage && (
            <div className="alert alert-danger" role="alert">
              {registrationMessage}
            </div>
          )}

          <button type="submit" name="loginButton" className="btn btn-primary btn-block">
            Login
          </button>

          <button className="btn btn-primary mt-3">
            <Link className="up-link" to="/Signup">
              Sign Up
            </Link>
          </button>
          <a href="#!" className="forgot-password-link">
            Forgot Password?
          </a>

          <div className="d-flex justify-content-center mt-3">
            <GoogleOAuthProvider clientId="701618945095-bpoau52utpb93q2v4f4a90lio0scsi5o.apps.googleusercontent.com" className="google">
              <GoogleLogin
                onSuccess={async (credentialResponse) => {
                  const details = jwtDecode(credentialResponse.credential);
                  console.log(details);
                  console.log(details.name);
                  await setName(details.name);
                  console.log(name);
                  history('/Home/Dashboard', { state: { id: name } });
                  console.log(credentialResponse);
                }}
                onError={() => {
                  console.log('Login Failed');
                }}
              />
            </GoogleOAuthProvider>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
