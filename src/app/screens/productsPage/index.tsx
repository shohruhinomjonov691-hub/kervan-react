import React from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import ChosenProduct from "./ChosenProduct";
import Products from "./Products";
import { CartItem } from "../../../lib/types/search";
import "../../../css/products.css";

interface ProductsPageProps {
  onAdd: (item: CartItem) => void;
}

export default function ProductsPage(props: ProductsPageProps) {
  const { onAdd } = props;
  const { path } = useRouteMatch();

  return (
    <div className="products-page">
      <Switch>
        {/* ✅ :productId route OLDIN bo'lishi shart */}
        <Route path={`${path}/:productId`}>
          <ChosenProduct onAdd={onAdd} />
        </Route>
        <Route path={path}>
          <Products onAdd={onAdd} />
        </Route>
      </Switch>
    </div>
  );
}
