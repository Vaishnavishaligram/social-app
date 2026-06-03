import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Chip,
  Divider,
} from "@mui/material";
import {
  Logout as LogoutIcon,
  AccountCircle as AccountIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenu = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleLogout = () => {
    handleClose();
    logoutUser();
    navigate("/login");
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        background: "rgba(13,13,26,0.85)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(124,106,247,0.15)",
        zIndex: 1200,
      }}
    >
      <Toolbar sx={{ maxWidth: 680, width: "100%", mx: "auto", px: { xs: 2, sm: 3 } }}>
        {/* Logo */}
        <Box
          onClick={() => navigate("/feed")}
          sx={{ display: "flex", alignItems: "center", gap: 1.5, cursor: "pointer", flexGrow: 1 }}
        >
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: "10px",
              background: "linear-gradient(135deg, #7c6af7 0%, #f06292 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography sx={{ color: "#fff", fontWeight: 800, fontSize: "0.9rem", fontFamily: "Space Mono, monospace" }}>
              P
            </Typography>
          </Box>
          <Typography
            variant="h6"
            sx={{
              fontFamily: "Space Mono, monospace",
              fontWeight: 700,
              fontSize: "1.1rem",
              background: "linear-gradient(135deg, #7c6af7 0%, #f06292 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Pulse
          </Typography>
        </Box>

        {/* User chip */}
        {user && (
          <>
            <Chip
              avatar={
                <Avatar sx={{ width: 28, height: 28, fontSize: "0.75rem" }}>
                  {user.username[0].toUpperCase()}
                </Avatar>
              }
              label={user.username}
              onClick={handleMenu}
              sx={{
                background: "rgba(124,106,247,0.15)",
                border: "1px solid rgba(124,106,247,0.3)",
                color: "#e8e6f0",
                fontWeight: 500,
                cursor: "pointer",
                "&:hover": { background: "rgba(124,106,247,0.25)" },
              }}
            />
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              PaperProps={{
                sx: {
                  mt: 1.5,
                  minWidth: 180,
                  background: "#1c1c2e",
                  border: "1px solid rgba(124,106,247,0.2)",
                  borderRadius: 3,
                },
              }}
            >
              <Box sx={{ px: 2, py: 1.5 }}>
                <Typography variant="caption" color="text.secondary">
                  Signed in as
                </Typography>
                <Typography variant="body2" fontWeight={600}>
                  @{user.username}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {user.email}
                </Typography>
              </Box>
              <Divider />
              <MenuItem onClick={handleLogout} sx={{ gap: 1.5, py: 1.5, color: "#f06292" }}>
                <LogoutIcon fontSize="small" />
                Sign out
              </MenuItem>
            </Menu>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}
