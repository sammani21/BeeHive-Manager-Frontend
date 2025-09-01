import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonIcon from "@mui/icons-material/Person";
import HiveIcon from "@mui/icons-material/Hive";
import StorefrontIcon from "@mui/icons-material/Storefront";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import Badge from "@mui/material/Badge";
import Popover from "@mui/material/Popover";
import Menu from "@mui/material/Menu";
import { Link, useNavigate } from "react-router-dom";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
  Avatar,
  alpha,
  useMediaQuery,
} from "@mui/material";
import BHMLogo from "../assets/BHM_logo.jpg";
import { getAuth, signOut } from "firebase/auth";

const drawerWidth = 260;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  backgroundColor: "#000000",
  color: "#FFFFFF",
  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 2),
  ...theme.mixins.toolbar,
  justifyContent: "space-between",
  backgroundColor: "#ffffffff",
}));

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const NotificationBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: "#FFB700",
    color: "#000",
    fontWeight: "bold",
  },
}));

const StyledListItemButton = styled(ListItemButton)(({ theme }) => ({
  borderRadius: theme.spacing(1),
  margin: theme.spacing(0.5, 1),
  color: "#FFFFFF",
  "&:hover": {
    backgroundColor: alpha("#000000", 0.15),
  },
  "&.Mui-selected": {
    backgroundColor: "#000000",
    color: "#FFB700",
    "&:hover": {
      backgroundColor: alpha("#000000", 0.8),
    },
    "& .MuiListItemIcon-root": {
      color: "#FFB700",
    },
  },
}));

