import React, { useEffect, useState } from "react";
import { Box, Container, Tab, Tabs, Typography } from "@mui/material";
import { useDispatch } from "react-redux";
import { Dispatch } from "@reduxjs/toolkit";
import { setPausedOrders, setProcessOrders, setFinishedOrders } from "./slice";
import { Order } from "../../../lib/types/order";
import { OrderStatus } from "../../../lib/enums/order.enum";
import OrderService from "../../services/OrderService";
import { useGlobals } from "../../hooks/useGlobals";
import { sweetErrorHandling } from "../../../lib/sweetAlert";
import PausedOrders from "./PausedOrders";
import ProcessOrders from "./ProcessOrders";
import FinishedOrders from "./FinishedOrders";
import "../../../css/order.css";

const actionDispatch = (dispatch: Dispatch) => ({
  setPausedOrders: (data: Order[]) => dispatch(setPausedOrders(data)),
  setProcessOrders: (data: Order[]) => dispatch(setProcessOrders(data)),
  setFinishedOrders: (data: Order[]) => dispatch(setFinishedOrders(data)),
});

export default function OrdersPage() {
  const { setPausedOrders, setProcessOrders, setFinishedOrders } =
    actionDispatch(useDispatch());
  const { authMember, orderBuilder } = useGlobals();
  const [tabValue, setTabValue] = useState("1");

  useEffect(() => {
    if (!authMember) return;
    const order = new OrderService();
    order
      .getMyOrders({ page: 1, limit: 5, orderStatus: OrderStatus.PAUSE })
      .then((data) => setPausedOrders(data))
      .catch((err) => sweetErrorHandling(err));
    order
      .getMyOrders({ page: 1, limit: 5, orderStatus: OrderStatus.PROCESS })
      .then((data) => setProcessOrders(data))
      .catch((err) => sweetErrorHandling(err));
    order
      .getMyOrders({ page: 1, limit: 5, orderStatus: OrderStatus.FINISH })
      .then((data) => setFinishedOrders(data))
      .catch((err) => sweetErrorHandling(err));
  }, [authMember, orderBuilder]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!authMember) {
    return (
      <div className="orders-page">
        <Container maxWidth="lg">
          <Box className="orders-login-needed">
            <Typography className="orders-login-title">
              Please sign in to view your orders
            </Typography>
          </Box>
        </Container>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <Container maxWidth="lg">
        <Box className="orders-header">
          <Typography className="orders-title">My Orders</Typography>
          <Typography className="orders-sub">
            Track and manage your Kervan orders.
          </Typography>
        </Box>

        <Box className="orders-tabs-wrap">
          <Tabs
            value={tabValue}
            onChange={(_, v) => setTabValue(v)}
            className="orders-tabs"
            TabIndicatorProps={{ style: { backgroundColor: "#8d4b00" } }}
          >
            <Tab label="Pending" value="1" className="orders-tab" />
            <Tab label="Processing" value="2" className="orders-tab" />
            <Tab label="Completed" value="3" className="orders-tab" />
          </Tabs>
        </Box>

        {tabValue === "1" && <PausedOrders setValue={setTabValue} />}
        {tabValue === "2" && <ProcessOrders setValue={setTabValue} />}
        {tabValue === "3" && <FinishedOrders />}
      </Container>
    </div>
  );
}
