import React from "react";
import { Hidden } from "@mui/material";

import CanscandingMenu from "../canscanding/CanscandingMenu";
import { NavProps } from "@/share/InterfaceTypeNav";

function NavBar(props: NavProps) {
  const { isFilter } = props;
  return (
    <Hidden smDown>
      {isFilter && <CanscandingMenu isFilter={isFilter} />}
    </Hidden>
  );
}

export default NavBar;
