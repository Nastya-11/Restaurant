import { useState } from "react";
import api from "../../../api/axios";
import {
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography
} from "@mui/material";

export default function TopClientsView() {

  const [form, setForm] = useState({
    start: "",
    end: "",
    min: ""
  });

  const [data, setData] = useState([]);

  const load = async () => {
    const res = await api.get("/top-clients", {
        params: {
        start: form.start,
        end: form.end,
        min: form.min
        }
    });

    setData(res.data);
    };

  return (
    <div style={{ padding: 20 }}>

      <Typography variant="h6">
        Top Clients
      </Typography>

      <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>

        <TextField
          type="date"
          label="Start"
          InputLabelProps={{ shrink: true }}
          onChange={(e) =>
            setForm({ ...form, start: e.target.value })
          }
        />

        <TextField
          type="date"
          label="End"
          InputLabelProps={{ shrink: true }}
          onChange={(e) =>
            setForm({ ...form, end: e.target.value })
          }
        />

        <TextField
          label="Min amount"
          onChange={(e) =>
            setForm({ ...form, min: e.target.value })
          }
        />

        <Button variant="contained" onClick={load}>
          Load
        </Button>

      </div>

      <Table>

        <TableHead>
          <TableRow>
            <TableCell>Client</TableCell>
            <TableCell>Total spent</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {data.map((row, i) => (
            <TableRow key={i}>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.total}</TableCell>
            </TableRow>
          ))}
        </TableBody>

      </Table>

    </div>
  );
}