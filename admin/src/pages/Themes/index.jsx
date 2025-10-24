import { Container } from "@mui/system";
import Navbar from "../../components/Navbar";
import { Typography } from "@mui/material";
import CustomSwiper from "../../components/CustomSwiper";
import SocialMediaConfig from "../../components/SocialMediaConfig";

const Themes = () => {
  return (
    <>
      <Navbar active="themes" />
      <Container
        disableGutters
        sx={{
          paddingLeft: "38px",
          paddingRight: "64px",
        }}
      >
        <div className="mt-3">
          <Typography variant="body1" color="text.primary">
            OVERVIEW
          </Typography>
          <Typography variant="h4" fontSize={26} fontWeight={500}>
            Cài Đặt Trang
          </Typography>
        </div>

        <CustomSwiper type="banner" />

        <SocialMediaConfig />
      </Container>
    </>
  );
};

export default Themes;
