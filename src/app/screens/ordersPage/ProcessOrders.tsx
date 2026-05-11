import React from "react";
import { Box, Button, Chip, Stack, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { retrieveProcessOrders } from "./selector";
import { Order, OrderItem, OrderUpdateInput } from "../../../lib/types/order";
import { Product } from "../../../lib/types/product";
import { OrderStatus } from "../../../lib/enums/order.enum";
import { Messages, serverApi } from "../../../lib/config";
import { sweetErrorHandling } from "../../../lib/sweetAlert";
import { useGlobals } from "../../hooks/useGlobals";
import OrderService from "../../services/OrderService";
import { T } from "../../../lib/types/common";

const processRetriever = createSelector(
  retrieveProcessOrders,
  (processOrders) => ({ processOrders }),
);

interface ProcessOrdersProps {
  setValue: (v: string) => void;
}

export default function ProcessOrders({ setValue }: ProcessOrdersProps) {
  const { authMember, setOrderBuilder } = useGlobals();
  const { processOrders } = useSelector(processRetriever);

  const finishOrderHandler = async (e: T) => {
    try {
      if (!authMember) throw new Error(Messages.error2);
      const confirmed = window.confirm("Have you received your order?");
      if (!confirmed) return;
      const input: OrderUpdateInput = {
        orderId: e.target.value,
        orderStatus: OrderStatus.FINISH,
      };
      await new OrderService().updateOrders(input);
      setValue("3");
      setOrderBuilder(new Date());
    } catch (err) {
      sweetErrorHandling(err).then();
    }
  };

  if (!processOrders.length) {
    return (
      <Box className="orders-empty">
        <Typography className="orders-empty-text">
          No orders in processing.
        </Typography>
      </Box>
    );
  }

  return (
    <Stack gap={3} className="orders-list">
      {processOrders.map((order: Order) => (
        <Box key={order._id} className="order-card">
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            className="order-card-header"
          >
            <Typography className="order-card-id">
              #{String(order._id).slice(-8).toUpperCase()}
            </Typography>
            <Chip
              label="Processing"
              size="small"
              className="status-chip status-chip--processing"
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
              <Typography className="order-total-label">Total</Typography>
              <Typography className="order-total-value">
                ₩{order.orderTotal.toLocaleString()}
              </Typography>
            </Box>
            <Button
              variant="contained"
              size="small"
              value={String(order._id)}
              onClick={finishOrderHandler}
              className="order-btn order-btn--finish"
            >
              Mark as Received
            </Button>
          </Stack>
        </Box>
      ))}
    </Stack>
  );
}
