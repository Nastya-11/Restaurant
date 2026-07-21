import { useState } from "react";

import {
  Typography,
  Button,
  TextField
} from "@mui/material";

import api from "../../api/axios";
import DataTable from "../common/DataTable";

export default function ReservedTables() {

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const [data, setData] = useState([]);

  const loadReserved = async () => {
    try {
      const res = await api.get("/reserved", {
        params: { date, time }
      });

      setData(res.data);

    } catch (err) {
      console.log(err);
      alert("Error loading reserved tables");
    }
  };

  return (
    <div style={{ marginTop: 30 }}>

      <Typography variant="h5">
        Reserved Tables
      </Typography>

      <TextField
        type="date"
        sx={{ mt: 2, mr: 2 }}
        onChange={(e) => setDate(e.target.value)}
      />

      <TextField
        type="time"
        sx={{ mt: 2 }}
        onChange={(e) => setTime(e.target.value)}
      />

      <br />

      <Button
        variant="contained"
        sx={{ mt: 2 }}
        onClick={loadReserved}
      >
        Search
      </Button>

      <DataTable data={data} />

    </div>
  );
}