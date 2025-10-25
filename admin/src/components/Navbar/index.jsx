import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
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
import HomeIcon from "@mui/icons-material/Home";
import CheckroomIcon from "@mui/icons-material/Checkroom";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import DiscountIcon from "@mui/icons-material/Discount";
import WidgetsIcon from "@mui/icons-material/Widgets";
import PersonIcon from "@mui/icons-material/Person";
import ClearIcon from "@mui/icons-material/Clear";
import CategoryIcon from "@mui/icons-material/Category";
import { Collapse } from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [anchorNavbar, setAnchorNavbar] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleOpenNavbar = () => setAnchorNavbar(true);
  const handleCloseNavbar = () => setAnchorNavbar(false);

  // Danh sách các mục menu
  const menuItems = [
    { label: "Trang Chủ", path: "/admin/home", icon: <HomeIcon /> },
    { label: "Sản Phẩm", path: "/admin/products", icon: <CheckroomIcon /> },
    { label: "Danh Mục", path: "/admin/category", icon: <CategoryIcon /> },
    { label: "Đơn Hàng", path: "/admin/orders", icon: <ShoppingBagIcon /> },
    { label: "Người Dùng", path: "/admin/users", icon: <PersonIcon /> },
    { label: "Coupon", path: "/admin/coupon", icon: <DiscountIcon /> },
    { label: "Cài Đặt Theme", path: "/admin/themes", icon: <WidgetsIcon /> },
  ];

  return (
    <Box
      sx={{
        background: "#FFFFFF",
        position: "sticky",
        top: 0,
        zIndex: 1100,
      }}
    >
      {/* AppBar chính */}
      <AppBar
        position="static"
        color="default"
        sx={{
          borderBottom: "0.5px solid #E5E8EC",
          boxShadow: 0,
          background: "#F9FAFB",
        }}
      >
        {/* Desktop Navbar */}
        <Container sx={{ display: { xs: "none", sm: "block" } }}>
          <Toolbar>
            <Typography
              variant="h6"
              noWrap
              sx={{ mr: 2, color: "black", fontWeight: "bold" }}
            >
              Admin Control
            </Typography>
            <Box flexGrow={1}></Box>
            <AvatarUser />
          </Toolbar>
        </Container>

        {/* Mobile Navbar */}
        <Box sx={{ display: { xs: "block", sm: "none" } }}>
          <Toolbar>
            <Typography
              variant="h6"
              noWrap
              sx={{ color: "black", fontWeight: "bold", flexGrow: 1 }}
            >
              Tabler
            </Typography>

            <IconButton
              onClick={anchorNavbar ? handleCloseNavbar : handleOpenNavbar}
            >
              {anchorNavbar ? <ClearIcon /> : <MenuIcon />}
            </IconButton>
          </Toolbar>

          {/* Danh sách menu khi mở */}
          <Collapse sx={{ marginTop: 1 }} direction="down" in={anchorNavbar}>
            <List sx={{ bgcolor: "#f5f5f5", width: "100%" }}>
              {menuItems.map((item) => (
                <ListItem key={item.path} disablePadding>
                  <ListItemButton
                    component={Link}
                    to={item.path}
                    selected={location.pathname === item.path}
                    onClick={() => handleCloseNavbar()}
                  >
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.label} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Collapse>
        </Box>
      </AppBar>

      {/* Thanh dưới cho desktop */}
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
              {menuItems.map((item) => (
                <ButtonNavbar
                  key={item.path}
                  label={item.label}
                  path={item.path}
                />
              ))}
            </Toolbar>
          </Box>
        </Container>
      </AppBar>
    </Box>
  );
};

function AvatarUser() {
  const [anchorEl, setAnchorEl] = useState(null);
  const handleOpenMenu = (event) => setAnchorEl(event.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);

  return (
    <>
      <Tooltip title="Tài khoản">
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
            alt="Admin"
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
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
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

function ButtonNavbar({ label, path }) {
  const location = useLocation();
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
