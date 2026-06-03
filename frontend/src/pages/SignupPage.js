import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  Collapse,
  CircularProgress,
  InputAdornment,
  IconButton,
  Divider,
  Link,
} from "@mui/material";
import {
  Email as EmailIcon,
  Lock as LockIcon,
  Person as PersonIcon,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { signup } from "../api";
import { useAuth } from "../context/AuthContext";

export default function SignupPage() {
  const navigate = useNavigate();
  const { loginUser } = useAuth();

  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username || !form.email || !form.password) {
      setError("Please fill in all fields.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    try {
      const res = await signup(form);
      loginUser(res.data.user, res.data.token);
      navigate("/feed");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(240,98,146,0.15) 0%, transparent 70%), #0d0d1a",
        p: 2,
      }}
    >
      <Box sx={{ width: "100%", maxWidth: 440 }}>
        {/* Brand */}
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Box
            sx={{
              width: 60,
              height: 60,
              borderRadius: "18px",
              background: "linear-gradient(135deg, #7c6af7 0%, #f06292 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mx: "auto",
              mb: 2,
              boxShadow: "0 12px 40px rgba(240,98,146,0.35)",
            }}
          >
            <Typography
              sx={{
                color: "#fff",
                fontWeight: 800,
                fontSize: "1.6rem",
                fontFamily: "Space Mono, monospace",
              }}
            >
              P
            </Typography>
          </Box>
          <Typography
            variant="h4"
            fontWeight={700}
            sx={{
              fontFamily: "Space Mono, monospace",
              background: "linear-gradient(135deg, #7c6af7 0%, #f06292 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Pulse
          </Typography>
          <Typography color="text.secondary" mt={0.5} fontSize="0.9rem">
            Join the conversation. Create your account.
          </Typography>
        </Box>

        <Card>
          <CardContent sx={{ p: { xs: 2.5, sm: 3.5 } }}>
            <Typography variant="h6" fontWeight={600} mb={0.5}>
              Create account
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>
              It's free. Start posting in seconds.
            </Typography>

            <Collapse in={!!error}>
              <Alert severity="error" sx={{ mb: 2.5, borderRadius: 2 }}>
                {error}
              </Alert>
            </Collapse>

            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{ display: "flex", flexDirection: "column", gap: 2 }}
            >
              <TextField
                name="username"
                label="Username"
                value={form.username}
                onChange={handleChange}
                fullWidth
                required
                autoComplete="username"
                inputProps={{ minLength: 3, maxLength: 20 }}
                helperText="3–20 characters"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon fontSize="small" sx={{ color: "text.secondary" }} />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                name="email"
                label="Email address"
                type="email"
                value={form.email}
                onChange={handleChange}
                fullWidth
                required
                autoComplete="email"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon fontSize="small" sx={{ color: "text.secondary" }} />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                name="password"
                label="Password"
                type={showPass ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
                fullWidth
                required
                autoComplete="new-password"
                helperText="Minimum 6 characters"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon fontSize="small" sx={{ color: "text.secondary" }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={() => setShowPass((v) => !v)}
                        edge="end"
                        tabIndex={-1}
                      >
                        {showPass ? (
                          <VisibilityOff fontSize="small" />
                        ) : (
                          <Visibility fontSize="small" />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={loading}
                sx={{
                  mt: 1,
                  py: 1.4,
                  background: "linear-gradient(135deg, #7c6af7 0%, #f06292 100%)",
                  "&:hover": {
                    background: "linear-gradient(135deg, #6a59e0 0%, #e0547f 100%)",
                  },
                  "&.Mui-disabled": { opacity: 0.6 },
                }}
              >
                {loading ? (
                  <CircularProgress size={22} color="inherit" />
                ) : (
                  "Create account"
                )}
              </Button>
            </Box>

            <Divider sx={{ my: 3 }} />

            <Typography variant="body2" color="text.secondary" textAlign="center">
              Already have an account?{" "}
              <Link
                component={RouterLink}
                to="/login"
                sx={{
                  color: "primary.main",
                  fontWeight: 600,
                  textDecoration: "none",
                  "&:hover": { textDecoration: "underline" },
                }}
              >
                Sign in
              </Link>
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
