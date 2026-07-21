import { useState } from "react";

import {
  Typography,
  Button,
  TextField,
  Card,
  CardContent,
  Stack,
  Chip
} from "@mui/material";

import api from "../../api/axios";

export default function FreeTables() {

  const [zoneId, setZoneId] = useState("");
  const [count, setCount] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadFreeTables = async () => {
    try {

      setLoading(true);

      const res = await api.get("/free-tables-zone", {
        params: { zone_id: zoneId }
      });

      setCount(res.data[0]?.free_tables ?? 0);

    } catch (err) {
      alert("Error loading free tables");
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
          Free Tables By Zone
        </Typography>

        <Stack spacing={2}>

          <TextField
            label="Zone ID"
            fullWidth
            value={zoneId}
            onChange={(e) => setZoneId(e.target.value)}
          />

          <Button
            variant="contained"
            onClick={loadFreeTables}
            disabled={!zoneId || loading}
            sx={{
              textTransform: "none",
              fontWeight: 600,
              borderRadius: 2
            }}
          >
            {loading ? "Checking..." : "Check availability"}
          </Button>

          {count !== null && (
            <Stack direction="row" alignItems="center" spacing={2}>

              <Typography>
                Available tables:
              </Typography>

              <Chip
                label={count}
                color={count > 0 ? "success" : "error"}
                sx={{ fontWeight: 700 }}
              />

            </Stack>
          )}

        </Stack>

      </CardContent>
    </Card>
  );
}