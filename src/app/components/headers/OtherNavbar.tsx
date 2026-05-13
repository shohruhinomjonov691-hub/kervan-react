import React from "react";
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

interface OtherNavbarProps {
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

export default function OtherNavbar(props: OtherNavbarProps) {
  const { cartItems, setLoginOpen, setSignupOpen } = props;
  const { authMember } = useGlobals();
  const history = useHistory();

  return (
    <Box
      component="nav"
      sx={{
        position: "sticky",
        top: 0,
        zIndex: 1000,
        background: "rgba(252,249,248,0.94)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(219,194,176,0.4)",
        boxShadow: "0 2px 16px rgba(141,75,0,0.06)",
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
                color: "#8d4b00",
                letterSpacing: "-0.01em",
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
                  color: "#8d4b00",
                  fontWeight: 700,
                  borderBottom: "2px solid #8d4b00",
                  paddingBottom: 2,
                }}
                style={{
                  fontFamily: "'Be Vietnam Pro', sans-serif",
                  fontSize: "0.9375rem",
                  fontWeight: 500,
                  textDecoration: "none",
                  color: "#554336",
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
                color: "#1c1b1b",
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
                <Button
                  variant="contained"
                  onClick={() => setLoginOpen(true)}
                  sx={{
                    height: 40,
                    borderRadius: "999px",
                    background: "#8d4b00",
                    fontFamily: "'Be Vietnam Pro', sans-serif",
                    fontWeight: 700,
                    fontSize: "0.875rem",
                    textTransform: "none",
                    px: 2.5,
                    boxShadow: "none",
                    "&:hover": { background: "#6e3900", boxShadow: "none" },
                  }}
                >
                  Login
                </Button>
                <Button
                  variant="contained"
                  onClick={() => setSignupOpen(true)}
                  sx={{
                    height: 40,
                    borderRadius: "999px",
                    background: "#8d4b00",
                    fontFamily: "'Be Vietnam Pro', sans-serif",
                    fontWeight: 700,
                    fontSize: "0.875rem",
                    textTransform: "none",
                    px: 2.5,
                    boxShadow: "none",
                    "&:hover": { background: "#6e3900", boxShadow: "none" },
                  }}
                >
                  Signup
                </Button>
              </>
            ) : (
              /* Avatar → /member-page */
              <Stack direction="row" alignItems="center" spacing={1.5}>
                {/* Profile label */}
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
                    border: "2px solid rgba(141,75,0,0.25)",
                    "&:hover": { borderColor: "#8d4b00" },
                    transition: "border-color 0.2s",
                  }}
                />
              </Stack>
            )}
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
