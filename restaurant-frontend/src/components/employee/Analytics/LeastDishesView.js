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

export default function LeastDishesView() {

  const [days, setDays] = useState("");
  const [data, setData] = useState([]);

  const load = async () => {
    const res = await api.get("/least-dishes", {
      params: { days }
    });

    setData(res.data);
  };

  return (
    <div style={{ padding: 20 }}>

      <Typography variant="h6">
        Least Ordered Dishes
      </Typography>

      <TextField
        label="Days"
        value={days}
        onChange={(e) => setDays(e.target.value)}
        sx={{ mr: 2 }}
      />

      <Button variant="contained" onClick={load}>
        Load
      </Button>

      <Table sx={{ mt: 2 }}>

        <TableHead>
          <TableRow>
            <TableCell>Dish</TableCell>
            <TableCell>Total Ordered</TableCell>
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