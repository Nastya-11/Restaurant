import { useState } from "react";

import {
  Box,
  Typography,
  Button,
  Paper,
  Avatar
} from "@mui/material";

import Sidebar from "../components/common/Sidebar";

import TablesView from "../components/client/TablesView";
import ReservedTables from "../components/client/ReservedTables";
import FreeTables from "../components/client/FreeTables";

import ProfitView from "../components/employee/Analytics/ProfitView";
import AvgCheckView from "../components/employee/Analytics/AvgCheckView";
import TopWaitersView from "../components/employee/Analytics/TopWaitersView";
import OrdersByDayView from "../components/employee/Analytics/OrdersByDayView";

import InventoryStatus from "../components/employee/Inventory/InventoryStatus";
import ExpensesReport from "../components/employee/Inventory/ExpensesReport";

import ComplaintsView from "../components/employee/Complaints/ComplaintsView";

import ProblemOrders from "../components/employee/Orders/ProblemOrders";

import TopClientsView from "../components/employee/Analytics/TopClientsView";
import TopDishesView from "../components/employee/Analytics/TopDishesView";
import LeastDishesView from "../components/employee/Analytics/LeastDishesView";
import SuppliersView from "../components/employee/Analytics/SuppliersView";
import FrequentCustomersView from "../components/employee/Analytics/FrequentCustomersView";

import OrderPanel from "../components/employee/Orders/OrderPanel";

import AdminPurchasePage from "../pages/AdminPurchasePage";

export default function EmployeeDashboard({ user, logout }) {

  const isAdmin =
    user.role === "employee" &&
    user.employeeRole === "admin";

  const [selected, setSelected] = useState("tables");

  const menu = [
    { key: "tables", label: "Tables" },
    { key: "reserved", label: "Reserved Tables" },
    { key: "freeTables", label: "Free Tables" },

    { key: "profit", label: "Profit" },
    { key: "avgCheck", label: "Average Check" },
    { key: "topWaiters", label: "Top Waiters" },
    { key: "ordersByDay", label: "Orders By Day" },

    { key: "inventory", label: "Inventory" },
    { key: "expenses", label: "Expenses" },

    { key: "complaints", label: "Complaints" },

    { key: "problemOrders", label: "Problem Orders" },

    { key: "topClients", label: "Top Clients" },
    { key: "topDishes", label: "Top Dishes" },
    { key: "leastDishes", label: "Least Ordered" },

    { key: "suppliers", label: "Suppliers" },
    { key: "frequentCustomers", label: "Customers" },

    { key: "orders", label: "Orders" },

    ...(isAdmin
      ? [{ key: "purchases", label: "Purchases" }]
      : [])
  ];

  const renderContent = () => {

    switch (selected) {

      case "tables":
        return <TablesView />;

      case "reserved":
        return <ReservedTables />;

      case "freeTables":
        return <FreeTables />;

      case "profit":
        return <ProfitView />;

      case "avgCheck":
        return <AvgCheckView />;

      case "topWaiters":
        return <TopWaitersView />;

      case "ordersByDay":
        return <OrdersByDayView />;

      case "inventory":
        return <InventoryStatus />;

      case "expenses":
        return <ExpensesReport />;

      case "complaints":
        return <ComplaintsView />;

      case "problemOrders":
        return <ProblemOrders />;

      case "topClients":
        return <TopClientsView />;

      case "topDishes":
        return <TopDishesView />;

      case "leastDishes":
        return <LeastDishesView />;

      case "suppliers":
        return <SuppliersView />;

      case "frequentCustomers":
        return <FrequentCustomersView />;

      case "orders":
        return <OrderPanel />;

      case "purchases":
        return isAdmin
          ? <AdminPurchasePage />
          : <Typography>Access denied</Typography>;

      default:
        return <Typography>Select section</Typography>;
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "#f4f6f8"
      }}
    >

      {/* SIDEBAR */}
      <Sidebar
        menu={menu}
        selected={selected}
        setSelected={setSelected}
      />

      {/* MAIN CONTENT */}
      <Box
        sx={{
          flex: 1,
          p: 4
        }}
      >

        {/* HEADER */}
        <Paper
          elevation={0}
          sx={{
            mb: 4,
            p: 3,
            borderRadius: 4,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "white"
          }}
        >

          <Box>

            <Typography
              variant="h4"
              fontWeight={700}
            >
              Employee Dashboard
            </Typography>

            <Typography
              sx={{
                color: "gray",
                mt: 1
              }}
            >
              Welcome back, {user.login}
            </Typography>

          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2
            }}
          >

            <Avatar>
              {user.login[0].toUpperCase()}
            </Avatar>

            <Button
              variant="contained"
              color="error"
              onClick={logout}
              sx={{
                borderRadius: 3,
                textTransform: "none",
                px: 3
              }}
            >
              Logout
            </Button>

          </Box>

        </Paper>

        {/* CONTENT */}
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 4,
            minHeight: "75vh",
            backgroundColor: "white"
          }}
        >

          {renderContent()}

        </Paper>

      </Box>

    </Box>
  );
}