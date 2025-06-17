import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Grid,
  Paper,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import { styled } from "@mui/system";
import { useNavigate } from "react-router-dom";
import { validateEmail, validatePassword } from "../helper/helper.functions.js";
import ToastMessage from "../components/ToastMessage.js";
import { API_BASE } from "../constants.js";

const BackgroundContainer = styled(Box)({
  backgroundImage: 'url("https://source.unsplash.com/random/1600x900?workspace")',
  backgroundSize: "cover",
  backgroundPosition: "center",
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});

const SignUpPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  width: "100%",
  maxWidth: 500,
  borderRadius: 16,
  boxShadow: "0 8px 20px rgba(0, 0, 0, 0.2)",
  backgroundColor: "rgba(255, 255, 255, 0.85)",
  backdropFilter: "blur(10px)",
}));

const StyledButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1.5),
  fontSize: "1rem",
  borderRadius: theme.shape.borderRadius * 2,
  textTransform: "none",
}));

const SignUpPage = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [severity, setSeverity] = useState('success');

  const handleSubmit = async (event) => {
    try {
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      const name = data.get("name");
      const email = data.get("email");

      if (password !== confirmPassword) {
        setToastMessage("Passwords do not match");
        setSeverity("error");
        setShowToast(true);
        return;
      }

      if (!validateEmail(email)) {
        setToastMessage("Email is not valid!");
        setSeverity("error");
        setShowToast(true);
        return;
      }

      if (!validatePassword(password)) {
        setToastMessage("Password is not valid!");
        setSeverity("error");
        setShowToast(true);
        return;
      }

      const userData = {
        name,
        email,
        password
      };

      //console.log("This is user URL : " , `${process.env.REACT_APP_BACKENDURL}/api/v1/user/signup`);

      const res = await fetch(`https://renteasebackend.saurabhsatre.info/api/auth/user/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const response = await res.json();

      //console.log("This is response from server : " , response);

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
    } catch (error) {
      console.error('Error:', error);
      setToastMessage("Something went wrong");
      setSeverity("error");
      setShowToast(true);
    }
  };

  return (
    <BackgroundContainer>
      <SignUpPaper>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          align="center"
          sx={{ fontWeight: 600, color: "primary.main" }}
        >
          Create an Account
        </Typography>
        <Typography
          variant="body1"
          align="center"
          sx={{ mb: 2, color: "text.secondary" }}
        >
          Sign up to get started
        </Typography>
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
          />
          <TextField
            label="Email Address"
            name="email"
            type="email"
            variant="outlined"
            fullWidth
            required
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            variant="outlined"
            fullWidth
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <TextField
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            variant="outlined"
            fullWidth
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          
          <StyledButton type="submit" variant="contained" color="primary" fullWidth>
            Sign Up
          </StyledButton>
        </Box>
        <Grid container justifyContent="center" sx={{ mt: 2 }}>
          <Typography variant="body2">
            Already have an account?{" "}
            <span
              style={{
                color: "#3f51b5",
                cursor: "pointer",
                textDecoration: "underline",
              }}
              onClick={() => navigate("/login")}
            >
              Login
            </span>
          </Typography>
        </Grid>
      </SignUpPaper>

      <ToastMessage
        message={toastMessage}
        show={showToast}
        onClose={() => setShowToast(false)}
        severity={severity}
      />
    </BackgroundContainer>
  );
};

export default SignUpPage;