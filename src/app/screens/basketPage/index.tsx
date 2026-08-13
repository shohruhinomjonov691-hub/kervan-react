import React, { useRef, useState } from "react";
import {
  Box,
  Button,
  Container,
  Divider,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import { CartItem } from "../../../lib/types/search";
import { serverApi, Messages } from "../../../lib/config";
import { useGlobals } from "../../hooks/useGlobals";
import OrderService from "../../services/OrderService";
import {
  sweetErrorHandling,
  sweetTopSmallSuccessAlert,
} from "../../../lib/sweetAlert";
import { useHistory } from "react-router-dom";
import "../../../css/basket.css";

interface BasketPageProps {
  cartItems: CartItem[];
  onAdd: (item: CartItem) => void;
  onRemove: (item: CartItem) => void;
  onDelete: (item: CartItem) => void;
  onDeleteAll: () => void;
}

export default function BasketPage(props: BasketPageProps) {
  const { cartItems, onAdd, onRemove, onDelete, onDeleteAll } = props;
  const { authMember, setOrderBuilder } = useGlobals();
  const history = useHistory();
  const [isSubmitting, setIsSubmitting] = useState(false);
  // useState yangilanishi asinxron — bir xil tick ichida ikki marta chaqirilsa
  // ikkalasi ham eski (false) qiymatni ko'radi. Shu sabab haqiqiy qo'riqlash
  // uchun darhol yangilanadigan ref ishlatiladi, useState esa faqat UI uchun
  const isSubmittingRef = useRef(false);

  /* Price calculations */
  const subtotal = cartItems.reduce(
    (acc: number, item: CartItem) => acc + item.price * item.quantity,
    0,
  );
  const deliveryFee = subtotal < 100000 ? 3500 : 0;
  const total = subtotal + deliveryFee;

  /* Proceed to checkout */
  const handleCheckout = async () => {
    // ikki marta bosilganda ikkita buyurtma yaratilmasin — ref darhol
    // yangilanadi, shuning uchun bir xil tick ichidagi ikkinchi chaqiruv ham to'xtatiladi
    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;
    setIsSubmitting(true);
    try {
      if (!authMember) throw new Error(Messages.error2);
      if (cartItems.length === 0) throw new Error("Your basket is empty!");

      // localStorage qo'lda o'zgartirilgan bo'lishi mumkin — 0/manfiy miqdorli
      // bandlarni yubormaymiz (yakuniy narx/miqdor baribir backendda tekshiriladi)
      const validItems = cartItems.filter(
        (item) => Number.isInteger(item.quantity) && item.quantity > 0,
      );
      if (validItems.length === 0) throw new Error("Your basket is empty!");

      const order = new OrderService();
      await order.createOrder(validItems);
      onDeleteAll();
      setOrderBuilder(new Date());
      await sweetTopSmallSuccessAlert("Order placed! 🎉", 1200);
      history.push("/orders");
    } catch (err) {
      sweetErrorHandling(err).then();
    } finally {
      isSubmittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  /* Empty state */
  if (cartItems.length === 0) {
    return (
      <div className="basket-page">
        <Container maxWidth="lg">
          <Box className="basket-empty">
            <ShoppingBagOutlinedIcon
              sx={{ fontSize: 64, color: "#dbc2b0", mb: 2 }}
            />
            <Typography className="basket-empty-title">
              Your basket is empty
            </Typography>
            <Typography className="basket-empty-sub">
              Explore our Turkish menu and add your favorites.
            </Typography>
            <Button
              variant="contained"
              className="basket-empty-btn"
              onClick={() => history.push("/products")}
            >
              Browse Menu
            </Button>
          </Box>
        </Container>
      </div>
    );
  }

  return (
    <div className="basket-page">
      <Container maxWidth="lg">
        {/* ── HEADER ── */}
        <Box className="basket-header">
          <Typography className="basket-title">Your Basket</Typography>
          <Typography className="basket-sub">
            Review your selections from our Turkish kitchen.
          </Typography>
        </Box>

        <Stack
          direction={{ xs: "column", lg: "row" }}
          gap={4}
          alignItems="flex-start"
        >
          {/* ── CART ITEMS ── */}
          <Box className="basket-items-wrap">
            {cartItems.map((item: CartItem) => {
              const imgSrc = item.image
                ? `${serverApi}/${item.image}`
                : "/img/homeNavbar.png";

              return (
                <Box key={item._id} className="basket-item">
                  {/* Image */}
                  <Box className="basket-item-img-wrap">
                    <img
                      src={imgSrc}
                      alt={item.name}
                      className="basket-item-img"
                      onError={(e: any) => {
                        e.target.src = "/img/homeNavbar.png";
                      }}
                    />
                  </Box>

                  {/* Info */}
                  <Box className="basket-item-info">
                    <Typography className="basket-item-name">
                      {item.name}
                    </Typography>
                    <Typography className="basket-item-price-unit">
                      ₩{item.price.toLocaleString()} each
                    </Typography>
                  </Box>

                  {/* Qty controls */}
                  <Stack
                    direction="row"
                    alignItems="center"
                    className="basket-qty"
                  >
                    <IconButton
                      className="basket-qty-btn"
                      onClick={() => onRemove(item)}
                      size="small"
                    >
                      <RemoveIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                    <Typography className="basket-qty-num">
                      {item.quantity}
                    </Typography>
                    <IconButton
                      className="basket-qty-btn"
                      onClick={() => onAdd(item)}
                      size="small"
                    >
                      <AddIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                  </Stack>

                  {/* Line total */}
                  <Typography className="basket-item-total">
                    ₩{(item.price * item.quantity).toLocaleString()}
                  </Typography>

                  {/* Delete */}
                  <IconButton
                    className="basket-delete-btn"
                    onClick={() => onDelete(item)}
                    size="small"
                  >
                    <DeleteOutlineIcon sx={{ fontSize: 20 }} />
                  </IconButton>
                </Box>
              );
            })}
          </Box>

          {/* ── ORDER SUMMARY ── */}
          <Box className="basket-summary">
            <Typography className="basket-summary-title">
              Order Summary
            </Typography>

            <Stack spacing={2} sx={{ mt: 2.5 }}>
              <Stack direction="row" justifyContent="space-between">
                <Typography className="basket-summary-label">
                  Subtotal
                </Typography>
                <Typography className="basket-summary-value">
                  ₩{subtotal.toLocaleString()}
                </Typography>
              </Stack>

              <Stack direction="row" justifyContent="space-between">
                <Typography className="basket-summary-label">
                  Delivery Fee
                  {deliveryFee === 0 && (
                    <Box component="span" className="basket-free-badge">
                      FREE
                    </Box>
                  )}
                </Typography>
                <Typography className="basket-summary-value">
                  {deliveryFee === 0 ? "—" : `₩${deliveryFee.toLocaleString()}`}
                </Typography>
              </Stack>

              <Stack direction="row" justifyContent="space-between">
                <Typography className="basket-summary-label">
                  Service Charge
                </Typography>
                <Typography
                  className="basket-summary-value"
                  sx={{ color: "#2d7d5a !important" }}
                >
                  Free
                </Typography>
              </Stack>

              <Divider sx={{ borderColor: "rgba(219,194,176,0.4)" }} />

              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="flex-end"
              >
                <Box>
                  <Typography className="basket-total-label">
                    Total Amount
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: "'Be Vietnam Pro', sans-serif",
                      fontSize: "0.75rem",
                      color: "#887364",
                    }}
                  >
                    INCLUDES VAT
                  </Typography>
                </Box>
                <Typography className="basket-total-value">
                  ₩{total.toLocaleString()}
                </Typography>
              </Stack>
            </Stack>

            {/* Checkout button */}
            <Button
              fullWidth
              variant="contained"
              className="basket-checkout-btn"
              onClick={handleCheckout}
              disabled={isSubmitting}
              sx={{ mt: 3 }}
            >
              {isSubmitting ? "Placing Order..." : "Proceed to Checkout →"}
            </Button>

            {/* Security note */}
            <Box className="basket-security-note">
              <LockOutlinedIcon
                sx={{ fontSize: 16, color: "#8d4b00", flexShrink: 0 }}
              />
              <Typography className="basket-security-text">
                Your payment is secured with 256-bit SSL encryption. We accept
                all major cards.
              </Typography>
            </Box>

            {/* Free delivery hint */}
            {subtotal < 100000 && (
              <Box className="basket-delivery-hint">
                <Typography className="basket-hint-text">
                  Add{" "}
                  <strong style={{ color: "#8d4b00" }}>
                    ₩{(100000 - subtotal).toLocaleString()}
                  </strong>{" "}
                  more for free delivery!
                </Typography>
              </Box>
            )}
          </Box>
        </Stack>
      </Container>
    </div>
  );
}
