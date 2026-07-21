import { useState } from "react";

import {
  TextField,
  Button
} from "@mui/material";

import api from "../../../api/axios";

import DataTable from "../../common/DataTable";
import SectionContainer from "../../common/SectionContainer";

export default function ProfitView() {

  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  const [data, setData] = useState([]);

  const loadProfit = async () => {

    const res = await api.get("/profit", {
      params: {
        start,
        end
      }
    });

    setData(res.data);
  };

  return (
    <SectionContainer title="Profit">

      <TextField
        type="date"
        sx={{ mr: 2 }}
        onChange={(e) => setStart(e.target.value)}
      />

      <TextField
        type="date"
        sx={{ mr: 2 }}
        onChange={(e) => setEnd(e.target.value)}
      />

      <Button
        variant="contained"
        onClick={loadProfit}
      >
        Load
      </Button>

      <DataTable data={data} />

    </SectionContainer>
  );
}