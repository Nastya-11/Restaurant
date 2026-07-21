import { useState } from "react";
import api from "../../../api/axios";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography
} from "@mui/material";

export default function FrequentCustomersView() {

  const [data, setData] = useState([]);

  const load = async () => {
    const res = await api.get("/frequent-customers");
    setData(res.data);
    };

  return (
    <div style={{ padding: 20 }}>

      <Typography variant="h6">
        Frequent Customers
      </Typography>

      <Button variant="contained" onClick={load} sx={{ my: 2 }}>
        Load
      </Button>

      <Table>

        <TableHead>
          <TableRow>
            <TableCell>Customer</TableCell>
            <TableCell>Visits</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {data.map((row, i) => (
            <TableRow key={i}>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.visits}</TableCell>
            </TableRow>
          ))}
        </TableBody>

      </Table>

    </div>
  );
}