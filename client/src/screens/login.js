import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Grid,
  Paper,
} from "@mui/material";
import { styled } from "@mui/system";
import { useNavigate } from "react-router-dom";
import ToastMessage from "../components/ToastMessage"; // Assuming you have a ToastMessage component
import { validateEmail, validatePassword } from "../helper/helper.functions.js";
import AuthToken from "../helper/AuthToken.js";
import { API_BASE } from "../constants.js";

const BackgroundContainer = styled(Box)({
  backgroundImage: 'url("https://source.unsplash.com/random/1600x900?technology")',
  backgroundSize: "cover",
  backgroundPosition: "center",
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});

const LoginPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  width: "100%",
  maxWidth: 400,
  borderRadius: 16,
  boxShadow: "0 8px 20px rgba(0, 0, 0, 0.2)",
  backgroundColor: "rgba(255, 255, 255, 0.8)",
  backdropFilter: "blur(10px)",
}));

const StyledButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1.5),
  fontSize: "1rem",
  borderRadius: theme.shape.borderRadius * 2,
  textTransform: "none",
}));

const Login = () => {
  const navigate = useNavigate();
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [severity, setSeverity] = useState('success'); // 'success' or 'error'

  const handleSubmit = async (event) => {
    try {
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      const email = data.get("email");
      const password = data.get("password");

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

      const userData = { email, password };

      const res = await fetch(`https://renteasebackend.saurabhsatre.info/api/auth/user/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const response = await res.json();
      //console.log(response);

      if (response.success) {
        setToastMessage('Login successful!');
        setSeverity('success');
        setShowToast(true);
        const authToken  = response.authToken;

        //console.log("This is " , authToken);

        localStorage.setItem("authToken", authToken);
        localStorage.setItem("email", email);

        console.log("token " , localStorage.getItem("authToken"));

        // Redirect to the home page after a successful login
        setTimeout(() => navigate("/"), 200);
      } else {
        setToastMessage(response.message || 'Login failed!');
        setSeverity('error');
        setShowToast(true);
      }
    } catch (error) {
      console.error('Error:', error);
      setToastMessage('Something went wrong');
      setSeverity('error');
      setShowToast(true);
    }
  };

  return (
    <BackgroundContainer>
      <LoginPaper>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          align="center"
          sx={{
            fontWeight: 600,
            color: "primary.main",
          }}
        >
          Welcome Back!
        </Typography>
        <Typography
          variant="body1"
          align="center"
          sx={{
            mb: 2,
            color: "text.secondary",
          }}
        >
          Login to your account
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
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
          />
          <StyledButton type="submit" variant="contained" color="primary" fullWidth>
            Login
          </StyledButton>
        </Box>
        <Grid container justifyContent="space-between" sx={{ mt: 2 }}>
          <Typography
            variant="body2"
            sx={{
              cursor: "pointer",
              color: "primary.main",
              textDecoration: "underline",
            }}
          >
            
          </Typography>
          <Typography
            variant="body2"
            sx={{
              cursor: "pointer",
              color: "primary.main",
              textDecoration: "underline",
            }}
            onClick={() => navigate("/signup")}
          >
            Create Account
          </Typography>
        </Grid>
      </LoginPaper>

      <ToastMessage
        message={toastMessage}
        show={showToast}
        onClose={() => setShowToast(false)}
        severity={severity}  // Pass severity for success or error
      />
    </BackgroundContainer>
  );
};

export default Login;