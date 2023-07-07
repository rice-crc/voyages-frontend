import { Box, Grid } from "@mui/material";
import PersonImage from "@/assets/personImg.png";
import PEOPLE from "@/utils/peopel_page_data.json";
import "@/style/page-pase.scss";
import { Link } from "react-router-dom";
import HeaderLogoSearch from "@/components/header/HeaderSearchLogo";
import HeaderEnslavedNavBar from "./Header/HeaderEnslavedNavBar";

const EnslavedPage = () => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  return (
    <>
      <HeaderLogoSearch />
      <HeaderEnslavedNavBar />
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
              {PEOPLE.map((item, index) => (
                <div key={index}>
                  <div>{item.text_introuduce}</div>
                  <div>{item.text_description}</div>
                </div>
              ))}
              <div className="btn-Enslaved-enslavers">
                <Link to="/past/enslaved" style={{ textDecoration: "none" }}>
                  <div className="enslaved-btn">Enslaved</div>
                </Link>
                <Link to="/past/enslaver" style={{ textDecoration: "none" }}>
                  <div className="enslavers-btn">Enslavers</div>
                </Link>
              </div>
            </Grid>
          </Grid>
        </Box>

        <div className="credit-bottom-right">{`Credit: Artist Name ${currentYear}`}</div>
      </div>
    </>
  );
};

export default EnslavedPage;
