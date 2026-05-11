import { createSelector } from "reselect";
import { AppRootState, OrdersPageState } from "../../../lib/types/screen";

const selectOrdersPage = (state: AppRootState) => state.ordersPage;

export const retrievePausedOrders = createSelector(
  selectOrdersPage,
  (ordersPage: OrdersPageState) => ordersPage.pausedOrders,
);

export const retrieveProcessOrders = createSelector(
  selectOrdersPage,
  (ordersPage: OrdersPageState) => ordersPage.processOrders,
);

export const retrieveFinishedOrders = createSelector(
  selectOrdersPage,
  (ordersPage: OrdersPageState) => ordersPage.finishedOrders,
);
