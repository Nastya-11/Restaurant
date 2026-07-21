import { useEffect, useState } from "react";

import {
  Typography,
  Button
} from "@mui/material";

import api from "../../api/axios";
import DataTable from "../common/DataTable";

export default function TablesView() {

  const [tables, setTables] = useState([]);

  const loadTables = async () => {
    try {
      const res = await api.get("/tables");
      setTables(res.data);
    } catch (err) {
      console.log(err);
      alert("Error loading tables");
    }
  };

  useEffect(() => {
    loadTables();
  }, []);

  return (
    <div style={{ marginTop: 30 }}>

      <Typography variant="h5">
        Restaurant Tables
      </Typography>

      <Button
        variant="contained"
        sx={{ mt: 2 }}
        onClick={loadTables}
      >
        Refresh
      </Button>

      <DataTable data={tables} />

    </div>
  );
}