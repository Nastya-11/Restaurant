import {
  Box,
  Typography,
  Button,
  Paper,
  Avatar
} from "@mui/material";

import TablesView from "../components/client/TablesView";
import ReservedTables from "../components/client/ReservedTables";
import FreeTables from "../components/client/FreeTables";
import ReservationForm from "../components/client/ReservationForm";
import ComplaintForm from "../components/client/ComplaintForm";

export default function ClientDashboard({ user, logout }) {

  const Card = ({ children }) => (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 4,
        boxShadow: "0 6px 25px rgba(0,0,0,0.05)",
        transition: "0.2s",
        "&:hover": {
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)"
        }
      }}
    >
      {children}
    </Paper>
  );

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#f4f6f8",
        p: 4
      }}
    >

      {/* HEADER */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 4,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4
        }}
      >

        <Box>
          <Typography variant="h4" fontWeight={700}>
            Client Dashboard
          </Typography>

          <Typography sx={{ color: "gray", mt: 1 }}>
            Welcome, {user.login}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Avatar sx={{ bgcolor: "#1976d2" }}>
            {user.login?.[0]?.toUpperCase()}
          </Avatar>

          <Button
            variant="contained"
            color="error"
            sx={{
              borderRadius: 3,
              textTransform: "none",
              px: 3
            }}
            onClick={logout}
          >
            Logout
          </Button>
        </Box>

      </Paper>

      {/* CONTENT GRID */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "1fr 1fr"
          },
          gap: 3
        }}
      >

        <Card>
          <TablesView />
        </Card>

        <Card>
          <ReservedTables />
        </Card>

        <Card>
          <FreeTables />
        </Card>

        <Card>
          <ReservationForm />
        </Card>

        <Box sx={{ gridColumn: { md: "span 2" } }}>
          <Card>
            <ComplaintForm />
          </Card>
        </Box>

      </Box>

    </Box>
  );
}