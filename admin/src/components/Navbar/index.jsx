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
import MenuIcon from "@mui/icons-material/Menu";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import HomeIcon from "@mui/icons-material/Home";
import CheckroomIcon from "@mui/icons-material/Checkroom";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import DiscountIcon from "@mui/icons-material/Discount";
import WidgetsIcon from "@mui/icons-material/Widgets";
import PersonIcon from "@mui/icons-material/Person";
import ClearIcon from "@mui/icons-material/Clear";
import { Collapse, Slide } from "@mui/material";
import { Link, useLocation } from "react-router-dom";

const Navbar = ({ active = "products", link }) => {
  const [anchorNavbar, setAnchorNavbar] = useState(false);

  const [selectedIndex, setSelectedIndex] = useState(active);

  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
  };

  const handleOpenNavbar = () => {
    setAnchorNavbar(true);
  };

  const handleCloseNavbar = () => {
    setAnchorNavbar(false);
  };

  return (
    <Box
      sx={{
        background: "#FFFFFF",
        position: "sticky",
        top: 0,
        zIndex: 1100, // nổi trên content
      }}
    >
      <AppBar
        position="static"
        color="default"
        sx={{
          borderBottom: "0.5px solid #E5E8EC",
          boxShadow: 0,
          background: "#F9FAFB",
        }}
      >
        <Container sx={{ display: { xs: "none", sm: "block" } }}>
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

            {anchorNavbar ? (
              <Button
                onClick={handleCloseNavbar}
                sx={{
                  color: "black",
                  padding: 2,
                  display: { xs: "block", sm: "none" },
                }}
              >
                <ClearIcon />
              </Button>
            ) : (
              <Button
                onClick={handleOpenNavbar}
                sx={{
                  color: "black",
                  padding: 2,
                  display: { xs: "block", sm: "none" },
                }}
              >
                <MenuIcon />
              </Button>
            )}

            <Box flexGrow={1}></Box>

            <AvatarUser />
          </Toolbar>
        </Container>

        <Box sx={{ display: { xs: "block", sm: "none" } }}>
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

            {anchorNavbar ? (
              <Button
                onClick={handleCloseNavbar}
                sx={{
                  color: "black",
                  padding: 2,
                  display: { xs: "block", sm: "none" },
                }}
              >
                <ClearIcon />
              </Button>
            ) : (
              <Button
                onClick={handleOpenNavbar}
                sx={{
                  color: "black",
                  padding: 2,
                  display: { xs: "block", sm: "none" },
                }}
              >
                <MenuIcon />
              </Button>
            )}

            <Box flexGrow={1}></Box>

            <AvatarUser />
          </Toolbar>

          <Collapse sx={{ marginTop: 1 }} direction="down" in={anchorNavbar}>
            <List sx={{ bgcolor: "#f5f5f5", width: "100%" }}>
              <ListItem disablePadding>
                <ListItemButton
                  selected={selectedIndex === "home"}
                  onClick={(event) => {
                    handleListItemClick(event, 1);
                    handleCloseNavbar();
                  }}
                >
                  <ListItemIcon>
                    <HomeIcon />
                  </ListItemIcon>
                  <ListItemText primary="Trang Chủ" />
                </ListItemButton>
              </ListItem>

              <ListItem disablePadding>
                <ListItemButton
                  selected={selectedIndex === "products"}
                  onClick={(event) => {
                    handleListItemClick(event, 2);
                    handleCloseNavbar();
                  }}
                >
                  <ListItemIcon>
                    <CheckroomIcon />
                  </ListItemIcon>
                  <ListItemText primary="Sản Phẩm" />
                </ListItemButton>
              </ListItem>

              <ListItem disablePadding>
                <ListItemButton
                  selected={selectedIndex === "orders"}
                  onClick={(event) => {
                    handleListItemClick(event, 3);
                    handleCloseNavbar();
                  }}
                >
                  <ListItemIcon>
                    <ShoppingBagIcon />
                  </ListItemIcon>
                  <ListItemText primary="Đơn Hàng" />
                </ListItemButton>
              </ListItem>

              <ListItem disablePadding>
                <ListItemButton
                  selected={selectedIndex === "users"}
                  onClick={(event) => {
                    handleListItemClick(event, 4);
                    handleCloseNavbar();
                  }}
                >
                  <ListItemIcon>
                    <PersonIcon />
                  </ListItemIcon>
                  <ListItemText primary="Người Dùng" />
                </ListItemButton>
              </ListItem>

              <ListItem disablePadding>
                <ListItemButton
                  selected={selectedIndex === "coupon"}
                  onClick={(event) => {
                    handleListItemClick(event, 5);
                    handleCloseNavbar();
                  }}
                >
                  <ListItemIcon>
                    <DiscountIcon />
                  </ListItemIcon>
                  <ListItemText primary="Coupon" />
                </ListItemButton>
              </ListItem>

              <ListItem disablePadding>
                <ListItemButton
                  selected={selectedIndex === "theme"}
                  onClick={(event) => {
                    handleListItemClick(event, 6);
                    handleCloseNavbar();
                  }}
                >
                  <ListItemIcon>
                    <WidgetsIcon />
                  </ListItemIcon>
                  <ListItemText primary="Cài Đặt Theme" />
                </ListItemButton>
              </ListItem>
            </List>
          </Collapse>
        </Box>
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
          <Box
            sx={{ display: { xs: "none", sm: "flex" }, position: "relative" }}
          >
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

function renderPath(label) {
  switch (label) {
    case "Trang Chủ":
      return "/admin/home";
    case "Sản Phẩm":
      return "/admin/products";
    case "Đơn Hàng":
      return "/admin/orders";
    case "Người Dùng":
      return "/admin/users";
    case "Coupon":
      return "/admin/coupon";
    case "Cài Đặt Theme":
      return "/admin/themes";
    default:
      return "/404"; // hoặc "#"
  }
}

function ButtonNavbar({ label }) {
  const location = useLocation();
  const path = renderPath(label);
  const isActive = location.pathname === path;

  return (
    <Button
      component={Link}
      to={path}
      sx={{
        color: isActive ? "primary.main" : "#374151",
        textTransform: "none",
        padding: "15px",
        fontWeight: isActive ? "bold" : "normal",
      }}
    >
      <Typography variant="body1" sx={{ whiteSpace: "nowrap" }}>
        {label}
      </Typography>
    </Button>
  );
}

export default Navbar;
