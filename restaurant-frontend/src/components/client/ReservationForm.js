import { useState } from "react";

import {
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Stack
} from "@mui/material";

import api from "../../api/axios";

export default function ReservationForm() {

  const [form, setForm] = useState({
    table_id: "",
    date: "",
    time: ""
  });

  const createReservation = async () => {
    try {

      await api.post("/reservations", form);

      alert("Reservation created");

      setForm({
        table_id: "",
        date: "",
        time: ""
      });

    } catch (err) {
      alert(err.response?.data?.message);
    }
  };

  return (
    <Card
      sx={{
        mt: 4,
        borderRadius: 4,
        boxShadow: "0 8px 30px rgba(0,0,0,0.06)"
      }}
    >

      <CardContent>

        <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
          Create Reservation
        </Typography>

        <Stack spacing={2}>

          <TextField
            label="Table ID"
            fullWidth
            value={form.table_id}
            onChange={(e) =>
              setForm({ ...form, table_id: e.target.value })
            }
          />

          <TextField
            type="date"
            label="Date"
            InputLabelProps={{ shrink: true }}
            fullWidth
            value={form.date}
            onChange={(e) =>
              setForm({ ...form, date: e.target.value })
            }
          />

          <TextField
            type="time"
            label="Time"
            InputLabelProps={{ shrink: true }}
            fullWidth
            value={form.time}
            onChange={(e) =>
              setForm({ ...form, time: e.target.value })
            }
          />

          <Button
            variant="contained"
            size="large"
            sx={{
              mt: 1,
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600
            }}
            onClick={createReservation}
          >
            Reserve Table
          </Button>

        </Stack>

      </CardContent>
    </Card>
  );
}