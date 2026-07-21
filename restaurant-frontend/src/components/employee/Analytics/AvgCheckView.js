import { useState } from "react";

import {
  TextField,
  Button
} from "@mui/material";

import api from "../../../api/axios";

import DataTable from "../../common/DataTable";
import SectionContainer from "../../common/SectionContainer";

export default function AvgCheckView() {

  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  const [data, setData] = useState([]);

  const loadData = async () => {

    const res = await api.get("/avg-check", {
      params: {
        start,
        end
      }
    });

    setData(res.data);
  };

  return (
    <SectionContainer title="Average Check">

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
        onClick={loadData}
      >
        Load
      </Button>

      <DataTable data={data} />

    </SectionContainer>
  );
}