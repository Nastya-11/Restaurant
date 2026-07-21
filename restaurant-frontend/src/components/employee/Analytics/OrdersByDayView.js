import { useState } from "react";

import {
  TextField,
  Button
} from "@mui/material";

import api from "../../../api/axios";

import DataTable from "../../common/DataTable";
import SectionContainer from "../../common/SectionContainer";

export default function OrdersByDayView() {

  const [date, setDate] = useState("");

  const [data, setData] = useState([]);

  const loadData = async () => {

    const res = await api.get("/orders-by-day", {
      params: {
        date
      }
    });

    setData(res.data);
  };

  return (
    <SectionContainer title="Orders By Day">

      <TextField
        type="date"
        sx={{ mr: 2 }}
        onChange={(e) => setDate(e.target.value)}
      />

      <Button
        variant="contained"
        onClick={loadData}
      >
        Load
      </Button>

      <DataTable data={data} />

    </SectionContainer>
  );
}