import React, { useEffect, useState } from "react";
import {
  Badge,
  Box,
  Button,
  Container,
  IconButton,
  Stack,
} from "@mui/material";
import { NavLink, useHistory } from "react-router-dom";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import { CartItem } from "../../../lib/types/search";
import { useGlobals } from "../../hooks/useGlobals";
import { serverApi } from "../../../lib/config";

interface HomeNavbarProps {
  cartItems: CartItem[];
  onAdd: (item: CartItem) => void;
  onRemove: (item: CartItem) => void;
  onDelete: (item: CartItem) => void;
  onDeleteAll: () => void;
  setSignupOpen: (isOpen: boolean) => void;
  setLoginOpen: (isOpen: boolean) => void;
  handleLogoutClick: (e: React.MouseEvent<HTMLElement>) => void;
  anchorEl: HTMLElement | null;
  handleCloseLogout: () => void;
  handleLogoutRequest: () => void;
}

export default function HomeNavbar(props: HomeNavbarProps) {
  const { cartItems, setLoginOpen, setSignupOpen } = props;
  const { authMember } = useGlobals();
  const history = useHistory();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <Box
      component="nav"
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        transition: "background 0.35s, backdrop-filter 0.35s, box-shadow 0.35s",
        background: scrolled ? "rgba(252,249,248,0.92)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(20px)" : "none",
        boxShadow: scrolled
          ? "0 1px 0 rgba(219,194,176,0.4), 0 4px 24px rgba(141,75,0,0.06)"
          : "none",
      }}
    >
      <Container maxWidth="lg">
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ height: 64 }}
        >
          {/* Logo */}
          <NavLink to="/" style={{ textDecoration: "none" }}>
            <Box
              sx={{
                fontFamily: "'Noto Serif', serif",
                fontSize: "1.5rem",
                fontWeight: 700,
                letterSpacing: "-0.01em",
                color: scrolled ? "#8d4b00" : "#ffffff",
                transition: "color 0.3s",
              }}
            >
              Kervan
            </Box>
          </NavLink>

          {/* Center links */}
          <Stack direction="row" alignItems="center" spacing={0.5}>
            {[
              { label: "Home", to: "/", exact: true },
              { label: "Products", to: "/products" },
              ...(authMember ? [{ label: "Orders", to: "/orders" }] : []),
              { label: "Help", to: "/help" },
            ].map((link) => (
              <NavLink
                key={link.label}
                to={link.to}
                exact={link.exact}
                activeStyle={{
                  borderBottom:
                    "2px solid " + (scrolled ? "#8d4b00" : "#ffffff"),
                  paddingBottom: 2,
                }}
                style={{
                  fontFamily: "'Be Vietnam Pro', sans-serif",
                  fontSize: "0.9375rem",
                  fontWeight: 500,
                  textDecoration: "none",
                  color: scrolled ? "#1c1b1b" : "rgba(255,255,255,0.92)",
                  padding: "6px 14px",
                  borderRadius: 6,
                  transition: "color 0.2s",
                }}
              >
                {link.label}
              </NavLink>
            ))}
          </Stack>

          {/* Right: basket + user/login */}
          <Stack direction="row" alignItems="center" spacing={0.5}>
            {/* Basket */}
            <IconButton
              onClick={() => history.push("/basket")}
              sx={{
                color: scrolled ? "#1c1b1b" : "#ffffff",
                "&:hover": { background: "rgba(141,75,0,0.08)" },
              }}
            >
              <Badge
                badgeContent={cartItems.length}
                sx={{
                  "& .MuiBadge-badge": {
                    background: "#8d4b00",
                    color: "#fff",
                    fontSize: "0.6875rem",
                    fontWeight: 700,
                  },
                }}
              >
                <ShoppingBagOutlinedIcon sx={{ fontSize: 22 }} />
              </Badge>
            </IconButton>

            {/* User avatar OR Login */}
            {!authMember ? (
              <>
                {/* Login button */}
                <Button
                  variant="contained"
                  onClick={() => setLoginOpen(true)}
                  sx={{
                    height: 40,
                    borderRadius: "999px",
                    background: scrolled ? "#8d4b00" : "rgba(255,255,255,0.15)",
                    border: scrolled
                      ? "none"
                      : "1.5px solid rgba(255,255,255,0.6)",
                    backdropFilter: "blur(8px)",
                    fontFamily: "'Be Vietnam Pro', sans-serif",
                    fontWeight: 700,
                    fontSize: "0.875rem",
                    textTransform: "none",
                    px: 2.5,
                    color: "#fff",
                    boxShadow: "none",
                    "&:hover": {
                      background: scrolled
                        ? "#6e3900"
                        : "rgba(255,255,255,0.25)",
                      boxShadow: "none",
                    },
                  }}
                >
                  Login
                </Button>
                {/* Login button */}
                <Button
                  variant="contained"
                  onClick={() => setSignupOpen(true)}
                  sx={{
                    height: 40,
                    borderRadius: "999px",
                    background: scrolled ? "#8d4b00" : "rgba(255,255,255,0.15)",
                    border: scrolled
                      ? "none"
                      : "1.5px solid rgba(255,255,255,0.6)",
                    backdropFilter: "blur(8px)",
                    fontFamily: "'Be Vietnam Pro', sans-serif",
                    fontWeight: 700,
                    fontSize: "0.875rem",
                    textTransform: "none",
                    px: 2.5,
                    color: "#fff",
                    boxShadow: "none",
                    "&:hover": {
                      background: scrolled
                        ? "#6e3900"
                        : "rgba(255,255,255,0.25)",
                      boxShadow: "none",
                    },
                  }}
                >
                  Signup
                </Button>
              </>
            ) : (
              /* Avatar → /member-page */
              <Box
                component="img"
                src={
                  authMember.memberImage
                    ? `${serverApi}/${authMember.memberImage}`
                    : "/icons/default-user.svg"
                }
                alt="profile"
                onClick={() => history.push("/member-page")}
                onError={(e: any) => {
                  e.target.src = "/icons/default-user.svg";
                }}
                sx={{
                  width: 38,
                  height: 38,
                  borderRadius: "50%",
                  objectFit: "cover",
                  cursor: "pointer",
                  border: scrolled
                    ? "2px solid rgba(141,75,0,0.3)"
                    : "2px solid rgba(255,255,255,0.6)",
                  transition: "border-color 0.2s",
                  "&:hover": {
                    borderColor: scrolled ? "#8d4b00" : "#fff",
                  },
                }}
              />
            )}
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
