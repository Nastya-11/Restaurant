import { useState } from "react";
import api from "../../../api/axios";

import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Paper,
  TableContainer
} from "@mui/material";

export default function SuppliersView() {

  const [data, setData] = useState([]);

  const load = async () => {

  const res = await api.get("/suppliers-report");

  console.log(res.data);

  setData(res.data);
};
  return (
    <div style={{ padding: 20 }}>

      <Typography
        variant="h5"
        fontWeight={700}
        sx={{ mb: 2 }}
      >
        Suppliers Report
      </Typography>

      <Button
        variant="contained"
        onClick={load}
        sx={{
          mb: 3,
          borderRadius: 2,
          textTransform: "none"
        }}
      >
        Load Suppliers
      </Button>

      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 4,
          overflow: "hidden",
          boxShadow: "0 4px 20px rgba(0,0,0,0.05)"
        }}
      >

        <Table>

          <TableHead>

            <TableRow>

              <TableCell
                sx={{
                  fontWeight: 700,
                  backgroundColor: "#04250e",
                  color: "white"
                }}
              >
                Supplier
              </TableCell>

              <TableCell
                sx={{
                  fontWeight: 700,
                  backgroundColor: "#04250e",
                  color: "white"
                }}
              >
                Total Purchases
              </TableCell>

            </TableRow>

          </TableHead>

          <TableBody>

            {data.map((row, i) => (

              <TableRow
                key={i}
                hover
                sx={{
                  "&:nth-of-type(even)": {
                    backgroundColor: "#f9fafb"
                  }
                }}
              >

                <TableCell>
                  {row.supplier_name}
                </TableCell>

                <TableCell>
                  {row.total_purchases}
                </TableCell>

              </TableRow>

            ))}

          </TableBody>

        </Table>

      </TableContainer>

    </div>
  );
}