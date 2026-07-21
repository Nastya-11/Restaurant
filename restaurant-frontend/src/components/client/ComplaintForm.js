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

export default function ComplaintForm() {

  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const createComplaint = async () => {
    try {

      setLoading(true);

      await api.post("/complaints", { text });

      alert("Complaint sent");

      setText("");

    } catch (err) {
      alert(err.response?.data?.message);
    } finally {
      setLoading(false);
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
          Complaint Form
        </Typography>

        <Stack spacing={2}>

          <TextField
            multiline
            rows={4}
            fullWidth
            label="Describe your complaint"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          <Button
            variant="contained"
            disabled={!text || loading}
            onClick={createComplaint}
            sx={{
              textTransform: "none",
              fontWeight: 600,
              borderRadius: 2
            }}
          >
            {loading ? "Sending..." : "Send Complaint"}
          </Button>

        </Stack>

      </CardContent>
    </Card>
  );
}