import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  IconButton,
  InputAdornment,
  Grid,
  CircularProgress,
} from "@mui/material";
import { styled } from "@mui/system";
import { useNavigate } from "react-router-dom";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import { validateEmail, validatePassword } from "../helper/helper.functions.js";
import ToastMessage from "../components/ToastMessage.js";
import { API_BASE } from "../constants.js";

const StyledButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1.5),
  fontSize: "1rem",
  borderRadius: theme.shape.borderRadius * 2,
  textTransform: "none",
  fontWeight: 700,
  boxShadow: theme.shadows[2],
}));

const SignUpPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [severity, setSeverity] = useState('success');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (event) => {
    try {
      event.preventDefault();
      setLoading(true);
      const { name, email, password, confirmPassword } = form;

      if (password !== confirmPassword) {
        setToastMessage("Passwords do not match");
        setSeverity("error");
        setShowToast(true);
        setLoading(false);
        return;
      }

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

      const userData = { name, email, password };
      const res = await fetch(`${API_BASE}/api/auth/user/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      const response = await res.json();
      if (response.success) {
        setToastMessage('Sign up successful!');
        setSeverity('success');
        setShowToast(true);
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setToastMessage(response.message || 'Signup failed!');
        setSeverity('error');
        setShowToast(true);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setToastMessage("Something went wrong");
      setSeverity("error");
      setShowToast(true);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundImage: 'url(https://source.unsplash.com/random/1600x900?apartment,city,home)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <Paper
        elevation={12}
        sx={{
          p: 4,
          width: '100%',
          maxWidth: 440,
          borderRadius: 6,
          bgcolor: 'rgba(255,255,255,0.80)',
          boxShadow: '0 8px 32px 0 rgba(0,150,136,0.15)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255,255,255,0.25)',
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
          <PersonAddAlt1Icon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            align="center"
            sx={{ fontWeight: 800, color: 'primary.main', letterSpacing: '-1px' }}
          >
            Create an Account
          </Typography>
          <Typography
            variant="body1"
            align="center"
            sx={{ mb: 2, color: 'text.secondary' }}
          >
            Sign up to get started
          </Typography>
        </Box>
        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <TextField
            label="Full Name"
            name="name"
            type="text"
            variant="outlined"
            fullWidth
            required
            value={form.name}
            onChange={handleChange}
            autoComplete="name"
          />
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
            autoComplete="new-password"
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
          <TextField
            label="Confirm Password"
            name="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            variant="outlined"
            fullWidth
            required
            value={form.confirmPassword}
            onChange={handleChange}
            autoComplete="new-password"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle confirm password visibility"
                    onClick={() => setShowConfirmPassword((show) => !show)}
                    edge="end"
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <StyledButton type="submit" variant="contained" color="primary" fullWidth disabled={loading} sx={{ mt: 1, mb: 1 }}>
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign Up'}
          </StyledButton>
        </Box>
        <Grid container justifyContent="center" sx={{ mt: 2 }}>
          <Button
            variant="text"
            sx={{ color: 'secondary.main', textTransform: 'none', fontWeight: 600 }}
            onClick={() => navigate("/login")}
          >
            Back to Login
          </Button>
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

export default SignUpPage;