export default function NavigationBar() {
  const theme = useTheme();
   const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [open, setOpen] = React.useState(true);
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const [notificationAnchorEl, setNotificationAnchorEl] =
    React.useState<HTMLElement | null>(null);
  const [logoutDialogOpen, setLogoutDialogOpen] = React.useState(false);
  const navigate = useNavigate();

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationClick = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchorEl(null);
  };

  const openNotification = Boolean(notificationAnchorEl);

  const handleLogout = () => {
    setLogoutDialogOpen(true);
  };

  const handleCloseLogoutDialog = () => {
    setLogoutDialogOpen(false);
  };

  const handleLogout1 = () => {
    // clear any auth tokens / session here if needed
    localStorage.removeItem("token"); // example
    navigate("/login"); // redirect to login page
  };

  const notifications = [
    { id: 1, text: "New hive inspection required", time: "10 mins ago" },
    { id: 2, text: "Honey harvest ready", time: "1 hour ago" },
    { id: 3, text: "New beekeeper registered", time: "2 hours ago" },
    { id: 4, text: "Weekly report generated", time: "1 day ago" },
  ];

  React.useEffect(() => {
    // Adjust drawer state based on screen size
    setOpen(!isMobile);
  }, [isMobile]);

  return (
    <Box sx={{ display: "flex", height: "100%" }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: "none" }) }}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
            <img
              src={BHMLogo}
              alt="BHM Logo"
              style={{ height: "40px", marginRight: "12px" }}
            />
            
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton
              size="large"
              color="inherit"
              aria-label="notifications"
              onClick={handleNotificationClick}
            >
              <NotificationBadge badgeContent={4} color="secondary">
                <NotificationsActiveIcon />
              </NotificationBadge>
            </IconButton>
            <Popover
              open={openNotification}
              anchorEl={notificationAnchorEl}
              onClose={handleNotificationClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              PaperProps={{
                sx: { width: 360, p: 2 },
              }}
            >
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Notifications
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ maxHeight: 300, overflow: "auto" }}>
                {notifications.map((notification) => (
                  <Box
                    key={notification.id}
                    sx={{
                      p: 1.5,
                      mb: 1,
                      borderRadius: 2,
                      backgroundColor: alpha("#FFB700", 0.1),
                      cursor: "pointer",
                      "&:hover": {
                        backgroundColor: alpha("#FFB700", 0.2),
                      },
                    }}
                  >
                    <Typography variant="body2" fontWeight="medium">
                      {notification.text}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      display="block"
                    >
                      {notification.time}
                    </Typography>
                  </Box>
                ))}
              </Box>
              <Button
                fullWidth
                variant="text"
                sx={{ mt: 1, color: "#FFB700", fontWeight: "bold" }}
              >
                View All Notifications
              </Button>
            </Popover>
            <IconButton
              size="large"
              aria-label="account"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <Avatar sx={{ width: 36, height: 36, bgcolor: "#FFB700" }}>
                <AccountCircleIcon />
              </Avatar>
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              PaperProps={{
                sx: {
                  mt: 1.5,
                  minWidth: 180,
                  borderRadius: 2,
                  boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                },
              }}
            >
              <Box sx={{ px: 2, py: 1 }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  A005
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Admin User
                </Typography>
              </Box>
              <Divider />
              <ListItemButton
                component={Link}
                to="/manage-profile"
                onClick={handleClose}
                sx={{ borderRadius: 1, mx: 1, mt: 1 }}
              >
                <ListItemText primary="Manage Profile" />
              </ListItemButton>
              <ListItemButton
                onClick={handleLogout}
                sx={{ borderRadius: 1, mx: 1, mb: 1 }}
              >
                <ListItemText primary="Logout" />
              </ListItemButton>
            </Menu>
            <Dialog
              open={logoutDialogOpen}
              onClose={handleCloseLogoutDialog}
              PaperProps={{
                sx: { borderRadius: 3 },
              }}
            >
              <DialogTitle fontWeight="bold">Logout Confirmation</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Are you sure you want to logout from BeeHive Manager?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={handleCloseLogoutDialog}
                  variant="outlined"
                  sx={{ borderRadius: 2 }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleLogout1}
                  color="primary"
                  variant="contained"
                  sx={{
                    borderRadius: 2,
                    backgroundColor: "#FFB700",
                    "&:hover": {
                      backgroundColor: "#CC9200",
                    },
                  }}
                >
                  Logout
                </Button>
              </DialogActions>
            </Dialog>
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            backgroundColor: "#FFB700",
            color: "#FFFFFF",
            border: "none",
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
            <Typography variant="h6" fontWeight="bold" color="#000">
              Welcome!
            </Typography>
            <Typography variant="body2" color="#000">
              A005
            </Typography>
          </Box>
          <IconButton onClick={handleDrawerClose} sx={{ color: "#000" }}>
            {theme.direction === "ltr" ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider sx={{ borderColor: alpha("#FFF", 0.2) }} />
        <List sx={{ px: 1, py: 2 }}>
          <StyledListItemButton
            component={Link}
            to="/dashboard"
            sx={{ mb: 1 }}
          >
            <ListItemIcon sx={{ color: "inherit" }}>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </StyledListItemButton>

          <StyledListItemButton
            component={Link}
            to="/beekeepers"
            sx={{ mb: 1 }}
          >
            <ListItemIcon sx={{ color: "inherit" }}>
              <PersonIcon />
            </ListItemIcon>
            <ListItemText primary="Bee Keepers" />
          </StyledListItemButton>

          <StyledListItemButton
            component={Link}
            to="/hives"
            sx={{ mb: 1 }}
          >
            <ListItemIcon sx={{ color: "inherit" }}>
              <HiveIcon />
            </ListItemIcon>
            <ListItemText primary="Hives" />
          </StyledListItemButton>

          <StyledListItemButton
            component={Link}
            to="/products"
            sx={{ mb: 1 }}
          >
            <ListItemIcon sx={{ color: "inherit" }}>
              <StorefrontIcon />
            </ListItemIcon>
            <ListItemText primary="Products" />
          </StyledListItemButton>

          <StyledListItemButton
            component={Link}
            to="/recommendation"
            sx={{ mb: 1 }}
          >
            <ListItemIcon sx={{ color: "inherit" }}>
              <PersonIcon />
            </ListItemIcon>
            <ListItemText primary="Recommendation" />
          </StyledListItemButton>

          <StyledListItemButton component={Link} to="/manage-profile">
            <ListItemIcon sx={{ color: "inherit" }}>
              <AccountCircleIcon />
            </ListItemIcon>
            <ListItemText primary="Profile" />
          </StyledListItemButton>
        </List>
        <Box sx={{ mt: 'auto', p: 2 }}>
          <Divider sx={{ borderColor: alpha("#FFF", 0.2), mb: 2 }} />
          <Typography variant="body2" textAlign="center" color="#000">
            BeeHive Manager v1.0 
            Powered by @KaviRajasooriya
          </Typography>
        </Box>
      </Drawer>
      <Main open={open}>
        <DrawerHeader />
      </Main>
    </Box>
  );
}