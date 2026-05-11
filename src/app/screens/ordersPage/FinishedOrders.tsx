import React from "react";
import { Box, Chip, Stack, Typography } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { retrieveFinishedOrders } from "./selector";
import { Order, OrderItem } from "../../../lib/types/order";
import { Product } from "../../../lib/types/product";
import { serverApi } from "../../../lib/config";

const finishedRetriever = createSelector(
  retrieveFinishedOrders,
  (finishedOrders) => ({ finishedOrders }),
);

export default function FinishedOrders() {
  const { finishedOrders } = useSelector(finishedRetriever);

  if (!finishedOrders.length) {
    return (
      <Box className="orders-empty">
        <Typography className="orders-empty-text">
          No completed orders yet.
        </Typography>
      </Box>
    );
  }

  return (
    <Stack gap={3} className="orders-list">
      {finishedOrders.map((order: Order) => (
        <Box key={order._id} className="order-card order-card--finished">
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            className="order-card-header"
          >
            <Stack direction="row" alignItems="center" gap={1}>
              <CheckCircleOutlineIcon sx={{ fontSize: 18, color: "#2d7d5a" }} />
              <Typography className="order-card-id">
                #{String(order._id).slice(-8).toUpperCase()}
              </Typography>
            </Stack>
            <Chip
              label="Delivered"
              size="small"
              className="status-chip status-chip--delivered"
            />
          </Stack>

          <Stack gap={2} className="order-items-list">
            {order.orderItems?.map((item: OrderItem) => {
              const product: Product | undefined = order.productData?.find(
                (p: Product) => String(p._id) === String(item.productId),
              );
              if (!product) return null;
              return (
                <Stack
                  key={item._id}
                  direction="row"
                  alignItems="center"
                  gap={2}
                  className="order-item-row"
                >
                  <img
                    src={`${serverApi}/${product.productImages[0]}`}
                    alt={product.productName}
                    className="order-item-img"
                  />
                  <Box className="order-item-info">
                    <Typography className="order-item-name">
                      {product.productName}
                    </Typography>
                    <Typography className="order-item-meta">
                      ₩{item.itemPrice.toLocaleString()} × {item.itemQuantity}
                    </Typography>
                  </Box>
                  <Typography className="order-item-subtotal">
                    ₩{(item.itemPrice * item.itemQuantity).toLocaleString()}
                  </Typography>
                </Stack>
              );
            })}
          </Stack>

          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            className="order-card-footer"
          >
            <Box>
              <Typography className="order-total-label">Total Paid</Typography>
              <Typography className="order-total-value">
                ₩{order.orderTotal.toLocaleString()}
              </Typography>
            </Box>
            <Typography
              sx={{
                fontFamily: "'Be Vietnam Pro', sans-serif",
                fontSize: "0.8125rem",
                color: "#2d7d5a",
                fontWeight: 600,
              }}
            >
              ✓ Thank you for your order!
            </Typography>
          </Stack>
        </Box>
      ))}
    </Stack>
  );
}
