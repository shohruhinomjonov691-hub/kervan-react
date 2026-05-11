import { createSelector } from "reselect";
import { AppRootState, ProductsPageState } from "../../../lib/types/screen";

const selectProductsPage = (state: AppRootState) => state.productsPage;

export const retrieveRestaurant = createSelector(
  selectProductsPage,
  (productsPage: ProductsPageState) => productsPage.restaurant,
);

export const retrieveChosenProduct = createSelector(
  selectProductsPage,
  (productsPage: ProductsPageState) => productsPage.chosenProduct,
);

export const retrieveProducts = createSelector(
  selectProductsPage,
  (productsPage: ProductsPageState) => productsPage.products,
);
