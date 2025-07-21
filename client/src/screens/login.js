import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Grid,
  Paper,
  IconButton,
  InputAdornment,
  Divider,
  Checkbox,
  FormControlLabel,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import { styled } from "@mui/system";
import { useNavigate } from "react-router-dom";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import ToastMessage from "../components/ToastMessage";
import { validateEmail, validatePassword } from "../helper/helper.functions.js";
import AuthToken from "../helper/AuthToken.js";
import { API_BASE } from "../constants.js";

const StyledButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1.5),
  fontSize: "1rem",
  borderRadius: theme.shape.borderRadius * 2,
  textTransform: "none",
  fontWeight: 700,
  boxShadow: theme.shadows[2],
}));

const DEMO_EMAIL = 'demo@rentease.com';
const DEMO_PASS = 'Demo@1234';

const Login = () => {
  const navigate = useNavigate();
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [severity, setSeverity] = useState('success');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (event) => {
    try {
      event.preventDefault();
      setLoading(true);
      const email = form.email;
      const password = form.password;

      if (!validateEmail(email)) {
        setToastMessage("Email is not valid!");
        setSeverity("error");
        setShowToast(true);
        setLoading(false);
        return;
      }

      if (!validatePassword(password)) {
        setToastMessage("Password is not valid!");
        setSeverity("error");
        setShowToast(true);
        setLoading(false);
        return;
      }

      const userData = { email, password };

      const res = await fetch(`${API_BASE}/api/auth/user/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const response = await res.json();

      if (response.success) {
        setToastMessage('Login successful!');
        setSeverity('success');
        setShowToast(true);
        const authToken  = response.authToken;
        localStorage.setItem("authToken", authToken);
        localStorage.setItem("email", email);
        setTimeout(() => navigate("/"), 200);
      } else {
        setToastMessage(response.message || 'Login failed!');
        setSeverity('error');
        setShowToast(true);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setToastMessage('Something went wrong');
      setSeverity('error');
      setShowToast(true);
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setToastMessage('Copied!');
    setSeverity('success');
    setShowToast(true);
  };

  const handleDemoFill = () => {
    setForm({ email: DEMO_EMAIL, password: DEMO_PASS });
    setToastMessage('Demo credentials filled!');
    setSeverity('info');
    setShowToast(true);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundImage: 'url(https://source.unsplash.com/random/1600x900?home,apartment,city)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <Paper
        elevation={12}
        sx={{
          p: 4,
          width: '100%',
          maxWidth: 420,
          borderRadius: 6,
          bgcolor: 'rgba(255,255,255,0.75)',
          boxShadow: '0 8px 32px 0 rgba(21,101,192,0.15)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255,255,255,0.25)',
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
          <HomeWorkIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            align="center"
            sx={{ fontWeight: 800, color: 'primary.main', letterSpacing: '-1px' }}
          >
            Welcome Back!
          </Typography>
          <Typography
            variant="body1"
            align="center"
            sx={{ mb: 2, color: 'text.secondary' }}
          >
            Login to your account
          </Typography>
        </Box>
        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <TextField
            label="Email Address"
            name="email"
            type="email"
            variant="outlined"
            fullWidth
            required
            value={form.email}
            onChange={handleChange}
            autoComplete="username"
          />
          <TextField
            label="Password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            variant="outlined"
            fullWidth
            required
            value={form.password}
            onChange={handleChange}
            autoComplete="current-password"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword((show) => !show)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: -1 }}>
            <FormControlLabel
              control={<Checkbox checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} color="primary" />}
              label={<Typography variant="body2" color="text.secondary">Remember Me</Typography>}
              sx={{ ml: 0 }}
            />
            <Button variant="text" size="small" sx={{ color: 'primary.dark', textTransform: 'none', fontWeight: 500 }}>
              Forgot Password?
            </Button>
          </Box>
          <StyledButton type="submit" variant="contained" color="primary" fullWidth disabled={loading} sx={{ mt: 1, mb: 1 }}>
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
          </StyledButton>
        </Box>
        <Divider sx={{ my: 3 }}>Demo Account</Divider>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" color="text.secondary">Email:</Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>{DEMO_EMAIL}</Typography>
            <Tooltip title="Copy Email"><IconButton size="small" onClick={() => handleCopy(DEMO_EMAIL)}><ContentCopyIcon fontSize="small" /></IconButton></Tooltip>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" color="text.secondary">Password:</Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>{DEMO_PASS}</Typography>
            <Tooltip title="Copy Password"><IconButton size="small" onClick={() => handleCopy(DEMO_PASS)}><ContentCopyIcon fontSize="small" /></IconButton></Tooltip>
          </Box>
          <Button variant="outlined" size="small" sx={{ mt: 1, borderRadius: 2 }} onClick={handleDemoFill}>
            Fill Demo Credentials
          </Button>
        </Box>
        <Grid container justifyContent="flex-end" sx={{ mt: 3 }}>
          <Typography
            variant="body2"
            sx={{ cursor: "pointer", color: "primary.main", textDecoration: "underline" }}
            onClick={() => navigate("/signup")}
          >
            Create Account
          </Typography>
        </Grid>
      </Paper>
      <ToastMessage
        message={toastMessage}
        show={showToast}
        onClose={() => setShowToast(false)}
        severity={severity}
      />
    </Box>
  );
};

export default Login;