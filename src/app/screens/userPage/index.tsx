import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import CreditCardOutlinedIcon from "@mui/icons-material/CreditCardOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import CameraAltOutlinedIcon from "@mui/icons-material/CameraAltOutlined";
import { useGlobals } from "../../hooks/useGlobals";
import { useHistory, useLocation } from "react-router-dom";
import { serverApi } from "../../../lib/config";
import { Order } from "../../../lib/types/order";
import { OrderStatus } from "../../../lib/enums/order.enum";
import OrderService from "../../services/OrderService";
import MemberService from "../../services/MemberService";
import {
  sweetErrorHandling,
  sweetTopSmallSuccessAlert,
} from "../../../lib/sweetAlert";
import Settings from "./Settings";
import PaymentMethod from "./PaymentMethod";
import "../../../css/userPage.css";

type SideTab = "profile" | "orders" | "payments";

export default function UserPage() {
  const { authMember, setAuthMember } = useGlobals();
  const history = useHistory();
  const location = useLocation();
  const initialTab: SideTab =
    new URLSearchParams(location.search).get("tab") === "payments"
      ? "payments"
      : "profile";
  const [activeTab, setActiveTab] = useState<SideTab>(initialTab);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [editMode, setEditMode] = useState(false);

  // ✅ hooks shartdan OLDIN
  useEffect(() => {
    if (!authMember) return;
    new OrderService()
      .getMyOrders({ page: 1, limit: 4, orderStatus: OrderStatus.FINISH })
      .then((data) => setRecentOrders(data))
      .catch((err) => console.log(err));
  }, [authMember]); // eslint-disable-line

  if (!authMember) {
    history.push("/");
    return null;
  }

  const handleLogout = async () => {
    try {
      await new MemberService().logout();
      setAuthMember(null);
      await sweetTopSmallSuccessAlert("Logged out!", 700);
      history.push("/");
    } catch (err) {
      sweetErrorHandling(err).then();
    }
  };

  const avatarSrc = authMember.memberImage
    ? `${serverApi}/${authMember.memberImage}`
    : "/icons/default-user.svg";

  const sideItems: { key: SideTab; icon: React.ReactNode; label: string }[] = [
    {
      key: "profile",
      icon: <PersonOutlineIcon sx={{ fontSize: 20 }} />,
      label: "Profile Overview",
    },
    {
      key: "orders",
      icon: <ReceiptLongOutlinedIcon sx={{ fontSize: 20 }} />,
      label: "My Orders",
    },
    {
      key: "payments",
      icon: <CreditCardOutlinedIcon sx={{ fontSize: 20 }} />,
      label: "Payments",
    },
  ];

  return (
    <div className="up-page">
      <Container maxWidth="lg">
        <Stack direction={{ xs: "column", md: "row" }} gap={4} sx={{ py: 5 }}>
          {/* ══ SIDEBAR ══ */}
          <Box className="up-sidebar">
            {sideItems.map((item) => (
              <Box
                key={item.key}
                className={`up-nav-item ${activeTab === item.key ? "up-nav-item--active" : ""}`}
                onClick={() => {
                  setActiveTab(item.key);
                  setEditMode(false);
                }}
              >
                {item.icon}
                <span>{item.label}</span>
              </Box>
            ))}

            <Divider sx={{ borderColor: "rgba(219,194,176,0.3)", my: 1.5 }} />

            <Box
              className="up-nav-item up-nav-item--logout"
              onClick={handleLogout}
            >
              <LogoutIcon sx={{ fontSize: 20 }} />
              <span>Log Out</span>
            </Box>
          </Box>

          {/* ══ MAIN CONTENT ══ */}
          <Box className="up-main">
            {/* ════ PROFILE TAB ════ */}
            {activeTab === "profile" && !editMode && (
              <Stack gap={3}>
                {/* Profile header card */}
                <Box className="up-card">
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    alignItems={{ sm: "flex-start" }}
                    gap={3}
                  >
                    {/* Avatar */}
                    <Box className="up-avatar-wrap">
                      <img
                        src={avatarSrc}
                        alt={authMember.memberNick}
                        className="up-avatar-img"
                        onError={(e: any) => {
                          e.target.src = "/icons/default-user.svg";
                        }}
                      />
                      <Box className="up-avatar-cam">
                        <CameraAltOutlinedIcon
                          sx={{ fontSize: 16, color: "#fff" }}
                        />
                      </Box>
                    </Box>

                    {/* Info */}
                    <Box className="up-profile-info" sx={{ flex: 1 }}>
                      <Typography className="up-profile-name">
                        {authMember.memberNick}
                      </Typography>

                      <Stack
                        direction="row"
                        gap={3}
                        flexWrap="wrap"
                        sx={{ mt: 0.75 }}
                      >
                        {authMember.memberAddress && (
                          <Stack
                            direction="row"
                            alignItems="center"
                            gap={0.5}
                            className="up-meta"
                          >
                            <LocationOnOutlinedIcon sx={{ fontSize: 15 }} />
                            <span>{authMember.memberAddress}</span>
                          </Stack>
                        )}
                        {authMember.memberPhone && (
                          <Stack
                            direction="row"
                            alignItems="center"
                            gap={0.5}
                            className="up-meta"
                          >
                            <PhoneOutlinedIcon sx={{ fontSize: 15 }} />
                            <span>{authMember.memberPhone}</span>
                          </Stack>
                        )}
                      </Stack>

                      {authMember.memberDesc && (
                        <Typography className="up-desc" sx={{ mt: 1 }}>
                          {authMember.memberDesc}
                        </Typography>
                      )}
                    </Box>

                    {/* Edit button */}
                    <Button
                      variant="outlined"
                      startIcon={<EditOutlinedIcon sx={{ fontSize: 16 }} />}
                      className="up-edit-btn"
                      onClick={() => setEditMode(true)}
                    >
                      Edit Profile
                    </Button>
                  </Stack>
                </Box>

                {/* Recent Orders + Payment side by side */}
                <Stack direction={{ xs: "column", lg: "row" }} gap={3}>
                  {/* Recent Orders */}
                  <Box className="up-card" sx={{ flex: 1 }}>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      sx={{ mb: 3 }}
                    >
                      <Typography className="up-card-title">
                        Recent Orders
                      </Typography>
                      <Box
                        className="up-view-all"
                        onClick={() => history.push("/orders")}
                      >
                        View All →
                      </Box>
                    </Stack>

                    <Stack gap={2}>
                      {recentOrders.length > 0 ? (
                        recentOrders.map((order) => (
                          <Box key={order._id} className="up-order-row">
                            <Stack direction="row" alignItems="center" gap={2}>
                              <Box className="up-order-icon">
                                <ReceiptLongOutlinedIcon
                                  sx={{ fontSize: 20, color: "#8d4b00" }}
                                />
                              </Box>
                              <Box>
                                <Typography className="up-order-name">
                                  {/* Product ismi yo'q, order ID ko'rsatamiz */}
                                  Order #
                                  {String(order._id).slice(-6).toUpperCase()}
                                </Typography>
                                <Typography className="up-order-date">
                                  {new Date(order.createdAt).toLocaleDateString(
                                    "en-US",
                                    {
                                      month: "short",
                                      day: "numeric",
                                      year: "numeric",
                                    },
                                  )}
                                  {" · "}
                                  <span className="up-order-id">
                                    #KV-
                                    {String(order._id).slice(-4).toUpperCase()}
                                  </span>
                                </Typography>
                              </Box>
                            </Stack>
                            <Stack direction="row" alignItems="center" gap={2}>
                              <Typography className="up-order-total">
                                ₩{order.orderTotal.toLocaleString()}
                              </Typography>
                              <Box className="up-status-delivered">
                                DELIVERED
                              </Box>
                            </Stack>
                          </Box>
                        ))
                      ) : (
                        <Typography
                          sx={{
                            color: "#dbc2b0",
                            fontSize: "0.875rem",
                            textAlign: "center",
                            py: 3,
                          }}
                        >
                          No completed orders yet.
                        </Typography>
                      )}
                    </Stack>
                  </Box>

                  {/* Payment Methods */}
                  <Box
                    className="up-card"
                    sx={{ width: { lg: 340 }, flexShrink: 0 }}
                  >
                    <Typography className="up-card-title" sx={{ mb: 3 }}>
                      Payment Methods
                    </Typography>
                    <PaymentMethod />
                  </Box>
                </Stack>
              </Stack>
            )}

            {/* ════ EDIT PROFILE (inline) ════ */}
            {activeTab === "profile" && editMode && (
              <Box className="up-card">
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ mb: 3 }}
                >
                  <Typography className="up-card-title">
                    Edit Profile
                  </Typography>
                  <Button
                    size="small"
                    className="up-back-btn"
                    onClick={() => setEditMode(false)}
                  >
                    ← Back
                  </Button>
                </Stack>
                <Settings />
              </Box>
            )}

            {/* ════ ORDERS TAB ════ */}
            {activeTab === "orders" && (
              <Box className="up-card">
                <Typography className="up-card-title" sx={{ mb: 3 }}>
                  My Orders
                </Typography>
                <Stack gap={4}>
                  {recentOrders.length > 0 ? (
                    recentOrders.map((order) => (
                      <Box key={order._id} className="up-order-row">
                        <Stack direction="row" alignItems="center" gap={4}>
                          <Box className="up-order-icon">
                            <ReceiptLongOutlinedIcon
                              sx={{ fontSize: 20, color: "#8d4b00" }}
                            />
                          </Box>
                          <Box>
                            <Typography className="up-order-name">
                              Order #{String(order._id).slice(-6).toUpperCase()}
                            </Typography>
                            <Typography className="up-order-date">
                              {new Date(order.createdAt).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                },
                              )}
                            </Typography>
                          </Box>
                        </Stack>
                        <Stack direction="row" alignItems="center" gap={4}>
                          <Typography className="up-order-total">
                            ₩{order.orderTotal.toLocaleString()}
                          </Typography>
                          <Box className="up-status-delivered">DELIVERED</Box>
                        </Stack>
                      </Box>
                    ))
                  ) : (
                    <Typography
                      sx={{ color: "#dbc2b0", textAlign: "center", py: 3 }}
                    >
                      No orders yet.
                    </Typography>
                  )}
                </Stack>
                <Button
                  className="up-orders-link-btn"
                  onClick={() => history.push("/orders")}
                  sx={{ mt: 3 }}
                >
                  View All Orders →
                </Button>
              </Box>
            )}

            {/* ════ PAYMENTS TAB ════ */}
            {activeTab === "payments" && (
              <Box className="up-card">
                <Typography className="up-card-title" sx={{ mb: 3 }}>
                  Payment Methods
                </Typography>
                <PaymentMethod />
              </Box>
            )}
          </Box>
        </Stack>
      </Container>
    </div>
  );
}
