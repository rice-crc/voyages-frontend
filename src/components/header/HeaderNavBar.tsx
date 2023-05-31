import { MouseEventHandler, useState } from "react";
import {
  AppBar,
  Box,
  CssBaseline,
  List,
  IconButton,
  Hidden,
} from "@mui/material";

import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import { StyleDiver } from "@/styleMUI";
import { Button, Menu, MenuItem, Typography } from "@mui/material";
import FilterICON from "@/assets/filterICON.svg";
import "@/style/Nav.scss";
import { HeaderNavBarMenuProps } from "@/share/InterfaceTypeNav";

const navItems = ["About", "Vessels", "Itinerary", "Collections"];

export default function HeaderNavBarMenu(props: HeaderNavBarMenuProps) {
  const { isFilter, setIsFilter } = props;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuOpen: MouseEventHandler<HTMLButtonElement> = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleSelectMentu = (name: string) => {
    handleMenuClose();
  };

  const drawer = (
    <Box>
      <List>
        {navItems.map((item) => (
          <ListItem key={item} disablePadding>
            <ListItemButton sx={{ textAlign: "center", fontSize: "16px" }}>
              <ListItemText primary={item} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box
      sx={{
        display: "flex",
      }}
    >
      <CssBaseline />
      <AppBar
        position="static"
        component="nav"
        style={{
          backgroundColor: "transparent",
          color: "black",
          fontSize: 12,
          boxShadow: "none",
          marginTop: "4.5rem",
        }}
      >
        <Toolbar sx={{ alignItems: "center" }}>
          <Hidden smUp>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={handleMenuOpen}
              sx={{ mr: 2, display: { sm: "none" } }}
            >
              <MenuIcon />
            </IconButton>
          </Hidden>
          <Typography
            variant="h6"
            component="div"
            sx={{
              flexGrow: 1,
              display: { xs: "none", sm: "block", md: "block" },
            }}
          >
            <div
              className="header-logo-text"
              onClick={() => {
                console.log("go to HOME");
              }}
            >
              Voyages Database
            </div>
            <StyleDiver />
            <Typography
              component="div"
              variant="body1"
              fontWeight="500"
              sx={{
                cursor: "pointer",
                alignItems: "center",
                display: "flex",
                margin: "10px 0",
                fontSize: 24,
                fontWeight: 500,
              }}
              onClick={() => setIsFilter(!isFilter)}
            >
              <img src={FilterICON} alt="logo" />
              <div> Filter Search</div>
            </Typography>
          </Typography>
          <Box
            sx={{
              display: {
                xs: "none",
                sm: "none",
                md: "block",
                paddingRight: 40,
              },
            }}
          >
            {navItems.map((item) => (
              <Button
                key={item}
                sx={{
                  color: "#000",
                  fontWeight: 500,
                  textTransform: "none",
                  fontSize: 22,
                }}
              >
                {item}
              </Button>
            ))}
          </Box>
        </Toolbar>
        <Box component="nav">
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            sx={{
              display: { xs: "block", sm: "none", md: "block" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
              },
            }}
          >
            <MenuItem onClick={() => handleSelectMentu("home")}>
              {drawer}
            </MenuItem>
          </Menu>
        </Box>
      </AppBar>
    </Box>
  );
}
