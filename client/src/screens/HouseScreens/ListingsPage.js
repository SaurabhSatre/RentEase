import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../../components/Navbar';
import { useSelector } from 'react-redux';
import AuthToken from '../../helper/AuthToken';
import { API_BASE } from '../../constants';

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
  const filters = useSelector((state) => state.filters);

  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState('');

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [formData, setFormData] = useState(initialFormState);
  const [editingProductId, setEditingProductId] = useState(null);

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [showInfoModal, setShowInfoModal] = useState(false);
  const [selectedInfoProduct, setSelectedInfoProduct] = useState(null);

  const handleInfo = (product) => {
    setSelectedInfoProduct(product);
    setShowInfoModal(true);
  };

  const fetchProducts = async () => {
    try {
      console.log("This si api : ", API_BASE);
      const res = await axios.get(`${API_BASE}/api/properties`);
      setProducts(res.data);
    } catch (err) {
      setMessage('Failed to fetch properties');
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) => {
    const matchesCity = !filters.city || product.city.toLowerCase().includes(filters.city.toLowerCase());
    const matchesType = !filters.type || product.type === filters.type;
    const matchesRentMin = !filters.rentMin || product.rent >= parseInt(filters.rentMin);
    const matchesRentMax = !filters.rentMax || product.rent <= parseInt(filters.rentMax);
    return matchesCity && matchesType && matchesRentMin && matchesRentMax;
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleAddSubmit = async () => {
    try {

      const token = AuthToken.getToken();

      const form = new FormData();
      form.append('title', formData.title);
      form.append('city', formData.city);
      form.append('rent', formData.rent);
      form.append('type', formData.type);
      form.append('description', formData.description);

      if (imageFile) {
        form.append('image', imageFile); // this must be a File object
      }

      console.log("This is image file : ", imageFile);

      const config = {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ NO Content-Type manually
        },
      };

      const res = await axios.post(`${API_BASE}/api/properties/add`, form, config);

      console.log("Success:", res.data);
      setMessage("Property added successfully");
      setShowAddModal(false);
      setFormData(initialFormState);
      setImageFile(null);
      setImagePreview(null);
      fetchProducts();
    } catch (error) {
      console.error("Upload Error:", error);
      setMessage("Failed to add property");
    }
  };

  const handleEditSubmit = async () => {
    try {
      const token = AuthToken.getToken();
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const data = { ...formData, rent: Number(formData.rent) };
      await axios.post(`${API_BASE}/api/properties/edit/${editingProductId}`, data, config);
      setMessage('Property updated!');
      fetchProducts();
      setShowEditModal(false);
    } catch {
      setMessage('Failed to update property');
    }
  };

  const handleEdit = (product) => {
    setFormData(product);
    setEditingProductId(product._id);
    setShowEditModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      try {
        const token = AuthToken.getToken();
        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        };
        await axios.post(`${API_BASE}/api/properties/delete/${id}`, null, config);
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
            onClick={() => {
              setFormData(initialFormState);
              setImageFile(null);
              setImagePreview(null);
              setShowAddModal(true);
            }}
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
                <img
                  src={`${API_BASE}/api/image/${product.imageID}`}
                  alt={product.title}
                  className="w-full h-40 object-cover rounded mb-2"
                />

                <p className="text-sm text-gray-600">City: {product.city}</p>
                <p className="text-sm text-gray-600">Rent: ₹{product.rent}</p>
                <p className="text-sm text-gray-600">Type: {product.type}</p>
                <p className="text-sm text-gray-600">Description: {product.description}</p>
                {product.email === currentUserEmail && (
                  <div className="flex justify-end gap-2 mt-4">
                    <button className="text-green-600 hover:underline" onClick={() => handleInfo(product)}>Get Info</button>
                    <button className="text-blue-600 hover:underline" onClick={() => handleEdit(product)}>Edit</button>
                    <button className="text-red-600 hover:underline" onClick={() => handleDelete(product._id)}>Delete</button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-500 col-span-full text-center mt-10">No properties found.</p>
          )}
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Add Property</h2>
            <form className="space-y-4">
              <input name="title" placeholder="Title" value={formData.title} onChange={handleChange} className="w-full border rounded px-4 py-2" />
              <input name="city" placeholder="City" value={formData.city} onChange={handleChange} className="w-full border rounded px-4 py-2" />
              <input name="rent" type="number" placeholder="Rent" value={formData.rent} onChange={handleChange} className="w-full border rounded px-4 py-2" />
              <select name="type" value={formData.type} onChange={handleChange} className="w-full border rounded px-4 py-2">
                <option value="">Select Type</option>
                {propertyTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} className="w-full border rounded px-4 py-2" />
              <input type="file" accept="image/*" onChange={handleImageChange} className="w-full border px-4 py-2" />
              {imagePreview && <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover mt-2 rounded-lg" />}
            </form>
            <div className="flex justify-end mt-4 space-x-2">
              <button className="px-4 py-2 border rounded text-gray-600" onClick={() => setShowAddModal(false)}>Cancel</button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" onClick={handleAddSubmit}>Add</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Edit Property</h2>
            <form className="space-y-4">
              <input name="title" placeholder="Title" value={formData.title} onChange={handleChange} className="w-full border rounded px-4 py-2" />
              <input name="city" placeholder="City" value={formData.city} onChange={handleChange} className="w-full border rounded px-4 py-2" />
              <input name="rent" type="number" placeholder="Rent" value={formData.rent} onChange={handleChange} className="w-full border rounded px-4 py-2" />
              <select name="type" value={formData.type} onChange={handleChange} className="w-full border rounded px-4 py-2">
                <option value="">Select Type</option>
                {propertyTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} className="w-full border rounded px-4 py-2" />
            </form>
            <div className="flex justify-end mt-4 space-x-2">
              <button className="px-4 py-2 border rounded text-gray-600" onClick={() => setShowEditModal(false)}>Cancel</button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" onClick={handleEditSubmit}>Update</button>
            </div>
          </div>
        </div>
      )}

      {/* Info Modal */}
      {showInfoModal && selectedInfoProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Property Information</h2>
            <div className="space-y-2 text-gray-800">
              <p><strong>Title:</strong> {selectedInfoProduct.title}</p>
              <p><strong>City:</strong> {selectedInfoProduct.city}</p>
              <p><strong>Rent:</strong> ₹{selectedInfoProduct.rent}</p>
              <p><strong>Type:</strong> {selectedInfoProduct.type}</p>
              <p><strong>Description:</strong> {selectedInfoProduct.description}</p>
              <p><strong>Email:</strong> {selectedInfoProduct.email}</p>
              <p><strong>Created At:</strong> {new Date(selectedInfoProduct.createdAt).toLocaleString('en-IN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true
              })}</p>

              <p><strong>Last Updated:</strong> {new Date(selectedInfoProduct.updatedAt).toLocaleString('en-IN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true
              })}</p>

            </div>
            <div className="flex justify-end mt-4">
              <button className="px-4 py-2 border rounded text-gray-600" onClick={() => setShowInfoModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ListingPage;
