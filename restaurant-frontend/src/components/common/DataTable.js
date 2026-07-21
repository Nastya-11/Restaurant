import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box
} from "@mui/material";

export default function DataTable({ data, title }) {

  if (!data || data.length === 0) {
    return (
      <Paper
        elevation={0}
        sx={{
          p: 4,
          borderRadius: 4,
          textAlign: "center",
          mt: 2
        }}
      >
        <Typography variant="h6">
          No data available
        </Typography>
      </Paper>
    );
  }

  const columns = Object.keys(data[0]);

  return (
    <Paper
      elevation={0}
      sx={{
        mt: 2,
        borderRadius: 4,
        overflow: "hidden",
        border: "1px solid #e5e7eb"
      }}
    >

      {title && (
        <Box
          sx={{
            p: 3,
            borderBottom: "1px solid #e5e7eb",
            backgroundColor: "#f9fafb"
          }}
        >
          <Typography variant="h6" fontWeight={700}>
            {title}
          </Typography>
        </Box>
      )}

      <TableContainer sx={{ maxHeight: "70vh" }}>
        <Table stickyHeader>

          <TableHead>
            <TableRow>
              {columns.map((col) => (
                <TableCell
                  key={col}
                  sx={{
                    backgroundColor: "#04250e",
                    color: "white",
                    fontWeight: 700,
                    fontSize: 14,
                    textTransform: "uppercase",
                    borderBottom: "none"
                  }}
                >
                  {col.replaceAll("_", " ")}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>

            {data.map((row, index) => {

              const isMissing = row.status === "missing";

              return (
                <TableRow
                  key={index}
                  hover
                  sx={{
                    backgroundColor: isMissing ? "#fee2e2" : undefined, // 🔴 червоний фон
                    transition: "0.2s",

                    "&:nth-of-type(even)": {
                      backgroundColor: isMissing ? "#fee2e2" : "#f9fafb"
                    },

                    "&:hover": {
                      backgroundColor: isMissing ? "#fecaca" : "#eef2ff"
                    }
                  }}
                >
                  {columns.map((col) => (
                    <TableCell
                      key={col}
                      sx={{
                        fontSize: 14,
                        borderBottom: "1px solid #f1f5f9",
                        fontWeight: col === "status" && isMissing ? 700 : 400,
                        color: col === "status" && isMissing ? "#b91c1c" : "inherit"
                      }}
                    >
                      {row[col]}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}

          </TableBody>

        </Table>
      </TableContainer>

    </Paper>
  );
}