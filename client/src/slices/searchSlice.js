// src/redux/slices/filterSlice.js

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  city: '',
  rentMin: '',
  rentMax: '',
  type: ''
};

const filterSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      const { city, rentMin, rentMax, type } = action.payload;
      state.city = city;
      state.rentMin = rentMin;
      state.rentMax = rentMax;
      state.type = type;
    },
    resetFilters: () => initialState
  }
});

export const { setFilters, resetFilters } = filterSlice.actions;
export default filterSlice.reducer;
