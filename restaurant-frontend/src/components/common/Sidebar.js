import {
  List,
  ListItemButton,
  ListItemText,
  Typography,
  Box,
  Divider
} from "@mui/material";

export default function Sidebar({
  menu,
  selected,
  setSelected
}) {

  return (
    <Box
      sx={{
        width: 280,
        minHeight: "100vh",
        backgroundColor: "#3d0c0c",
        color: "white",
        display: "flex",
        flexDirection: "column",
        position: "sticky",
        top: 0,
        padding: 3
      }}
    >

      {/* LOGO / TITLE */}
      <Box sx={{ mb: 4 }}>

        <Typography
          variant="h5"
          fontWeight={700}
        >
          Restaurant
        </Typography>

        <Typography
          sx={{
            color: "#9ca3af",
            mt: 1,
            fontSize: 14
          }}
        >
          Management System
        </Typography>

      </Box>

      <Divider
        sx={{
          backgroundColor: "#374151",
          mb: 3
        }}
      />

      {/* MENU */}
      <List
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1
        }}
      >

        {menu.map((item) => {

          const active = selected === item.key;

          return (
            <ListItemButton
              key={item.key}
              onClick={() => setSelected(item.key)}
              sx={{
                borderRadius: 3,

                paddingY: 1.4,
                paddingX: 2,

                backgroundColor: active
                  ? "#0d8932"
                  : "transparent",

                transition: "0.2s",

                "&:hover": {
                  backgroundColor: active
                    ? "#0d8932"
                    : "#61a47a"
                }
              }}
            >

              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  fontSize: 15,
                  fontWeight: active ? 700 : 500
                }}
              />

            </ListItemButton>
          );
        })}

      </List>

      {/* FOOTER */}
      <Box sx={{ mt: "auto", pt: 4 }}>

        <Divider
          sx={{
            backgroundColor: "#374151",
            mb: 2
          }}
        />

        <Typography
          sx={{
            color: "#9ca3af",
            fontSize: 13
          }}
        >
          Restaurant Management System
        </Typography>

      </Box>

    </Box>
  );
}