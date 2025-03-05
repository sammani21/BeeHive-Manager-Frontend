//NavigationBar.tsx
import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
//import Typography from '@mui/material/Typography';
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonIcon from "@mui/icons-material/Person";
import DriveEtaIcon from "@mui/icons-material/Hive";
import PeopleIcon from "@mui/icons-material/Storefront";
import ArticleIcon from "@mui/icons-material/Article";
import TimeToLeaveIcon from "@mui/icons-material/Recommend";
import ChatIcon from "@mui/icons-material/Chat";
//import SettingsIcon from "@mui/icons-material/Settings";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import Badge from "@mui/material/Badge";
import Popover from "@mui/material/Popover";
import Menu from "@mui/material/Menu";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { Link, useNavigate } from "react-router-dom";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
//import Axios, { AxiosResponse } from 'axios';
import BHMLogo from "../assets/BHM_logo.jpg";
import { getAuth, signOut } from "firebase/auth";

const drawerWidth = 240;

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
  backgroundColor: "#000000", // Set AppBar background color to white
  color: "#FFFFFF",
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
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

export default function NavigationBar() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const [notificationAnchorEl, setNotificationAnchorEl] =
    React.useState<HTMLElement | null>(null);
  const [openReports, setOpenReports] = React.useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = React.useState(false);
  const navigate = useNavigate();

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleReportsClick = () => {
    setOpenReports(!openReports);
  };

  const handleNestedItemClick = (nestedItemText: string) => {
    // Navigate to the respective route based on nestedItemText
    console.log("Navigating to:", nestedItemText);
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

  const handleDrawerItemClick = (section: string) => {
    // Handle navigation logic based on the clicked section
    console.log("Navigating to:", section);
  };

  const handleLogout = () => {
    setLogoutDialogOpen(true);
  };

  const handleCloseLogoutDialog = () => {
    setLogoutDialogOpen(false);
  };

  const confirmLogout = () => {
    const auth = getAuth();

    signOut(auth)
      .then(() => {
        console.log("User logged out successfully");
        localStorage.removeItem("token"); // Remove token if stored
        navigate("/login"); // Redirect to login page
      })
      .catch((error) => {
        console.error("Logout failed:", error);
      });
  };

  return (
    <Box sx={{ display: "flex", height: "100" }}>
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
          <img src={BHMLogo} alt="BHM Logo" style={{ height: "40px" }} />
          <div style={{ marginLeft: "auto" }}>
            <IconButton
              size="large"
              color="inherit"
              aria-label="notifications"
              onClick={handleNotificationClick}
            >
              <Badge badgeContent={4} color="secondary">
                <NotificationsActiveIcon />
              </Badge>
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
            >
              <List>
                <ListItem button>
                  <ListItemText primary="Notification 1" />
                </ListItem>
                <ListItem button>
                  <ListItemText primary="Notification 2" />
                </ListItem>
                <ListItem button>
                  <ListItemText primary="Notification 3" />
                </ListItem>
              </List>
            </Popover>
            <IconButton
              size="large"
              aria-label="account"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <AccountCircleIcon />
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
            >
              <ListItemButton
                component={Link}
                to="/manage-profile"
                onClick={handleClose}
              >
                <ListItemText primary="Manage Profile" />
              </ListItemButton>
              <ListItem button onClick={handleLogout}>
                <ListItemText primary="Logout" />
              </ListItem>
            </Menu>
            <Dialog open={logoutDialogOpen} onClose={handleCloseLogoutDialog}>
              <DialogTitle>Logout Confirmation</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Are you sure you want to logout?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseLogoutDialog} color="primary">
                  Cancel
                </Button>
                <Button onClick={confirmLogout} color="secondary">
                  Logout
                </Button>
              </DialogActions>
            </Dialog>
          </div>
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
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "ltr" ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          <ListItemButton
            component={Link}
            to="/dashboard"
            onClick={() => handleDrawerItemClick("Dashboard")}
          >
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItemButton>

          <ListItemButton
            component={Link}
            to="/drivers"
            onClick={() => handleDrawerItemClick("Drivers")}
          >
            <ListItemIcon>
              <PersonIcon />
            </ListItemIcon>
            <ListItemText primary="Bee Keepers" />
          </ListItemButton>

          <ListItemButton
            component={Link}
            to="/vehicles"
            onClick={() => handleDrawerItemClick("Vehicles")}
          >
            <ListItemIcon>
              <DriveEtaIcon />
            </ListItemIcon>
            <ListItemText primary="Hives" />
          </ListItemButton>

          <ListItemButton
            component={Link}
            to="/passengers"
            onClick={() => handleDrawerItemClick("Passengers")}
          >
            <ListItemIcon>
              <PeopleIcon />
            </ListItemIcon>
            <ListItemText primary="Products" />
          </ListItemButton>

          <ListItemButton onClick={handleReportsClick}>
            <ListItemIcon>
              <ArticleIcon />
            </ListItemIcon>
            <ListItemText primary="Reports" />
            {openReports ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>

          <Collapse in={openReports} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItemButton
                component={Link}
                to="/reports/vehicle-details"
                sx={{ pl: 4 }}
                onClick={() => handleNestedItemClick("Vehicle Report")}
              >
                <ListItemIcon>
                  <StarOutlineIcon />
                </ListItemIcon>
                <ListItemText primary="Hive Report" />
              </ListItemButton>

              <ListItemButton
                component={Link}
                to="/reports/passenger-details"
                sx={{ pl: 4 }}
                onClick={() => handleNestedItemClick("Passenger Details")}
              >
                <ListItemIcon>
                  <StarOutlineIcon />
                </ListItemIcon>
                <ListItemText primary="Products Report" />
              </ListItemButton>

              <ListItemButton
                component={Link}
                to="/reports/driver-details"
                sx={{ pl: 4 }}
                onClick={() => handleNestedItemClick("Driver Details")}
              >
                <ListItemIcon>
                  <StarOutlineIcon />
                </ListItemIcon>
                <ListItemText primary="Bee Keeper Report" />
              </ListItemButton>

              <ListItemButton
                component={Link}
                to="/reports/issues-details"
                sx={{ pl: 4 }}
                onClick={() => handleNestedItemClick("Issues Details")}
              >
                <ListItemIcon>
                  <StarOutlineIcon />
                </ListItemIcon>
                <ListItemText primary="Recommondation Report" />
              </ListItemButton>
            </List>
          </Collapse>

          <ListItemButton onClick={() => handleDrawerItemClick("Trips")}>
            <ListItemIcon>
              <TimeToLeaveIcon />
            </ListItemIcon>
            <ListItemText primary="Recommendation" />
          </ListItemButton>

          <ListItemButton component={Link} to="/chatbox">
  <ListItemIcon>
    <ChatIcon />
  </ListItemIcon>
  <ListItemText primary="ChatBox" />
</ListItemButton>

<ListItemButton component={Link} to="/manage-profile">
  <ListItemIcon>
  <PersonIcon />
  </ListItemIcon>
  <ListItemText primary="Profile" />
</ListItemButton>
        </List>
      </Drawer>
      <Main open={open}>
        <DrawerHeader />
      </Main>
    </Box>
  );
}
