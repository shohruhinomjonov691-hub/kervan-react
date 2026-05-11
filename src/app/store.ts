// src/app/store.ts — branch reducer kerak emas (BranchService to'g'ridan chaqiriladi)
import { configureStore } from "@reduxjs/toolkit";
import HomePageReducer from "./screens/homePage/slice";
import ProductsPageReducer from "./screens/productsPage/slice";
import OrdersPageReducer from "./screens/ordersPage/slice";
import reduxLogger from "redux-logger";

export const store = configureStore({
  middleware: (getDefaultMiddleware) =>
    // @ts-ignore
    getDefaultMiddleware().concat(reduxLogger),
  reducer: {
    homePage: HomePageReducer,
    productsPage: ProductsPageReducer,
    ordersPage: OrdersPageReducer,
    // Branch → Redux emas, to'g'ridan useEffect da chaqiriladi
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
