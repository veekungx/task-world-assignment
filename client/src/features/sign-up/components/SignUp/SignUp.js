import React from 'react';
import axios from 'axios';
import { bool, func, any } from 'prop-types';
import { reduxForm, Field, SubmissionError } from 'redux-form';
import './SignUp.scss';

const SignUp =
  ({
    // HOC reduxForm props
    submitting,
    error,
    // HOC reduxForm events
    handleSubmit,
  }) =>
    (
      <form
        className="SignUp"
        onSubmit={handleSubmit}
      >
        <div className="SignUp__title">SIGN UP</div>
        <Field
          name="email"
          component="input"
          className="SignUp__emailField"
        />
        <Field
          name="password"
          component="input"
          type="password"
          className="SignUp__passwordField"
        />
        <button
          type="submit"
          className="SignUp__signupButton"
          disabled={submitting}
        >
          SIGN UP
          {submitting &&
            <div className="SignUp__submitting">Summitting...</div>
          }
        </button>
        {error &&
          <div className="SignUp__error">FAIL, Please try again</div>
        }
      </form>
    );

SignUp.propTypes = {
  submitting: bool,
  error: any,
  handleSubmit: func,
};
SignUp.defaultProps = {
  submitting: false,
  error: undefined,
  handleSubmit: undefined,
};

export default SignUp;

const submit = (values, dispatch, props) => {
  const { email, password } = values;
  return axios.post('http://localhost:4000/users', { email, password })
    .then(() => {
      props.history.push('/');
    })
    .catch(() => {
      throw new SubmissionError({ _error: true });
    });
};


export const SignUpForm = reduxForm({
  form: 'signup',
  onSubmitFail: () => {

  },
  onSubmitSuccess: (result, dispatch, props) => {
    props.history.push('/preference');
  },
  onSubmit: submit,
})(SignUp);
