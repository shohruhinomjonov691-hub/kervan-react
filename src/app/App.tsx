import React, { useState } from "react";
import { Route, Switch, useLocation } from "react-router-dom";
import HomePage from "./screens/homePage";
import ProductsPage from "./screens/productsPage";
import OrdersPage from "./screens/ordersPage";
import UserPage from "./screens/userPage";
import BasketPage from "./screens/basketPage";
import HelpPage from "./screens/helpPage";
import HomeNavbar from "./components/headers/HomeNavbar";
import OtherNavbar from "./components/headers/OtherNavbar";
import Footer from "./components/footer";
import AuthenticationModal from "./components/auth";
import useBasket from "./hooks/useBasket";
import { useGlobals } from "./hooks/useGlobals";
import MemberService from "./services/MemberService";
import { sweetErrorHandling, sweetTopSuccessAlert } from "../lib/sweetAlert";
import { Messages } from "../lib/config";
import "../css/app.css";
import "../css/navbar.css";
import "../css/footer.css";

function App() {
  const location = useLocation();
  const { setAuthMember } = useGlobals();
  const { cartItems, onAdd, onRemove, onDelete, onDeleteAll } = useBasket();

  const [signOpen, setSignOpen] = useState<boolean>(false);
  const [loginOpen, setLoginOpen] = useState<boolean>(false);

  const handleSignupClose = () => setSignOpen(false);
  const handleLoginClose = () => setLoginOpen(false);

  /* Navbar props — logout yo'q, faqat auth modal */
  const navProps = {
    cartItems,
    onAdd,
    onRemove,
    onDelete,
    onDeleteAll,
    setSignupOpen: setSignOpen,
    setLoginOpen: setLoginOpen,
    /* Navbar da logout yo'q — placeholder props */
    handleLogoutClick: () => {},
    anchorEl: null,
    handleCloseLogout: () => {},
    handleLogoutRequest: () => {},
  };

  const isHome = location.pathname === "/";

  return (
    <>
      {isHome ? <HomeNavbar {...navProps} /> : <OtherNavbar {...navProps} />}

      <Switch>
        <Route path="/products">
          <ProductsPage onAdd={onAdd} />
        </Route>
        <Route path="/orders">
          <OrdersPage />
        </Route>
        <Route path="/basket">
          <BasketPage
            cartItems={cartItems}
            onAdd={onAdd}
            onRemove={onRemove}
            onDelete={onDelete}
            onDeleteAll={onDeleteAll}
          />
        </Route>
        <Route path="/member-page">
          <UserPage />
        </Route>
        <Route path="/help">
          <HelpPage />
        </Route>
        <Route path="/">
          <HomePage />
        </Route>
      </Switch>

      <Footer />

      <AuthenticationModal
        signupOpen={signOpen}
        loginOpen={loginOpen}
        handleLoginClose={handleLoginClose}
        handleSignupClose={handleSignupClose}
        setSignupOpen={setSignOpen}
        setLoginOpen={setLoginOpen}
      />
    </>
  );
}

export default App;
