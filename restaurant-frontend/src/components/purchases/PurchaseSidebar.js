import {
  List,
  ListItemButton,
  ListItemText,
  Paper,
  Typography,
  Box,
  Divider
} from "@mui/material";

export default function PurchaseSidebar({ selected, setSelected }) {

  const menu = [
    { key: "history", label: "Purchases History" },
    { key: "create", label: "New Purchase" },
    { key: "suppliers", label: "Suppliers" },
    { key: "ingredients", label: "Ingredients" }
  ];

  return (
    <Paper
      elevation={3}
      sx={{
        width: 240,
        minHeight: "100vh",
        borderRadius: 0,
        background: "#3d0c0c",
        color: "white"
      }}
    >

      <Box sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          Purchases
        </Typography>

        <Typography variant="caption" sx={{ opacity: 0.7 }}>
          Admin Panel
        </Typography>
      </Box>

      <Divider sx={{ borderColor: "rgba(255,255,255,0.1)" }} />

      <List sx={{ mt: 1 }}>

        {menu.map(item => (
          <ListItemButton
            key={item.key}
            selected={selected === item.key}
            onClick={() => setSelected(item.key)}
            sx={{
              mx: 1,
              borderRadius: 2,
              mb: 1,
              color: "white",
              "&.Mui-selected": {
                backgroundColor: "#0d8932",
                "&:hover": {
                  backgroundColor: "#61a47a"
                }
              },
              "&:hover": {
                backgroundColor: "rgba(255,255,255,0.08)"
              }
            }}
          >
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}

      </List>

    </Paper>
  );
}