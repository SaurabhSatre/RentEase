import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../../components/Navbar';
import { useSelector } from 'react-redux';
import AuthToken from '../../helper/AuthToken';
import { API_BASE } from '../../constants';
import {
  Box,
  Paper,
  Typography,
  Button,
  IconButton,
  Chip,
  Tooltip,
  Avatar,
  Fab,
  Divider,
  Grid,
  TextField,
  MenuItem,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';

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
        form.append('image', imageFile);
      }
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      await axios.post(`${API_BASE}/api/properties/add`, form, config);
      setMessage('Property added successfully');
      setShowAddModal(false);
      setFormData(initialFormState);
      setImageFile(null);
      setImagePreview(null);
      fetchProducts();
    } catch (error) {
      setMessage('Failed to add property');
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

  // Helper for 'listed X days ago'
  const getDaysAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diff = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    if (diff === 0) return 'Today';
    if (diff === 1) return '1 day ago';
    return `${diff} days ago`;
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        background: 'linear-gradient(135deg, #fafdff 0%, #e0f7fa 60%, #ffe0e0 100%)',
        pb: 8,
      }}
    >
      <Navbar onLogout={handleLogout} />
      <Box sx={{ position: 'fixed', bottom: 32, right: 32, zIndex: 1200 }}>
        <Tooltip title="Add Property">
          <Fab color="primary" size="large" onClick={() => {
            setFormData(initialFormState);
            setImageFile(null);
            setImagePreview(null);
            setShowAddModal(true);
          }}>
            <AddIcon fontSize="large" />
          </Fab>
        </Tooltip>
      </Box>
      <Box className="container" sx={{ mx: 'auto', px: { xs: 2, md: 4 }, py: 6, maxWidth: 1400 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 6 }}>
          <Typography variant="h3" fontWeight={800} color="primary.main" letterSpacing={-1}>
            Find Your Perfect Home
          </Typography>
        </Box>
        {message && (
          <Box sx={{ mb: 4, p: 2, bgcolor: 'primary.light', color: 'primary.contrastText', borderRadius: 2, boxShadow: 1 }}>
            {message}
          </Box>
        )}
        <Grid container spacing={4}>
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
                <Paper
                  elevation={6}
                  sx={{
                    borderRadius: 1,
                    overflow: 'hidden',
                    boxShadow: '0 8px 32px 0 rgba(0,188,212,0.10)',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-6px) scale(1.03)',
                      boxShadow: '0 16px 40px 0 rgba(0,188,212,0.18)',
                    },
                    bgcolor: 'rgba(255,255,255,0.95)',
                    position: 'relative',
                  }}
                >
                  <Box sx={{ position: 'relative' }}>
                    <img
                      src={`${API_BASE}/api/image/${product.imageID}`}
                      alt={product.title}
                      style={{ width: '100%', height: 200, objectFit: 'cover' }}
                    />
                    <Chip
                      label={product.type}
                      color="secondary"
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: 16,
                        right: 16,
                        fontWeight: 700,
                        fontSize: 14,
                        px: 1.5,
                        boxShadow: 1,
                        bgcolor: 'secondary.main',
                        color: 'secondary.contrastText',
                        borderRadius: 2,
                      }}
                    />
                  </Box>
                  <Box sx={{ p: 3 }}>
                    <Typography variant="h6" fontWeight={700} color="primary.dark" gutterBottom noWrap>
                      {product.title}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <LocationOnIcon sx={{ fontSize: 18, color: 'primary.main', mr: 0.5 }} />
                      <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                        {product.city}
                      </Typography>
                      <CurrencyRupeeIcon sx={{ fontSize: 18, color: 'secondary.main', mr: 0.2 }} />
                      <Typography variant="body2" color="secondary.main" fontWeight={600}>
                        {product.rent.toLocaleString('en-IN')}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1, minHeight: 40 }}>
                      {product.description.length > 60 ? product.description.slice(0, 60) + '...' : product.description}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Avatar sx={{ width: 28, height: 28, bgcolor: 'primary.light', color: 'primary.dark', fontWeight: 700, fontSize: 16, mr: 1 }}>
                        {product.email[0].toUpperCase()}
                      </Avatar>
                      <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                        {product.email}
                      </Typography>
                      <Chip
  label={getDaysAgo(product.createdAt)}
  size="small"
  sx={{
    bgcolor: 'info.light',
    color: 'primary.dark',
    fontWeight: 600,
    ml: 'auto',
    pointerEvents: 'none' // disables click interaction
  }}
