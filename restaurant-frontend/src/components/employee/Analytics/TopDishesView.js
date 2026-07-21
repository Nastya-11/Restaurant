import { useState } from "react";
import api from "../../../api/axios";
import { Button, TextField, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";

export default function TopDishesView() {

  const [month, setMonth] = useState("");
  const [data, setData] = useState([]);

  const load = async () => {
    const res = await api.get("/top-dishes", {
        params: { month }
    });

    setData(res.data);
    };

  return (
    <div>

      <h3>Top Dishes</h3>

      <TextField
        label="Month"
        value={month}
        onChange={(e) => setMonth(e.target.value)}
      />

      <Button onClick={load}>Load</Button>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Dish</TableCell>
            <TableCell>Total</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {data.map((d, i) => (
            <TableRow key={i}>
              <TableCell>{d.name}</TableCell>
              <TableCell>{d.total}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

    </div>
  );
}