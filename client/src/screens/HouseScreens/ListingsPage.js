import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../../components/Navbar';
import { useSelector } from 'react-redux';
import AuthToken from '../../helper/AuthToken';

const initialFormState = {
  title: '',
  city: '',
  rent: '',
  type: '',
  description: ''
};

const propertyTypes = ['1BHK', '2BHK', '3BHK', 'Studio'];

const ListingPage = () => {

  const currentUserEmail = AuthToken.getEmail();

  //console.log("currentUserEmail : ", currentUserEmail);

  const filters = useSelector((state) => state.filters);

  const [products, setProducts] = useState([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState(initialFormState);
  const [editingProductId, setEditingProductId] = useState(null);
  const [message, setMessage] = useState('');

  const API_BASE = 'http://localhost:4000/api/properties';

  const fetchProducts = async () => {
    try {
      const res = await axios.get(API_BASE);
      //console.log("Fetched Products:", res.data);
      setProducts(res.data);
    } catch (err) {
      setMessage('Failed to fetch properties');
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ✅ Filtering after products fetched
  const filteredProducts = products.filter((product) => {
    const matchesCity = !filters.city || product.city.toLowerCase().includes(filters.city.toLowerCase());
    const matchesType = !filters.type || product.type === filters.type;
    const matchesRentMin = !filters.rentMin || product.rent >= parseInt(filters.rentMin);
    const matchesRentMax = !filters.rentMax || product.rent <= parseInt(filters.rentMax);
    return matchesCity && matchesType && matchesRentMin && matchesRentMax;
  });

  const handleOpen = () => {
    setFormData(initialFormState);
    setEditingProductId(null);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const data = { ...formData, rent: Number(formData.rent) };
      const token = AuthToken.getToken();

      //console.log("This is token : ", token);
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      if (editingProductId) {
        await axios.post(`${API_BASE}/edit/${editingProductId}`, data, config);
        setMessage('Property updated!');
      } else {
        await axios.post(`${API_BASE}/add`, data, config);
        setMessage('Property added!');
      }
      fetchProducts();
      handleClose();
    } catch {
      setMessage('Failed to submit property');
    }
  };

  const handleEdit = (product) => {
    setFormData(product);
    setEditingProductId(product._id);
    setOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      try {

        const token = AuthToken.getToken();

        //console.log("This is token in delete : ", token);
        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        };

        await axios.post(`${API_BASE}/delete/${id}`, null, config);

        // console.log("This is response : " , res.json());
        setMessage('Property deleted');
        fetchProducts();
      } catch {
        setMessage('Failed to delete property');
      }
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onLogout={handleLogout} />

      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-black">Property Listings</h1>
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
            onClick={handleOpen}
          >
            Add Property
          </button>
        </div>

        {message && (
          <div className="mb-4 p-3 bg-yellow-100 text-yellow-700 rounded">
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div key={product._id} className="bg-white p-4 rounded-xl shadow hover:shadow-md transition">
                <h2 className="text-lg font-semibold text-gray-800 mb-2">Title: {product.title}</h2>
                <p className="text-sm text-gray-600">City: {product.city}</p>
                <p className="text-sm text-gray-600">Rent: ₹{product.rent}</p>
                <p className="text-sm text-gray-600">Type: {product.type}</p>
                <p className="text-sm text-gray-600">Description: {product.description}</p>
                {product.email === currentUserEmail && (
                  <div className="flex justify-end gap-2 mt-4">
                    <button
                      className="text-blue-600 hover:underline"
                      onClick={() => handleEdit(product)}
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-600 hover:underline"
                      onClick={() => handleDelete(product._id)}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-500 col-span-full text-center mt-10">No properties found. Add one to get started.</p>
          )}
        </div>
      </div>

      {/* Modal Form */}
      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">
              {editingProductId ? 'Edit Property' : 'Add Property'}
            </h2>
            <form className="space-y-4">
              <input
                type="text"
                name="title"
                placeholder="Title"
                value={formData.title}
                onChange={handleChange}
                className="w-full border rounded px-4 py-2"
              />
              <input
                type="text"
                name="city"
                placeholder="City"
                value={formData.city}
                onChange={handleChange}
                className="w-full border rounded px-4 py-2"
              />
              <input
                type="number"
                name="rent"
                placeholder="Rent"
                value={formData.rent}
                onChange={handleChange}
                className="w-full border rounded px-4 py-2"
              />
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full border rounded px-4 py-2"
              >
                <option value="">Select Type</option>
                {propertyTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              <textarea
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleChange}
                className="w-full border rounded px-4 py-2"
              />
            </form>
            <div className="flex justify-end mt-4 space-x-2">
              <button
                className="px-4 py-2 border rounded text-gray-600"
                onClick={handleClose}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={handleSubmit}
              >
                {editingProductId ? 'Update' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListingPage;
