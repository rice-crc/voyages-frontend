import { AppBar, Box, CssBaseline, Typography, Toolbar } from "@mui/material";
import { WHITE } from "@/styleMUI";
import LOGOVoyages from "@/assets/sv-logo_v2.svg";
import SearchVoyages from "@/assets/searchICON.svg";

export default function HeaderLogoSearch() {
  return (
    <Box>
      <CssBaseline />
      <AppBar
        component="nav"
        style={{
          backgroundColor: WHITE,
          zIndex: 2000,
          boxShadow: "none",
          height: 50,
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography component="div" sx={{ cursor: "pointer" }}>
            <img
              src={LOGOVoyages}
              alt="logo"
              style={{ position: "relative", bottom: 5 }}
            />
          </Typography>

          <Typography component="div" sx={{ cursor: "pointer" }}>
            <img src={SearchVoyages} alt="search" height={40} />
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
