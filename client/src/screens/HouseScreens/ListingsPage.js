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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Navbar onLogout={handleLogout} />

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
            Find Your Perfect Home
          </h1>
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105"
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
          <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-600 text-blue-700 rounded shadow-sm">
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div key={product._id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1">
                <div className="relative">
                  <img
                    src={`${API_BASE}/api/image/${product.imageID}`}
                    alt={product.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-0 right-0 m-3 px-2 py-1 bg-blue-600 text-white rounded-full text-xs font-medium">
                    {product.type}
                  </div>
                </div>
                <div className="p-4">
                  <h2 className="text-lg font-semibold text-gray-800 mb-2 truncate">{product.title}</h2>
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <p className="text-gray-600 text-sm flex items-center">
                        <svg className="w-3.5 h-3.5 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        {product.city}
                      </p>
                      <p className="text-blue-600 font-semibold">
                        ₹{product.rent.toLocaleString('en-IN')}
                      </p>
                    </div>
                    <p className="text-gray-500 text-sm line-clamp-2">{product.description}</p>
                  </div>
                  {product.email === currentUserEmail && (
                    <div className="flex justify-end gap-3 mt-3 pt-3 border-t border-gray-100">
                      <button className="text-green-600 hover:text-green-700 text-sm font-medium transition-colors" onClick={() => handleInfo(product)}>Info</button>
                      <button className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors" onClick={() => handleEdit(product)}>Edit</button>
                      <button className="text-red-600 hover:text-red-700 text-sm font-medium transition-colors" onClick={() => handleDelete(product._id)}>Delete</button>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-16">
              <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <p className="text-xl text-gray-500 font-medium">No properties found</p>
              <p className="text-gray-400 mt-2">Try adjusting your search filters</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl w-full max-w-lg shadow-xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New Property</h2>
            <form className="space-y-5">
              <div>
                <input 
                  name="title" 
                  placeholder="Property Title" 
                  value={formData.title} 
                  onChange={handleChange} 
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                />
              </div>
              <div>
                <input 
                  name="city" 
                  placeholder="City" 
                  value={formData.city} 
                  onChange={handleChange} 
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                />
              </div>
              <div>
                <input 
                  name="rent" 
                  type="number" 
                  placeholder="Monthly Rent" 
                  value={formData.rent} 
                  onChange={handleChange} 
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                />
              </div>
              <div>
                <select 
                  name="type" 
                  value={formData.type} 
                  onChange={handleChange} 
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Property Type</option>
                  {propertyTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div>
                <textarea 
                  name="description" 
                  placeholder="Property Description" 
                  value={formData.description} 
                  onChange={handleChange} 
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent h-32" 
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Property Images</label>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageChange} 
                  className="w-full border border-gray-300 rounded-lg px-4 py-3" 
                />
                {imagePreview && (
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="w-full h-48 object-cover rounded-lg" 
                  />
                )}
              </div>
            </form>
            <div className="flex justify-end mt-6 gap-3">
              <button 
                className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors" 
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </button>
              <button 
                className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors" 
                onClick={handleAddSubmit}
              >
                Add Property
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl w-full max-w-lg shadow-xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit Property</h2>
            <form className="space-y-5">
              <div>
                <input 
                  name="title" 
                  placeholder="Property Title" 
                  value={formData.title} 
                  onChange={handleChange} 
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                />
              </div>
              <div>
                <input 
                  name="city" 
                  placeholder="City" 
                  value={formData.city} 
                  onChange={handleChange} 
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                />
              </div>
              <div>
                <input 
                  name="rent" 
                  type="number" 
                  placeholder="Monthly Rent" 
                  value={formData.rent} 
                  onChange={handleChange} 
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                />
              </div>
              <div>
                <select 
                  name="type" 
                  value={formData.type} 
                  onChange={handleChange} 
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Property Type</option>
                  {propertyTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div>
                <textarea 
                  name="description" 
                  placeholder="Property Description" 
                  value={formData.description} 
                  onChange={handleChange} 
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent h-32" 
                />
              </div>
            </form>
            <div className="flex justify-end mt-6 gap-3">
              <button 
                className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors" 
                onClick={() => setShowEditModal(false)}
              >
                Cancel
              </button>
              <button 
                className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors" 
                onClick={handleEditSubmit}
              >
                Update Property
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Info Modal */}
      {showInfoModal && selectedInfoProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl w-full max-w-lg shadow-xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Property Details</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="col-span-1 font-medium text-gray-500">Title</div>
                <div className="col-span-2 text-gray-900">{selectedInfoProduct.title}</div>
                
                <div className="col-span-1 font-medium text-gray-500">City</div>
                <div className="col-span-2 text-gray-900">{selectedInfoProduct.city}</div>
                
                <div className="col-span-1 font-medium text-gray-500">Monthly Rent</div>
                <div className="col-span-2 text-gray-900">₹{selectedInfoProduct.rent.toLocaleString('en-IN')}</div>
                
                <div className="col-span-1 font-medium text-gray-500">Type</div>
                <div className="col-span-2 text-gray-900">{selectedInfoProduct.type}</div>
                
                <div className="col-span-1 font-medium text-gray-500">Contact Email</div>
                <div className="col-span-2 text-gray-900">{selectedInfoProduct.email}</div>
                
                <div className="col-span-1 font-medium text-gray-500">Listed On</div>
                <div className="col-span-2 text-gray-900">
                  {new Date(selectedInfoProduct.createdAt).toLocaleString('en-IN', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                  })}
                </div>
                
                <div className="col-span-1 font-medium text-gray-500">Last Updated</div>
                <div className="col-span-2 text-gray-900">
                  {new Date(selectedInfoProduct.updatedAt).toLocaleString('en-IN', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                  })}
                </div>
              </div>
              
              <div className="pt-4">
                <div className="font-medium text-gray-500 mb-2">Description</div>
                <p className="text-gray-900">{selectedInfoProduct.description}</p>
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <button 
                className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                onClick={() => setShowInfoModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ListingPage;
