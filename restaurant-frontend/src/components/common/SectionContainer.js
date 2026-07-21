import { Paper, Typography } from "@mui/material";

export default function SectionContainer({ title, children }) {

  return (
    <Paper
      sx={{
        padding: 3,
        marginBottom: 3
      }}
    >

      <Typography variant="h5" sx={{ mb: 2 }}>
        {title}
      </Typography>

      {children}

    </Paper>
  );
}