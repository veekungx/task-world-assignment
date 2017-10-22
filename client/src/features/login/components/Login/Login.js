import React from 'react';
import axios from 'axios';
import { bool, any, func } from 'prop-types';
import { reduxForm, Field, SubmissionError } from 'redux-form';
import './Login.scss';

const Login =
  ({
    // HOC redux-form props
    submitting,
    error,
    // HOC redux-form event
    handleSubmit,
  }) =>
    (
      <form
        onSubmit={handleSubmit}
        className="Login"
      >
        <div className="Login__title">LOGIN</div>
        <Field
          name="email"
          component="input"
          className="Login__emailField"
        />
        <Field
          name="password"
          component="input"
          type="password"
          className="Login__passwordField"
        />
        <button
          className="Login__loginButton"
          type="submit"
          disabled={submitting}
        >
          {submitting
            ? 'LOGGING IN'
            : 'LOGIN'
          }
        </button>
        {error &&
          <div className="Login__error">Login failed, please try again</div>
        }
      </form>
    );

Login.propTypes = {
  submitting: bool,
  error: any,
  handleSubmit: func,
};
Login.defaultProps = {
  submitting: false,
  error: undefined,
  handleSubmit: undefined,
};

export default Login;

export const LoginForm = reduxForm({
  form: 'login',
  onSubmit: (values) => {
    const { email, password } = values;
    return axios.post('http://localhost:4000/users/login', { email, password })
      .catch(() => {
        throw new SubmissionError({ _error: 'login fail' });
      });
  },
  onSubmitSuccess: (result, dispatch, props) => {
    console.log(result);
    props.history.push('/preference');
  },
  onSubmitFail: () => {

  },
})(Login);
