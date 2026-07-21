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

import { registerUser } from "../services/authService";

export default function RegisterPage({ setView }) {

  const [form, setForm] = useState({
    login: "",
    password: "",
    name: "",
    role: "client",
    employeeRole: ""
  });

  const handleRegister = async () => {
    try {

      await registerUser(form);

      alert("Registered successfully");

      setView("login");

    } catch (err) {
      alert(err.response?.data?.message || "Register error");
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
          Register
        </Typography>

        <TextField
          fullWidth
          label="Name"
          sx={{ mt: 2 }}
          value={form.name}
          onChange={(e) =>
            setForm({
              ...form,
              name: e.target.value
            })
          }
        />

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

        {form.role === "employee" && (
          <TextField
            fullWidth
            label="Employee role"
            sx={{ mt: 2 }}
            value={form.employeeRole}
            onChange={(e) =>
              setForm({
                ...form,
                employeeRole: e.target.value
              })
            }
          />
        )}

        <Button
          fullWidth
          variant="contained"
          sx={{ mt: 2 }}
          onClick={handleRegister}
        >
          Register
        </Button>

        <Button
          fullWidth
          sx={{ mt: 1 }}
          onClick={() => setView("login")}
        >
          Back
        </Button>

      </CardContent>
    </Card>
  );
}