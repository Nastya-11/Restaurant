import { useState } from "react";
import { ThemeProvider } from "@mui/material/styles";

import theme from "./theme";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

import ClientDashboard from "./pages/ClientDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";

export default function App() {

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  const [view, setView] = useState("login");

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setView("login");
  };

  return (
    <ThemeProvider theme={theme}>
      {!user && view === "login" && (
        <LoginPage setUser={setUser} setView={setView} />
      )}

      {!user && view === "register" && (
        <RegisterPage setView={setView} />
      )}

      {user?.role === "client" && (
        <ClientDashboard user={user} logout={logout} />
      )}

      {user?.role === "employee" && (
        <EmployeeDashboard user={user} logout={logout} />
      )}
    </ThemeProvider>
  );
}