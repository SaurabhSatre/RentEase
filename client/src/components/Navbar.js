import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setFilters } from '../slices/searchSlice';
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  Button,
  InputLabel,
  FormControl,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import HomeWorkIcon from '@mui/icons-material/HomeWork';

const Navbar = ({ onLogout, onSearch }) => {
  const filters = useSelector((state) => state.filters);
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleChange = (e) => {
    dispatch(setFilters({
      ...filters,
      [e.target.name]: e.target.value
    }));
  };

  const handleSearch = () => {
    if (typeof onSearch === 'function') {
      onSearch(filters);
    }
  };

  return (
    <AppBar position="static" color="inherit" elevation={2} sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
      <Toolbar sx={{ flexWrap: 'wrap', gap: 2, py: isMobile ? 2 : 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mr: 4 }}>
          <HomeWorkIcon sx={{ fontSize: 36, color: 'primary.main', mr: 1 }} />
          <Typography variant="h5" fontWeight={800} color="primary.main" letterSpacing={-1}>
            RentEase
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 2, ml: 'auto', width: isMobile ? '100%' : 'auto' }}>
          <TextField
            size="small"
            name="city"
            label="City"
            value={filters.city}
            onChange={handleChange}
            sx={{ minWidth: 100, bgcolor: 'background.default', borderRadius: 1 }}
          />
          <TextField
            size="small"
            name="rentMin"
            label="Min Rent"
            type="number"
            value={filters.rentMin}
            onChange={handleChange}
            sx={{ minWidth: 100, bgcolor: 'background.default', borderRadius: 1 }}
          />
          <TextField
            size="small"
            name="rentMax"
            label="Max Rent"
            type="number"
            value={filters.rentMax}
            onChange={handleChange}
            sx={{ minWidth: 100, bgcolor: 'background.default', borderRadius: 1 }}
          />
          <FormControl size="small" sx={{ minWidth: 110, bgcolor: 'background.default', borderRadius: 1 }}>
            <InputLabel>Type</InputLabel>
            <Select
              name="type"
              value={filters.type}
              label="Type"
              onChange={handleChange}
            >
              <MenuItem value="">All Types</MenuItem>
              <MenuItem value="1BHK">1BHK</MenuItem>
              <MenuItem value="2BHK">2BHK</MenuItem>
              <MenuItem value="3BHK">3BHK</MenuItem>
              <MenuItem value="Studio">Studio</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSearch}
            sx={{ borderRadius: 1, fontWeight: 700, boxShadow: 1 }}
          >
            Search
          </Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={onLogout}
            sx={{ borderRadius: 1, fontWeight: 700, ml: isMobile ? 0 : 2, boxShadow: 1 }}
          >
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
