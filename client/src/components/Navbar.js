import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setFilters } from '../slices/searchSlice';

const Navbar = ({ onLogout, onSearch }) => {
  const filters = useSelector((state) => state.filters);
  const dispatch = useDispatch();

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
    <nav className="bg-white shadow-md border-b-2 border-gray-200">
      <div className="max-w-screen-xl mx-auto px-4 py-4 flex flex-wrap items-start justify-between gap-4">
        <div className="text-4xl vs:text-3xl font-extrabold text-indigo-600 tracking-wide">
          RentEase
        </div>


        {/* Container for filters + buttons */}
        <div className="flex flex-wrap items-center gap-2 ml-auto vs:flex-col vs:items-start vs:w-full">
          <input
            type="text"
            name="city"
            placeholder="City"
            value={filters.city}
            onChange={handleChange}
            className="w-28 border rounded px-2 py-1 vs:w-full"
          />
          <input
            type="number"
            name="rentMin"
            placeholder="Min Rent"
            value={filters.rentMin}
            onChange={handleChange}
            className="w-28 border rounded px-2 py-1 vs:w-full"
          />
          <input
            type="number"
            name="rentMax"
            placeholder="Max Rent"
            value={filters.rentMax}
            onChange={handleChange}
            className="w-28 border rounded px-2 py-1 vs:w-full"
          />
          <select
            name="type"
            value={filters.type}
            onChange={handleChange}
            className="w-26 border rounded px-2 py-1 vs:w-full"
          >
            <option value="">All Types</option>
            <option value="1BHK">1BHK</option>
            <option value="2BHK">2BHK</option>
            <option value="3BHK">3BHK</option>
          </select>

          <button
            onClick={handleSearch}
            className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700 vs:w-full"
          >
            Search
          </button>

          <button
            onClick={onLogout}
            className="text-indigo-600 border border-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-600 hover:text-white transition vs:w-full"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
