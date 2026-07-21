import { useState } from "react";
import api from "../../../api/axios";

import {
  Box,
  Button,
  Typography,
  Card,
  Stack,
  TextField,
  Divider
} from "@mui/material";

export default function OrderInfo() {
  const [orderId, setOrderId] = useState("");
  const [orderInfo, setOrderInfo] = useState(null);
  const [showStatusChoice, setShowStatusChoice] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  const getOrderInfo = async () => {
    try {
      const res = await api.get(`/orders/${orderId}/info`);
      setOrderInfo(res.data);

      setShowStatusChoice(false);
      setShowPayment(false);

      if (res.data.status === "active") {
        setShowStatusChoice(true);
      }

      if (
        res.data.status === "completed" &&
        res.data.payment_status !== "paid"
      ) {
        setShowPayment(true);
      }
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "Order error");
    }
  };

  const updateStatus = async (status) => {
    try {
      await api.patch(`/orders/${orderId}/status`, { status });

      const res = await api.get(`/orders/${orderId}/info`);
      setOrderInfo(res.data);

      setShowStatusChoice(false);

      if (status === "completed") {
        setShowPayment(true);
      }

      alert("Status updated");
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "Status error");
    }
  };

  const pay = async (method) => {
    try {
      await api.post(`/orders/${orderId}/pay`, { method });

      alert("Payment successful");

      const res = await api.get(`/orders/${orderId}/info`);
      setOrderInfo(res.data);

      setShowPayment(false);
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "Payment error");
    }
  };

  return (
    <Box sx={{ mt: 3, maxWidth: 700 }}>

      {/* HEADER */}
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
        Order Control
      </Typography>

      {/* SEARCH */}
      <Card sx={{ p: 2, mb: 3 }}>
        <Stack direction="row" spacing={2}>
          <TextField
            fullWidth
            size="small"
            placeholder="Enter Order ID"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
          />

          <Button variant="contained" onClick={getOrderInfo}>
            Get Order
          </Button>
        </Stack>
      </Card>

      {/* ORDER INFO */}
      {orderInfo && (
        <Card sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Order #{orderId}
          </Typography>

          <Divider sx={{ mb: 2 }} />

          <Stack spacing={1}>
            <Typography>
              <b>Status:</b> {orderInfo.status}
            </Typography>

            <Typography>
              <b>Total:</b> {orderInfo.total}
            </Typography>

            <Typography>
              <b>Payment Status:</b> {orderInfo.payment_status}
            </Typography>

            <Typography>
              <b>Payment Method:</b>{" "}
              {orderInfo.payment_method || "-"}
            </Typography>
          </Stack>
        </Card>
      )}

      {/* STATUS CONTROL */}
      {showStatusChoice && (
        <Card sx={{ p: 3, mb: 3 }}>
          <Typography sx={{ mb: 2, fontWeight: 600 }}>
            Change order status
          </Typography>

          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              onClick={() => updateStatus("pending")}
            >
              Pending
            </Button>

            <Button
              variant="contained"
              onClick={() => updateStatus("completed")}
            >
              Completed
            </Button>
          </Stack>
        </Card>
      )}

      {/* PAYMENT */}
      {showPayment && orderInfo?.payment_status !== "paid" && (
        <Card sx={{ p: 3 }}>
          <Typography sx={{ mb: 2, fontWeight: 600 }}>
            Choose payment method
          </Typography>

          <Stack direction="row" spacing={2}>
            <Button variant="outlined" onClick={() => pay("cash")}>
              Cash
            </Button>

            <Button variant="contained" onClick={() => pay("card")}>
              Card
            </Button>
          </Stack>
        </Card>
      )}

    </Box>
  );
}