/>



                    </Box>
                    {product.email === currentUserEmail && (
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5, mt: 2 }}>
                        <Tooltip title="Info"><IconButton color="info" onClick={() => handleInfo(product)}><InfoOutlinedIcon /></IconButton></Tooltip>
                        <Tooltip title="Edit"><IconButton color="primary" onClick={() => handleEdit(product)}><EditOutlinedIcon /></IconButton></Tooltip>
                        <Tooltip title="Delete"><IconButton color="error" onClick={() => handleDelete(product._id)}><DeleteOutlineIcon /></IconButton></Tooltip>
                      </Box>
                    )}
                  </Box>
                </Paper>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Box sx={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 12,
              }}>
                <HomeWorkIcon sx={{ fontSize: 64, color: 'primary.light', mb: 2 }} />
                <Typography variant="h5" color="text.secondary" fontWeight={600}>
                  No properties found
                </Typography>
                <Typography color="text.secondary" sx={{ mt: 1 }}>
                  Try adjusting your search filters
                </Typography>
              </Box>
            </Grid>
          )}
        </Grid>
      </Box>
      {/* Add Modal */}
      {showAddModal && (
        <Box sx={{ position: 'fixed', inset: 0, zIndex: 1300, bgcolor: 'rgba(0,0,0,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Paper sx={{ p: 4, borderRadius: 1, width: '100%', maxWidth: 480, boxShadow: 8 }}>
            <Typography variant="h5" fontWeight={700} color="primary.main" mb={3}>Add New Property</Typography>
            <Box className="space-y-5" component="form">
              <TextField name="title" label="Property Title" value={formData.title} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
              <TextField name="city" label="City" value={formData.city} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
              <TextField name="rent" type="number" label="Monthly Rent" value={formData.rent} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
              <TextField select name="type" label="Property Type" value={formData.type} onChange={handleChange} fullWidth sx={{ mb: 2 }}>
                <MenuItem value="">Select Property Type</MenuItem>
                {propertyTypes.map((type) => (
                  <MenuItem key={type} value={type}>{type}</MenuItem>
                ))}
              </TextField>
              <TextField name="description" label="Property Description" value={formData.description} onChange={handleChange} fullWidth multiline minRows={3} sx={{ mb: 2 }} />
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" mb={1}>Property Images</Typography>
                <input type="file" accept="image/*" onChange={handleImageChange} />
                {imagePreview && (
                  <Box sx={{ mt: 2 }}>
                    <img src={imagePreview} alt="Preview" style={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: 8 }} />
                  </Box>
                )}
              </Box>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
              <Button variant="outlined" color="secondary" onClick={() => setShowAddModal(false)}>
                Cancel
              </Button>
              <Button variant="contained" color="primary" onClick={handleAddSubmit}>
                Add Property
              </Button>
            </Box>
          </Paper>
        </Box>
      )}
      {/* Edit Modal */}
      {showEditModal && (
        <Box sx={{ position: 'fixed', inset: 0, zIndex: 1300, bgcolor: 'rgba(0,0,0,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Paper sx={{ p: 4, borderRadius: 1, width: '100%', maxWidth: 480, boxShadow: 8 }}>
            <Typography variant="h5" fontWeight={700} color="primary.main" mb={3}>Edit Property</Typography>
            <Box className="space-y-5" component="form">
              <TextField name="title" label="Property Title" value={formData.title} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
              <TextField name="city" label="City" value={formData.city} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
              <TextField name="rent" type="number" label="Monthly Rent" value={formData.rent} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
              <TextField select name="type" label="Property Type" value={formData.type} onChange={handleChange} fullWidth sx={{ mb: 2 }}>
                <MenuItem value="">Select Property Type</MenuItem>
                {propertyTypes.map((type) => (
                  <MenuItem key={type} value={type}>{type}</MenuItem>
                ))}
              </TextField>
              <TextField name="description" label="Property Description" value={formData.description} onChange={handleChange} fullWidth multiline minRows={3} sx={{ mb: 2 }} />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
              <Button variant="outlined" color="secondary" onClick={() => setShowEditModal(false)}>
                Cancel
              </Button>
              <Button variant="contained" color="primary" onClick={handleEditSubmit}>
                Update Property
              </Button>
            </Box>
          </Paper>
        </Box>
      )}
      {/* Info Modal */}
      {showInfoModal && selectedInfoProduct && (
        <Box sx={{ position: 'fixed', inset: 0, zIndex: 1300, bgcolor: 'rgba(0,0,0,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Paper sx={{ p: 4, borderRadius: 1, width: '100%', maxWidth: 480, boxShadow: 8 }}>
            <Typography variant="h5" fontWeight={700} color="primary.main" mb={3}>Property Details</Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 2, mb: 2 }}>
              <Typography color="text.secondary" fontWeight={600}>Title</Typography>
              <Typography color="text.primary">{selectedInfoProduct.title}</Typography>
              <Typography color="text.secondary" fontWeight={600}>City</Typography>
              <Typography color="text.primary">{selectedInfoProduct.city}</Typography>
              <Typography color="text.secondary" fontWeight={600}>Monthly Rent</Typography>
              <Typography color="primary.main" fontWeight={700}>₹{selectedInfoProduct.rent.toLocaleString('en-IN')}</Typography>
              <Typography color="text.secondary" fontWeight={600}>Type</Typography>
              <Chip label={selectedInfoProduct.type} color="secondary" size="small" sx={{ fontWeight: 700 }} />
              <Typography color="text.secondary" fontWeight={600}>Contact Email</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ width: 28, height: 28, bgcolor: 'primary.light', color: 'primary.dark', fontWeight: 700, fontSize: 16, mr: 1 }}>
                  {selectedInfoProduct.email[0].toUpperCase()}
                </Avatar>
                <Typography color="text.primary">{selectedInfoProduct.email}</Typography>
              </Box>
              <Typography color="text.secondary" fontWeight={600}>Listed On</Typography>
              <Typography color="text.primary">{new Date(selectedInfoProduct.createdAt).toLocaleString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true })}</Typography>
              <Typography color="text.secondary" fontWeight={600}>Last Updated</Typography>
              <Typography color="text.primary">{new Date(selectedInfoProduct.updatedAt).toLocaleString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true })}</Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ pt: 2 }}>
              <Typography color="text.secondary" fontWeight={600} mb={1}>Description</Typography>
              <Typography color="text.primary">{selectedInfoProduct.description}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
              <Button variant="outlined" color="secondary" onClick={() => setShowInfoModal(false)}>
                Close
              </Button>
            </Box>
          </Paper>
        </Box>
      )}
    </Box>
  );
};

export default ListingPage;
