import { RootState } from "@/redux/store";
import { Box, Grid } from "@mui/material";
import { useSelector } from "react-redux";
import HeaderLogoSearch from "../header/HeaderSearchLogo";
import NavBarPeople from "./Header/NavBarPeople";
import PersonImage from "@/assets/personImg.png";
import "@/style/page-pase.scss";

const PastPeoplePage = () => {
  const { styleName, textIntroduce } = useSelector(
    (state: RootState) => state.getDataSetCollection
  );
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  return (
    <>
      <HeaderLogoSearch />
      <NavBarPeople />
      <div className="page" id="main-page-past-home">
        <Box
          sx={{
            flexGrow: 1,
            marginTop: {
              sm: "2rem",
              md: "8%",
            },
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={4} className="grid-people-image">
              <img
                className="flipped-image"
                src={PersonImage}
                alt="PersonImage"
              />
            </Grid>
            <Grid item xs={8} className="grid-people-introduction">
              <div>
                During the last 60 years of the trans-Atlantic slave trade,
                courts around the Atlantic basins condemned over two thousand
                vessels for engaging in the traffic and recorded the details of
                captives found on board including their African names. The
                African Names Database was created from these records, now
                located in the Registers of Liberated Africans at the Sierra
                Leone National Archives, Freetown. Links are provided to the
                ships in the Voyages Database from which the liberated Africans
                were rescued, as well as to the African Origins site where users
                can hear the names pronounced and help us identify the languages
                in which they think the names are used.
              </div>
              <div>The People Database is organized into two collections:</div>
            </Grid>
          </Grid>
        </Box>

        <div className="credit-bottom-right">{`Credit: Artist Name ${currentYear}`}</div>
      </div>
    </>
  );
};

export default PastPeoplePage;
