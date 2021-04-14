import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";

import Input from "../../components/UI/Input/Input";
import Button from "../../components/UI/Button/Button";
import Spinner from "../../components/UI/Spinner/Spinner";
import classes from "./Auth.css";
import * as actions from "../../store/actions/index";
import { updateObject, checkValidity } from "../../shared/utility";

const auth = (props) => {
  const [authForm, setAuthForm] = useState({
    email: {
      elementType: "input",
      elementConfig: {
        type: "email",
        placeholder: "Mail address",
      },
      value: "",
      validation: {
        required: true,
        isEmail: true,
      },
      valid: false,
      touched: false,
    },
    password: {
      elementType: "input",
      elementConfig: {
        type: "password",
        placeholder: "Password",
      },
      value: "",
      validation: {
        required: true,
        minLength: 6,
      },
      valid: false,
      touched: false,
    },
  });
  const [isSignup, setIsSignup] = useState(true);

  const dispatch = useDispatch();
  const onAuth = (email, password, isSignup) =>
    dispatch(actions.auth(email, password, isSignup));
  const onSetAuthRedirectPath = () =>
    dispatch(actions.setAuthRedirectPath("/"));

  const loading = useSelector((state) => {
    return state.auth.loading;
  });

  const error = useSelector((state) => {
    return state.auth.error;
  });

  const isAuthenticated = useSelector((state) => {
    return state.auth.token !== null;
  });

  const buildingBurger = useSelector((state) => {
    return state.burgerBuilder.building;
  });

  const authRedirectPath = useSelector((state) => {
    return state.auth.authRedirectPath;
  });

  useEffect(() => {
    if (!buildingBurger && authRedirectPath !== "/") {
      onSetAuthRedirectPath();
    }
  }, [buildingBurger, authRedirectPath, onSetAuthRedirectPath]);

  const inputChangedHandler = (event, controlName) => {
    const updatedControls = updateObject(authForm, {
      [controlName]: updateObject(authForm[controlName], {
        value: event.target.value,
        valid: checkValidity(
          event.target.value,
          authForm[controlName].validation
        ),
        touched: true,
      }),
    });

    setAuthForm(updatedControls);
  };

  const submitHandler = (event) => {
    event.preventDefault();
    onAuth(authForm.email.value, authForm.password.value, isSignup);
  };

  const switchAuthModeHandler = () => {
    setIsSignup(!isSignup);
  };

  const parseErrorCode = (error) => {
    switch (error) {
      case "EMAIL_EXISTS":
        return generateErrorDiv("The email already exists.");
      case "OPERATION_NOT_ALLOWED":
        return generateErrorDiv("This authentication method is not available.");
      case "TOO_MANY_ATTEMPTS_TRY_LATER":
        return generateErrorDiv(
          "Requests from this device have been blocked due to unusual activity. Try it again later."
        );
      case "MISSING_EMAIL":
        return generateErrorDiv("You must specify an email.");
      case "EMAIL_NOT_FOUND":
        return generateErrorDiv("The email do not exists.");
      case "INVALID_EMAIL":
        return generateErrorDiv("The email is invalid.");
      case "INVALID_PASSWORD":
        return generateErrorDiv("The password is invalid.");
      case "MISSING_PASSWORD":
        return generateErrorDiv("You must specify a password.");
      case "WEAK_PASSWORD : Password should be at least 6 characters":
        return generateErrorDiv("Password should be at least 6 characters.");
      case "USER_DISABLED":
        return generateErrorDiv(
          "The user account has been disabled by an administrator."
        );
      default:
        return generateErrorDiv("Could not perform the operation.");
    }
  };

  const generateErrorDiv = (text) => {
    return (
      <div className={classes.Alert + " " + classes.AlertDanger}>
        <p>{text}</p>
      </div>
    );
  };

  const formElementsArray = [];

  for (let key in authForm) {
    formElementsArray.push({
      id: key,
      config: authForm[key],
    });
  }

  let form = formElementsArray.map((formElement) => (
    <Input
      key={formElement.id}
      elementType={formElement.config.elementType}
      elementConfig={formElement.config.elementConfig}
      value={formElement.config.value}
      invalid={!formElement.config.valid}
      shouldValidate={formElement.config.validation}
      touched={formElement.config.touched}
      changed={(event) => inputChangedHandler(event, formElement.id)}
    />
  ));

  if (loading) {
    form = <Spinner />;
  }

  let errorMessage = null;
  if (error) {
    errorMessage = parseErrorCode(error.message);
  }

  let authRedirect = null;
  if (isAuthenticated) {
    authRedirect = <Redirect to={props.authRedirectPath} />;
  }

  return (
    <div className={classes.Auth}>
      {authRedirect}
      {errorMessage}
      <form onSubmit={submitHandler}>
        {form}
        <Button buttonType="Success">SUBMIT</Button>
      </form>
      <Button buttonType="Danger" clicked={switchAuthModeHandler}>
        SWITCH TO {isSignup ? "SIGN-IN" : "SIGN-UP"}
      </Button>
    </div>
  );
};

export default auth;
