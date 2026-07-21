import { useState } from "react";
import { Box, TextField } from "@mui/material";

import OrdersSidebar from "./OrdersSidebar";

import CreateOrder from "./CreateOrder";

import OrderInfo from "./OrderInfo";

export default function OrderPanel() {

  const [selected, setSelected] = useState("create");

  const [orderId, setOrderId] = useState("");
  const [orderInfo, setOrderInfo] = useState(null);

  const [cart, setCart] = useState([]);

  return (
    <Box sx={{ display: "flex" }}>

      <OrdersSidebar
        selected={selected}
        setSelected={setSelected}
      />

      <Box sx={{ flex: 1, padding: 3 }}>

        {selected === "create" && (
          <CreateOrder
            cart={cart}
            setCart={setCart}
          />
        )}

        {selected === "control" && (
          <OrderInfo />
        )}


      </Box>

    </Box>
  );
}