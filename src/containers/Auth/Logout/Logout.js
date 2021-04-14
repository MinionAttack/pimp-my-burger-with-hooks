import React, { useEffect } from "react";
import { Redirect } from "react-router-dom";
import { useDispatch } from "react-redux";

import * as actions from "../../../store/actions/index";

const logout = (props) => {
  const dispatch = useDispatch();
  const onLogout = () => dispatch(actions.logout());

  useEffect(() => {
    onLogout();
  }, [onLogout]);

  return <Redirect to="/" />;
};

export default logout;
