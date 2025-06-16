import React, { useEffect, useState } from 'react';
import { CircularProgress, Box } from '@mui/material';
import AuthToken from '../helper/AuthToken.js';
import InventoryHomePage from './HouseScreens/ListingsPage.js';

function Home() {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const token = AuthToken.getToken();
      const isValid = AuthToken.isValidToken();

      //console.log("This is token data: ", AuthToken.decodeToken());

      if (token && isValid) {
        setAuthenticated(true);
      } else {
        window.location.href = "/login";
      }

      setLoading(false);
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return authenticated ? <InventoryHomePage /> : null;
}

export default Home;
