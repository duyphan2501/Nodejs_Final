import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import Button from "@mui/material/Button";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AvatarPNG from "../../assets/avatar.png";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import { useState } from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Container from "@mui/material/Container";

const Navbar = ({ active = "products", link }) => {
  return (
    <Box sx={{ background: "#FFFFFF" }}>
      <AppBar
        position="static"
        color="default"
        sx={{
          borderBottom: "0.5px solid #E5E8EC",
          boxShadow: 0,
          background: "#F9FAFB",
        }}
      >
        <Container>
          <Toolbar>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{
                mr: 2,
                color: "black",
                display: { xs: "none", sm: "block" },
              }}
            >
              Tabler
            </Typography>

            <Box flexGrow={1}></Box>

            <Button color="black" sx={{ opacity: 0.8 }}>
              <NotificationsNoneIcon />
            </Button>

            <AvatarUser />
          </Toolbar>
        </Container>
      </AppBar>
      <AppBar
        position="static"
        color="default"
        sx={{
          borderBottom: "0.5px solid #E5E8EC",
          boxShadow: 0,
          marginTop: "2px",
          background: "#F9FAFB",
        }}
      >
        <Container>
          <Box sx={{ position: "relative" }}>
            <Toolbar disableGutters sx={{ paddingLeft: "10px" }}>
              <ButtonNavbar label={"Trang Chủ"} />
              <ButtonNavbar label={"Sản Phẩm"} />
              <ButtonNavbar label={"Đơn Hàng"} />
              <ButtonNavbar label={"Người Dùng"} />
              <ButtonNavbar label={"Coupon"} />
              <ButtonNavbar label={"Cài Đặt Theme"} />
            </Toolbar>
            {active === "home" ? (
              <Box
                sx={{
                  position: "absolute",
                  bottom: 0,
                  left: 14,
                  height: "2px",
                  width: "105px",
                  bgcolor: "blue",
                  transition: "all 0.3s ease",
                }}
              />
            ) : active === "products" ? (
              <Box
                sx={{
                  position: "absolute",
                  bottom: 0,
                  left: 120,
                  height: "2px",
                  width: "106px",
                  bgcolor: "blue",
                  transition: "all 0.3s ease",
                }}
              />
            ) : active === "orders" ? (
              <Box
                sx={{
                  position: "absolute",
                  bottom: 0,
                  left: 228,
                  height: "2px",
                  width: "106px",
                  bgcolor: "blue",
                  transition: "all 0.3s ease",
                }}
              />
            ) : active === "users" ? (
              <Box
                sx={{
                  position: "absolute",
                  bottom: 0,
                  left: 335,
                  height: "2px",
                  width: "118px",
                  bgcolor: "blue",
                  transition: "all 0.3s ease",
                }}
              />
            ) : active === "theme" ? (
              <Box
                sx={{
                  position: "absolute",
                  bottom: 0,
                  left: 546,
                  height: "2px",
                  width: "146px",
                  bgcolor: "blue",
                  transition: "all 0.3s ease",
                }}
              />
            ) : active === "coupon" ? (
              <Box
                sx={{
                  position: "absolute",
                  bottom: 0,
                  left: 455,
                  height: "2px",
                  width: "90px",
                  bgcolor: "blue",
                  transition: "all 0.3s ease",
                }}
              />
            ) : null}
          </Box>
        </Container>
      </AppBar>
    </Box>
  );
};

function AvatarUser() {
  const [anchorEl, setAnchorE1] = useState(null);

  const handleOpenMenu = (event) => {
    setAnchorE1(event.currentTarget);
  };

  const handleCloseMenu = (event) => {
    setAnchorE1(null);
  };
  return (
    <>
      <Tooltip title="Open settings">
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            cursor: "pointer",
          }}
          onClick={handleOpenMenu}
        >
          <Avatar
            alt="Paweł Kuna"
            src="https://i.pravatar.cc/40"
            sx={{ width: 40, height: 40 }}
          />

          <Box sx={{ display: { xs: "none", sm: "block" } }}>
            <Typography variant="h6" sx={{ lineHeight: 1 }}>
              Tran Thanh Liem
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Administrator
            </Typography>
          </Box>
        </Box>
      </Tooltip>
      <Menu
        sx={{ mt: "45px" }}
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top", // menu xuất hiện từ top
          horizontal: "right", // căn phải
        }}
        PaperProps={{
          sx: {
            width: anchorEl ? anchorEl.offsetWidth : "auto",
            minWidth: 200,
          },
        }}
      >
        <MenuItem onClick={handleCloseMenu}>Cá nhân</MenuItem>
        <MenuItem onClick={handleCloseMenu}>Đăng xuất</MenuItem>
      </Menu>
    </>
  );
}

function ButtonNavbar({ label }) {
  return (
    <>
      <Button
        sx={{
          color: "#374151",
          height: "",
          textTransform: "none",
          padding: "15px",
        }}
      >
        <Typography variant="body1">{label}</Typography>
      </Button>
    </>
  );
}

export default Navbar;
