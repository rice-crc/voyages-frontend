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
import { RootState } from "@/redux/store";
import { HeaderNavBarMenuProps } from "@/share/InterfaceTypes";
import CanscandingMenu from "../canscanding/CanscandingMenu";
import { useSelector } from "react-redux";
import { currentPageInitialState } from "@/share/InterfaceTypes";
import "@/style/Nav.scss";

const navItems = ["About", "Vessels", "Itinerary", "Collections"];

export default function HeaderNavBarMenu(props: HeaderNavBarMenuProps) {
  const { currentPage } = useSelector(
    (state: RootState) => state.getScrollPage as currentPageInitialState
  );
  const { isFilter, setIsFilter } = props;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuOpen: MouseEventHandler<HTMLButtonElement> = (event) => {
    console.log("anchorEl", anchorEl);
    setAnchorEl(event.currentTarget);
  };

  const handleSelectMenu = (name: string) => {
    console.log("name", name);
    handleMenuClose();
  };

  const drawer = (
    <Box>
      <List>
        {navItems.map((item) => (
          <ListItem
            key={item}
            disablePadding
            onClick={() => handleSelectMenu(item)}
          >
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
        component="nav"
        style={{
          backgroundColor: "#93D0CB",
          color: "black",
          fontSize: 12,
          boxShadow: "none",
          marginTop: "2.5rem",
        }}
      >
        <Toolbar sx={{ alignItems: "center" }}>
          <Hidden mdUp>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={handleMenuOpen}
              sx={{ mr: 2, display: { md: "none" } }}
            >
              <MenuIcon />
            </IconButton>
          </Hidden>
          <Typography
            component="div"
            sx={{
              flexGrow: 1,
              color: "#000000",
              fontWeight: 500,
              fontSize: { xs: 20, sm: 40, md: 60 },
            }}
          >
            <div
              onClick={() => {
                console.log("go to HOME");
              }}
            >
              Voyages Database
            </div>
            <StyleDiver />
            <Hidden mdDown>
              <Typography
                component="div"
                variant="body1"
                fontWeight="500"
                sx={{
                  cursor: "pointer",
                  alignItems: "center",
                  display: "flex",
                  margin: "10px 0",
                  fontSize: 20,
                  fontWeight: 600,
                }}
                onClick={() => setIsFilter(!isFilter)}
              >
                {currentPage !== 1 && (
                  <>
                    <img src={FilterICON} alt="logo" />
                    <div> Filter Search</div>
                  </>
                )}
              </Typography>
            </Hidden>
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
                  fontWeight: 600,
                  textTransform: "none",
                  fontSize: 20,
                }}
              >
                {item}
              </Button>
            ))}
          </Box>
        </Toolbar>
        <Hidden mdDown>
          {isFilter && <CanscandingMenu isFilter={isFilter} />}
        </Hidden>
        <Box component="nav">
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            sx={{
              display: { xs: "block", sm: "block", md: "none" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
              },
            }}
          >
            <MenuItem>{drawer}</MenuItem>
          </Menu>
        </Box>
      </AppBar>
    </Box>
  );
}
