import { useState } from "react";

import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  MenuItem,
  Select
} from "@mui/material";

import { loginUser } from "../services/authService";

export default function LoginPage({ setUser, setView }) {

  const [form, setForm] = useState({
    login: "",
    password: "",
    role: "client"
  });

  const handleLogin = async () => {
    try {
      const user = await loginUser(form);

      localStorage.setItem("user", JSON.stringify(user));

      setUser(user);

    } catch (err) {
      alert(err.response?.data?.message || "Login error");
    }
  };

  return (
    <Card
      sx={{
        width: 400,
        margin: "100px auto",
        padding: 3
      }}
    >
      <CardContent>

        <Typography variant="h5">
          Login
        </Typography>

        <TextField
          fullWidth
          label="Login"
          sx={{ mt: 2 }}
          value={form.login}
          onChange={(e) =>
            setForm({
              ...form,
              login: e.target.value
            })
          }
        />

        <TextField
          fullWidth
          type="password"
          label="Password"
          sx={{ mt: 2 }}
          value={form.password}
          onChange={(e) =>
            setForm({
              ...form,
              password: e.target.value
            })
          }
        />

        <Select
          fullWidth
          sx={{ mt: 2 }}
          value={form.role}
          onChange={(e) =>
            setForm({
              ...form,
              role: e.target.value
            })
          }
        >
          <MenuItem value="client">
            Client
          </MenuItem>

          <MenuItem value="employee">
            Employee
          </MenuItem>
        </Select>

        <Button
          fullWidth
          variant="contained"
          sx={{ mt: 2 }}
          onClick={handleLogin}
        >
          Login
        </Button>

        <Button
          fullWidth
          sx={{ mt: 1 }}
          onClick={() => setView("register")}
        >
          Register
        </Button>

      </CardContent>
    </Card>
  );
}