import { useState } from "react";
import axios from "axios";
import { Button, TextField, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";

export default function ReservationsView() {

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [data, setData] = useState([]);

  const load = async () => {
    const res = await axios.get("http://localhost:5001/reserved", {
      params: { date, time }
    });

    setData(res.data);
  };

  return (
    <div>

      <h3>Reservations</h3>

      <TextField
        type="date"
        onChange={(e) => setDate(e.target.value)}
      />

      <TextField
        type="time"
        onChange={(e) => setTime(e.target.value)}
      />

      <Button onClick={load}>Load</Button>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Table</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {data.map((r, i) => (
            <TableRow key={i}>
              <TableCell>{r.table_number}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

    </div>
  );
}