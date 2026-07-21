import { useState } from "react";
import { Box, Typography, Paper } from "@mui/material";

import PurchaseSidebar from "../components/purchases/PurchaseSidebar";
import PurchaseHistory from "../components/purchases/PurchaseHistory";
import CreatePurchase from "../components/purchases/CreatePurchase";
import SuppliersTab from "../components/purchases/SuppliersTab";
import IngredientsTab from "../components/purchases/IngredientsTab";

export default function AdminPurchasePage() {

  const [selected, setSelected] = useState("history");

  const renderContent = () => {
    switch (selected) {

      case "history":
        return <PurchaseHistory />;

      case "create":
        return <CreatePurchase />;

      case "suppliers":
        return <SuppliersTab />;

      case "ingredients":
        return <IngredientsTab />;

      default:
        return <Typography>Select section</Typography>;
    }
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", background: "#f4f6f8" }}>

      {/* Sidebar */}
      <PurchaseSidebar
        selected={selected}
        setSelected={setSelected}
      />

      {/* Content */}
      <Box sx={{ flex: 1, p: 3 }}>

        {/* Header */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: "bold" }}>
            Purchases Module
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Manage suppliers, ingredients and purchases
          </Typography>
        </Box>

        {/* Content Card */}
        <Paper
          elevation={2}
          sx={{
            p: 3,
            borderRadius: 3,
            minHeight: "70vh"
          }}
        >
          {renderContent()}
        </Paper>

      </Box>

    </Box>
  );
}