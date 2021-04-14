import React, { useEffect, useCallback } from "react";
import { connect, useDispatch } from "react-redux";

import Order from "../../components/Order/Order";
import axios from "../../axios-orders";
import withErrorHandler from "../../hoc/withErrorHandler/withErrorHandler";
import * as actions from "../../store/actions/index";
import Spinner from "../../components/UI/Spinner/Spinner";

const orders = (props) => {
  const dispatch = useDispatch();
  const onFetchOrders = useCallback(
    (token, userId) => dispatch(actions.fetchOrders(token, userId)),
    [dispatch]
  );

  useEffect(() => {
    onFetchOrders(props.token, props.userId);
  }, [onFetchOrders]);

  let orders = <Spinner />;
  if (!props.loading) {
    orders = props.orders.map((order) => (
      <Order
        key={order.id}
        ingredients={order.ingredients}
        price={order.price}
      />
    ));
  }
  return <div>{orders}</div>;
};

const mapStateToProps = (state) => {
  return {
    orders: state.order.orders,
    loading: state.order.loading,
    token: state.auth.token,
    userId: state.auth.userId,
  };
};

export default connect(mapStateToProps)(withErrorHandler(orders, axios));
