import React from "react";
import { Box, Button, Chip, Stack, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { retrievePausedOrders } from "./selector";
import { Order, OrderItem, OrderUpdateInput } from "../../../lib/types/order";
import { Product } from "../../../lib/types/product";
import { OrderStatus } from "../../../lib/enums/order.enum";
import { Messages, serverApi } from "../../../lib/config";
import { sweetErrorHandling } from "../../../lib/sweetAlert";
import { useGlobals } from "../../hooks/useGlobals";
import OrderService from "../../services/OrderService";
import { T } from "../../../lib/types/common";

const pausedRetriever = createSelector(
  retrievePausedOrders,
  (pausedOrders) => ({ pausedOrders }),
);

interface PausedOrdersProps {
  setValue: (v: string) => void;
}

export default function PausedOrders({ setValue }: PausedOrdersProps) {
  const { authMember, setOrderBuilder } = useGlobals();
  const { pausedOrders } = useSelector(pausedRetriever);

  const deleteOrderHandler = async (e: T) => {
    try {
      if (!authMember) throw new Error(Messages.error2);
      const confirmed = window.confirm("Delete this order?");
      if (!confirmed) return;
      const input: OrderUpdateInput = {
        orderId: e.target.value,
        orderStatus: OrderStatus.DELETE,
      };
      await new OrderService().updateOrders(input);
      setOrderBuilder(new Date());
    } catch (err) {
      sweetErrorHandling(err).then();
    }
  };

  const processOrderHandler = async (e: T) => {
    try {
      if (!authMember) throw new Error(Messages.error2);
      const confirmed = window.confirm("Proceed with payment?");
      if (!confirmed) return;
      const input: OrderUpdateInput = {
        orderId: e.target.value,
        orderStatus: OrderStatus.PROCESS,
      };
      await new OrderService().updateOrders(input);
      setValue("2");
      setOrderBuilder(new Date());
    } catch (err) {
      sweetErrorHandling(err).then();
    }
  };

  if (!pausedOrders.length) {
    return (
      <Box className="orders-empty">
        <Typography className="orders-empty-text">
          No pending orders at the moment.
        </Typography>
      </Box>
    );
  }

  return (
    <Stack gap={3} className="orders-list">
      {pausedOrders.map((order: Order) => (
        <Box key={order._id} className="order-card">
          {/* Order status header */}
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            className="order-card-header"
          >
            <Box>
              <Typography className="order-card-id">
                #{String(order._id).slice(-8).toUpperCase()}
              </Typography>
            </Box>
            <Chip
              label="Pending"
              size="small"
              className="status-chip status-chip--pending"
            />
          </Stack>

          {/* Items */}
          <Stack gap={2} className="order-items-list">
            {order.orderItems?.map((item: OrderItem) => {
              const product: Product | undefined = order.productData?.find(
                (p: Product) => String(p._id) === String(item.productId),
              );
              if (!product) return null;
              const imgSrc = `${serverApi}/${product.productImages[0]}`;
              return (
                <Stack
                  key={item._id}
                  direction="row"
                  alignItems="center"
                  gap={2}
                  className="order-item-row"
                >
                  <img
                    src={imgSrc}
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

          {/* Footer */}
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            className="order-card-footer"
          >
            <Box>
              <Typography className="order-total-label">Total</Typography>
              <Typography className="order-total-value">
                ₩{order.orderTotal.toLocaleString()}
                <Box component="span" className="order-delivery-note">
                  {" "}
                  (+₩{order.orderDelivery.toLocaleString()} delivery)
                </Box>
              </Typography>
            </Box>
            <Stack direction="row" gap={1.5}>
              <Button
                variant="outlined"
                size="small"
                value={String(order._id)}
                onClick={deleteOrderHandler}
                className="order-btn order-btn--delete"
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                size="small"
                value={String(order._id)}
                onClick={processOrderHandler}
                className="order-btn order-btn--pay"
              >
                Pay Now
              </Button>
            </Stack>
          </Stack>
        </Box>
      ))}
    </Stack>
  );
}
