import { useState, useEffect } from 'react';
import { 
  Plus, Edit2, Trash2, DollarSign, Clock, Save, X, 
  Wrench, Sparkles, Search, Filter, TrendingUp, 
  AlertCircle, CheckCircle, BarChart3, Settings,
  Shield, Award, Zap, Star, Eye, EyeOff, Copy,
  ChevronDown, MoreVertical, RefreshCw, Calendar,
  Bell, MessageCircle, Check
} from 'lucide-react';

// Assuming these API functions are imported from your serviceApi file
import {
  getAllServicesAdmin,
  addService,
  deleteService,
  updateService,
  togglePopular,
} from "../../services/serviceApi";

export default function ManageServicesPage() {
  const [services, setServices] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [viewMode, setViewMode] = useState('table');
  const [showStats, setShowStats] = useState(true);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    duration: '',
    description: '',
  });

  // Fetch services from API
  const fetchServices = async () => {
    try {
      const res = await getAllServicesAdmin();
      const formatted = res.data.map((s) => ({
        id: s.id,
        name: s.name,
        price: s.price,
        duration: s.duration,
        description: s.description,
        active: s.status === "Active",
        popular: s.is_popular,
        bookings: s.bookings || 0,
        rating: s.rating || 0,
      }));
      setServices(formatted);
    } catch (err) {
      console.error("Fetch error:", err);
      showNotification("Failed to fetch services", "error");
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // Auto-hide notification after 3 seconds
  useEffect(() => {
    if (notification.show) {
      const timer = setTimeout(() => {
        setNotification({ show: false, message: '', type: 'success' });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification.show]);

  const formatIndianPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
  };

  const handleAdd = async () => {
    if (!formData.name || !formData.price || !formData.duration) {
      showNotification("Please fill all required fields", "error");
      return;
    }

    try {
      const payload = {
        name: formData.name.trim(),
        description: formData.description?.trim() || "No description provided",
        price: Number(formData.price),
        duration: formData.duration.trim(),
        status: "Active",
      };

      console.log("Sending payload:", payload);

      await addService(payload);

      await fetchServices();

      const addedName = formData.name;

      setFormData({
        name: "",
        price: "",
        duration: "",
        description: "",
      });

      setIsAdding(false);

      showNotification(`"${addedName}" added successfully`, "success");
    } catch (err) {
      console.log("Add error:", err.response?.data);

      showNotification(
        err.response?.data?.detail ||
        JSON.stringify(err.response?.data) ||
        "Error adding service",
        "error"
      );
    }
  };

  const handleEdit = (service) => {
    setEditingId(service.id);
    setFormData({
      name: service.name,
      price: service.price.toString(),
      duration: service.duration,
      description: service.description,
    });
  };

  const handleUpdate = async () => {
    if (editingId) {
      try {
        const payload = {
          name: formData.name,
          description: formData.description,
          price: parseFloat(formData.price),
          duration: formData.duration,
        };
        
        await updateService(editingId, payload);
        await fetchServices();
        
        setEditingId(null);
        setFormData({ name: '', price: '', duration: '', description: '' });
        showNotification(`✏️ "${formData.name}" has been updated successfully!`, 'info');
      } catch (err) {
        console.error("Update Error:", err);
        showNotification("Error updating service", "error");
      }
    }
  };

  const handleDelete = async (id) => {
    const serviceToDelete = services.find(s => s.id === id);
    if (window.confirm(`Are you sure you want to delete "${serviceToDelete?.name}"?`)) {
      try {
        await deleteService(id);
        await fetchServices();
        showNotification(`🗑️ "${serviceToDelete?.name}" has been deleted successfully!`, 'error');
      } catch (err) {
        console.error("Delete Error:", err);
        showNotification("Error deleting service", "error");
      }
    }
  };

  const toggleActive = async (id) => {
    const service = services.find(s => s.id === id);
    try {
      await updateService(id, {
        status: service.active ? "Inactive" : "Active",
      });
      await fetchServices();
      const newStatus = !service.active;
      showNotification(`${service.name} is now ${newStatus ? 'Active' : 'Inactive'}!`, 'info');
    } catch (err) {
      console.error("Toggle Active Error:", err);
      showNotification("Error updating service status", "error");
    }
  };

  const togglePopularHandler = async (id) => {
    const service = services.find(s => s.id === id);
    try {
      await togglePopular(id);
      await fetchServices();
      const newStatus = !service.popular;
      showNotification(`${service.name} is ${newStatus ? 'now marked as Popular' : 'removed from Popular'}!`, 'success');
    } catch (err) {
      console.error("Toggle Popular Error:", err);
      showNotification("Error updating popular status", "error");
    }
  };

  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          service.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || 
                          (filterStatus === 'active' && service.active) ||
                          (filterStatus === 'inactive' && !service.active);
    return matchesSearch && matchesStatus;
  });

  const stats = [
    { label: 'Total Services', value: services.length, icon: <Wrench className="w-5 h-5" />, color: 'blue', bg: 'bg-blue-500/10', text: 'text-blue-600' },
    { label: 'Active Services', value: services.filter(s => s.active).length, icon: <CheckCircle className="w-5 h-5" />, color: 'green', bg: 'bg-green-500/10', text: 'text-green-600' },
    { label: 'Popular Services', value: services.filter(s => s.popular).length, icon: <Star className="w-5 h-5" />, color: 'yellow', bg: 'bg-yellow-500/10', text: 'text-yellow-600' },
    { label: 'Total Bookings', value: services.reduce((acc, s) => acc + (s.bookings || 0), 0), icon: <Calendar className="w-5 h-5" />, color: 'purple', bg: 'bg-purple-500/10', text: 'text-purple-600' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Notification Toast */}
      {notification.show && (
        <div className={`fixed top-20 right-4 z-50 animate-slideInRight`}>
          <div className={`rounded-2xl shadow-2xl p-4 flex items-center gap-3 min-w-[300px] backdrop-blur-md ${
            notification.type === 'success' ? 'bg-green-500 text-white' :
            notification.type === 'error' ? 'bg-red-500 text-white' :
            'bg-blue-500 text-white'
          }`}>
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              {notification.type === 'success' && <Check className="w-5 h-5" />}
              {notification.type === 'error' && <Trash2 className="w-5 h-5" />}
              {notification.type === 'info' && <Edit2 className="w-5 h-5" />}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">{notification.message}</p>
            </div>
            <button 
              onClick={() => setNotification({ show: false, message: '', type: 'success' })}
              className="text-white/80 hover:text-white transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-cyan-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Wrench className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">Manage Services</h1>
                  <p className="text-gray-500 mt-1">Add, update, or remove available services</p>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => setViewMode(viewMode === 'table' ? 'grid' : 'table')}
                className="px-4 py-2 bg-white rounded-xl shadow-sm text-gray-600 hover:shadow-md transition flex items-center gap-2"
              >
                {viewMode === 'table' ? <BarChart3 className="w-4 h-4" /> : <Settings className="w-4 h-4" />}
                {viewMode === 'table' ? 'Grid View' : 'Table View'}
              </button>
              <button
                onClick={() => setIsAdding(true)}
                className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 transition shadow-lg hover:shadow-xl"
              >
                <Plus className="w-4 h-4" />
                Add Service
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        {showStats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            {stats.map((stat, idx) => (
              <div key={idx} className="bg-white rounded-2xl shadow-lg p-5 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 animate-fadeIn" style={{ animationDelay: `${idx * 0.1}s` }}>
                <div className="flex items-center justify-between mb-3">
                  <div className={`${stat.bg} p-3 rounded-xl`}>
                    <div className={stat.text}>{stat.icon}</div>
                  </div>
                  <TrendingUp className="w-4 h-4 text-green-500 opacity-0 group-hover:opacity-100 transition" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                <p className="text-sm text-gray-600 mt-1">{stat.label}</p>
                <div className="mt-3 h-1 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`w-3/4 h-full bg-gradient-to-r from-${stat.color}-500 to-${stat.color}-600 rounded-full`}></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Search and Filter Bar */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-5 mb-6 border border-white/20">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search services by name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
            >
              <option value="all">All Services</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>
            <button onClick={fetchServices} className="p-2.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition">
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Add/Edit Form Modal */}
        {(isAdding || editingId) && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                      <Wrench className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">
                      {isAdding ? 'Add New Service' : 'Edit Service'}
                    </h2>
                  </div>
                  <button
                    onClick={() => {
                      setIsAdding(false);
                      setEditingId(null);
                      setFormData({ name: '', price: '', duration: '', description: '' });
                    }}
                    className="text-gray-400 hover:text-gray-600 transition"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Service Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Oil Change"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Price (₹) *</label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="4999"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Duration *</label>
                    <input
                      type="text"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., 30 min"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                    <input
                      type="text"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Brief description"
                    />
                  </div>
                </div>
              </div>
              <div className="flex gap-3 p-6 border-t border-gray-200">
                <button
                  onClick={isAdding ? handleAdd : handleUpdate}
                  disabled={!formData.name || !formData.price || !formData.duration}
                  className="flex-1 px-6 py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 transition font-semibold disabled:opacity-50"
                >
                  <Save className="w-4 h-4 inline mr-2" />
                  {isAdding ? 'Add Service' : 'Update Service'}
                </button>
                <button
                  onClick={() => {
                    setIsAdding(false);
                    setEditingId(null);
                    setFormData({ name: '', price: '', duration: '', description: '' });
                  }}
                  className="flex-1 px-6 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Services List - Table View */}
        {viewMode === 'table' && (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                  <tr className="text-left text-sm font-semibold">
                    <th className="px-6 py-4">Service Name</th>
                    <th className="px-6 py-4">Price</th>
                    <th className="px-6 py-4">Duration</th>
                    <th className="px-6 py-4">Bookings</th>
                    <th className="px-6 py-4">Rating</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredServices.map((service) => (
                    <tr key={service.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center">
                            <Wrench className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{service.name}</p>
                            <p className="text-xs text-gray-500">{service.description}</p>
                          </div>
                          {service.popular && (
                            <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded-full flex items-center gap-1">
                              <Star className="w-3 h-3 fill-current" /> Popular
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-gray-900">{formatIndianPrice(service.price)}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="flex items-center gap-1 text-gray-700">
                          <Clock className="w-4 h-4 text-blue-500" />
                          {service.duration}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-medium text-gray-900">{service.bookings || 0}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="font-medium text-gray-900">{service.rating || 0}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => toggleActive(service.id)}
                          className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                            service.active 
                              ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {service.active ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => togglePopularHandler(service.id)}
                            className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition"
                            title={service.popular ? 'Remove from popular' : 'Mark as popular'}
                          >
                            <Star className={`w-4 h-4 ${service.popular ? 'fill-current' : ''}`} />
                          </button>
                          <button
                            onClick={() => handleEdit(service)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(service.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredServices.length === 0 && (
                    <tr>
                      <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                        <Wrench className="w-16 h-16 mx-auto mb-3 text-gray-300" />
                        <p className="text-lg font-medium">No services found</p>
                        <p className="text-sm mt-1">Try adjusting your search or add a new service</p>
                        <button
                          onClick={() => setIsAdding(true)}
                          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                        >
                          Add Your First Service
                        </button>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Services List - Grid View */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => (
              <div key={service.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group">
                <div className={`p-4 ${service.active ? 'bg-gradient-to-r from-blue-50 to-purple-50' : 'bg-gray-50'}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-md">
                        <Wrench className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{service.name}</h3>
                        <p className="text-xs text-gray-500">{service.duration}</p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => togglePopularHandler(service.id)}
                        className="p-1.5 text-yellow-500 hover:bg-yellow-50 rounded-lg transition"
                      >
                        <Star className={`w-4 h-4 ${service.popular ? 'fill-current' : ''}`} />
                      </button>
                      <button
                        onClick={() => handleEdit(service)}
                        className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(service.id)}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-sm text-gray-600 mb-3">{service.description}</p>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl font-bold text-gray-900">{formatIndianPrice(service.price)}</span>
                    <button
                      onClick={() => toggleActive(service.id)}
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        service.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {service.active ? 'Active' : 'Inactive'}
                    </button>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="w-4 h-4" />
                      <span>{service.bookings || 0} bookings</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium text-gray-700">{service.rating || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {filteredServices.length === 0 && (
              <div className="col-span-full bg-white rounded-2xl shadow-lg p-12 text-center">
                <Wrench className="w-16 h-16 mx-auto mb-3 text-gray-300" />
                <p className="text-lg font-medium text-gray-900">No services found</p>
                <p className="text-sm text-gray-500 mt-1">Try adjusting your search or add a new service</p>
                <button
                  onClick={() => setIsAdding(true)}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Add Your First Service
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
