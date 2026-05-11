import { useState, useRef } from 'react';
import { 
  User, Mail, Phone, Car, Save, Edit2, Calendar, CheckCircle, 
  Clock, Award, Shield, Zap, Star, TrendingUp, MapPin, 
  CreditCard, Gift, Headphones, Settings, LogOut, 
  Camera, Plus, Trash2, MoreVertical, ChevronRight, X,
  Upload, Image as ImageIcon, MessageSquare, HelpCircle,
  Diamond, Crown, Sparkles, Bell, Wallet, Ticket, 
  Activity, BarChart3, PieChart, Users, Target, Globe,
  Facebook, Twitter, Instagram, Linkedin, Smartphone
} from 'lucide-react';

export default function UserProfilePage() {
  const [user, setUser] = useState(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (e) {
        return null;
      }
    }
    return { name: 'Rajesh Kumar', email: 'rajesh@example.com', phone: '+91 98765 43210' };
  });

  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [showAddVehicle, setShowAddVehicle] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [profileImage, setProfileImage] = useState(() => {
    const savedImage = localStorage.getItem('profileImage');
    return savedImage || null;
  });
  const [showImageOptions, setShowImageOptions] = useState(false);
  const fileInputRef = useRef(null);
  
  const [vehicles, setVehicles] = useState([
    { id: 1, model: 'Honda Civic', year: 2020, plateNumber: 'KL-07-AB-1234', color: 'Silver', image: '🚗' },
    { id: 2, model: 'Toyota Camry', year: 2019, plateNumber: 'KL-07-CD-5678', color: 'Black', image: '🚙' },
  ]);

  const [newVehicle, setNewVehicle] = useState({
    model: '',
    year: '',
    plateNumber: '',
    color: '',
  });

  const [formData, setFormData] = useState({
    name: user?.name || 'Rajesh Kumar',
    email: user?.email || 'rajesh@example.com',
    phone: user?.phone || '+91 98765 43210',
    address: '123 Main Street, Kochi, Kerala 682001',
    city: 'Kochi',
    state: 'Kerala',
    pincode: '682001',
    occupation: 'Software Engineer',
  });

  const recentBookings = [
    { id: 1, service: 'Oil Change', date: '2026-04-20', status: 'completed', price: '₹4,999' },
    { id: 2, service: 'Brake Service', date: '2026-04-26', status: 'in-progress', price: '₹12,999' },
    { id: 3, service: 'Full Service', date: '2026-04-28', status: 'scheduled', price: '₹19,999' },
  ];

  const stats = [
    { label: 'Total Bookings', value: '12', icon: <Calendar className="w-5 h-5" />, change: '+12%', color: 'blue' },
    { label: 'Completed', value: '8', icon: <CheckCircle className="w-5 h-5" />, change: '+67%', color: 'green' },
    { label: 'In Progress', value: '2', icon: <Clock className="w-5 h-5" />, change: '+0%', color: 'orange' },
    { label: 'Member Since', value: '2025', icon: <Award className="w-5 h-5" />, change: 'Jan', color: 'purple' },
  ];

  const handleSave = () => {
    setIsEditing(false);
    const updatedUser = { ...user, name: formData.name, email: formData.email, phone: formData.phone };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleVehicleChange = (e) => {
    setNewVehicle({ ...newVehicle, [e.target.name]: e.target.value });
  };

  const handleAddVehicle = () => {
    if (newVehicle.model && newVehicle.year && newVehicle.plateNumber && newVehicle.color) {
      const vehicleToAdd = {
        id: vehicles.length + 1,
        ...newVehicle,
        image: getVehicleImage(newVehicle.model),
      };
      setVehicles([...vehicles, vehicleToAdd]);
      setNewVehicle({ model: '', year: '', plateNumber: '', color: '' });
      setShowAddVehicle(false);
    }
  };

  const handleEditVehicle = (vehicle) => {
    setEditingVehicle(vehicle);
    setNewVehicle({
      model: vehicle.model,
      year: vehicle.year,
      plateNumber: vehicle.plateNumber,
      color: vehicle.color,
    });
    setShowAddVehicle(true);
  };

  const handleUpdateVehicle = () => {
    if (newVehicle.model && newVehicle.year && newVehicle.plateNumber && newVehicle.color) {
      const updatedVehicles = vehicles.map(vehicle => 
        vehicle.id === editingVehicle.id 
          ? { ...vehicle, ...newVehicle, image: getVehicleImage(newVehicle.model) }
          : vehicle
      );
      setVehicles(updatedVehicles);
      setNewVehicle({ model: '', year: '', plateNumber: '', color: '' });
      setEditingVehicle(null);
      setShowAddVehicle(false);
    }
  };

  const handleDeleteVehicle = (id) => {
    if (window.confirm('Are you sure you want to remove this vehicle?')) {
      setVehicles(vehicles.filter(vehicle => vehicle.id !== id));
    }
  };

  const getVehicleImage = (model) => {
    const images = { 'Honda': '🚗', 'Toyota': '🚙', 'Hyundai': '🚘', 'Maruti': '🚕' };
    for (const [key, value] of Object.entries(images)) {
      if (model.includes(key)) return value;
    }
    return '🚗';
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700';
      case 'in-progress': return 'bg-blue-100 text-blue-700';
      case 'scheduled': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageData = reader.result;
        setProfileImage(imageData);
        localStorage.setItem('profileImage', imageData);
        setShowImageOptions(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setProfileImage(null);
    localStorage.removeItem('profileImage');
    setShowImageOptions(false);
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const getInitials = () => {
    const name = formData.name;
    if (name) {
      const nameParts = name.split(' ');
      if (nameParts.length >= 2) {
        return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
      }
      return nameParts[0][0].toUpperCase();
    }
    return '👤';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Animated Background Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-cyan-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
      </div>

      {/* Hero Section */}
      <div className="relative h-56 md:h-72 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="absolute inset-0 overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1485291571150-772bcfc10da5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
            alt="Car Service Background"
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        
        {/* Profile Image */}
        <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 md:left-10 md:transform-none">
          <div className="relative group">
            <div className="w-32 h-32 bg-white rounded-2xl shadow-2xl flex items-center justify-center border-4 border-white overflow-hidden">
              {profileImage ? (
                <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {getInitials()}
                </span>
              )}
            </div>
            <button 
              onClick={() => setShowImageOptions(!showImageOptions)}
              className="absolute bottom-0 right-0 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white hover:scale-110 transition shadow-lg"
            >
              <Camera className="w-4 h-4" />
            </button>
            
            {showImageOptions && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-200 z-20 overflow-hidden">
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                <button onClick={triggerFileInput} className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition">
                  <Upload className="w-4 h-4" /> Upload Photo
                </button>
                {profileImage && (
                  <button onClick={handleRemoveImage} className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-gray-50 flex items-center gap-2 transition">
                    <Trash2 className="w-4 h-4" /> Remove Photo
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pt-20 pb-8">
        {/* User Info Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                {formData.name}
              </h1>
              <div className="px-2 py-0.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs rounded-full">Premium</div>
            </div>
            <div className="flex items-center gap-3 mt-2">
              <span className="flex items-center gap-1.5 text-sm text-gray-500">
                <Mail className="w-4 h-4" /> {formData.email}
              </span>
              <span className="text-gray-300">|</span>
              <span className="flex items-center gap-1.5 text-sm text-gray-500">
                <Phone className="w-4 h-4" /> {formData.phone}
              </span>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="px-4 py-2 border border-red-200 text-red-600 rounded-xl hover:bg-red-50 transition flex items-center gap-2 mt-4 md:mt-0"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-8">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white rounded-2xl shadow-lg p-5 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-12 h-12 bg-${stat.color}-100 rounded-xl flex items-center justify-center`}>
                  <div className={`text-${stat.color}-600`}>{stat.icon}</div>
                </div>
                <span className="text-sm font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-full">
                  {stat.change}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
              <p className="text-sm text-gray-600 mt-1">{stat.label}</p>
              <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className={`w-3/4 h-full bg-gradient-to-r from-${stat.color}-500 to-${stat.color}-600 rounded-full`}></div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-200">
          {['profile', 'vehicles', 'bookings'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 text-sm font-medium transition-all ${
                activeTab === tab
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Profile Information Tab */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">Personal Information</h2>
                  </div>
                  {!isEditing ? (
                    <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-xl transition">
                      <Edit2 className="w-4 h-4" /> Edit
                    </button>
                  ) : (
                    <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 transition">
                      <Save className="w-4 h-4" /> Save Changes
                    </button>
                  )}
                </div>

                <div className="space-y-5">
                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input type="text" name="name" value={formData.name} onChange={handleChange} disabled={!isEditing}
                          className={`w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${!isEditing ? 'bg-gray-50' : ''}`} />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input type="email" name="email" value={formData.email} onChange={handleChange} disabled={!isEditing}
                          className={`w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${!isEditing ? 'bg-gray-50' : ''}`} />
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input type="tel" name="phone" value={formData.phone} onChange={handleChange} disabled={!isEditing}
                          className={`w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${!isEditing ? 'bg-gray-50' : ''}`} />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Occupation</label>
                      <div className="relative">
                        <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input type="text" name="occupation" value={formData.occupation} onChange={handleChange} disabled={!isEditing}
                          className={`w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${!isEditing ? 'bg-gray-50' : ''}`} />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input type="text" name="address" value={formData.address} onChange={handleChange} disabled={!isEditing}
                        className={`w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${!isEditing ? 'bg-gray-50' : ''}`} />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                      <input type="text" name="city" value={formData.city} onChange={handleChange} disabled={!isEditing}
                        className={`w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${!isEditing ? 'bg-gray-50' : ''}`} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Pincode</label>
                      <input type="text" name="pincode" value={formData.pincode} onChange={handleChange} disabled={!isEditing}
                        className={`w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${!isEditing ? 'bg-gray-50' : ''}`} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Vehicles Tab */}
            {activeTab === 'vehicles' && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                      <Car className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">My Vehicles</h2>
                  </div>
                  <button onClick={() => { setEditingVehicle(null); setNewVehicle({ model: '', year: '', plateNumber: '', color: '' }); setShowAddVehicle(true); }}
                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 transition flex items-center gap-2 shadow-md">
                    <Plus className="w-4 h-4" /> Add Vehicle
                  </button>
                </div>

                <div className="space-y-4">
                  {vehicles.map((vehicle) => (
                    <div key={vehicle.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition group">
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center text-4xl">
                            {vehicle.image}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 text-lg">{vehicle.model}</h3>
                            <div className="mt-1 grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-gray-600">
                              <p>Year: {vehicle.year}</p>
                              <p>Plate: {vehicle.plateNumber}</p>
                              <p>Color: {vehicle.color}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
                          <button onClick={() => handleEditVehicle(vehicle)} className="px-3 py-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition text-sm font-medium">
                            Edit
                          </button>
                          <button onClick={() => handleDeleteVehicle(vehicle.id)} className="px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-lg transition">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Bookings Tab */}
            {activeTab === 'bookings' && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Recent Bookings</h2>
                </div>
                <div className="space-y-3">
                  {recentBookings.map((booking) => (
                    <div key={booking.id} className="flex flex-wrap items-center justify-between gap-3 p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition">
                      <div>
                        <p className="font-semibold text-gray-900">{booking.service}</p>
                        <p className="text-sm text-gray-500">{booking.date}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusBadge(booking.status)}`}>
                          {booking.status}
                        </span>
                        <span className="font-semibold text-gray-900">{booking.price}</span>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Premium Membership Card Only */}
          <div className="space-y-6">
            <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl shadow-xl p-6 text-white">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full"></div>
              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/10 rounded-full"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                    <Crown className="w-7 h-7 text-yellow-400" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">Premium Member</h3>
                    <p className="text-xs text-blue-200">Since Jan 2025</p>
                  </div>
                </div>
                <p className="text-blue-100 text-sm mb-4">Enjoy exclusive benefits and priority service</p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-white rounded-full"></div>15% off all services</li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-white rounded-full"></div>Priority booking slots</li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-white rounded-full"></div>Free vehicle pickup & drop</li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-white rounded-full"></div>Dedicated support line</li>
                </ul>
                <button className="mt-5 w-full py-2.5 bg-white/20 rounded-xl hover:bg-white/30 transition text-sm font-medium">
                  View Benefits →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Vehicle Modal */}
      {showAddVehicle && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                  <Car className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">{editingVehicle ? 'Edit Vehicle' : 'Add New Vehicle'}</h2>
              </div>
              <button onClick={() => { setShowAddVehicle(false); setEditingVehicle(null); setNewVehicle({ model: '', year: '', plateNumber: '', color: '' }); }} className="text-gray-400 hover:text-gray-600 transition">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Model *</label>
                <input type="text" name="model" value={newVehicle.model} onChange={handleVehicleChange} placeholder="e.g., Honda City" className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div><label className="block text-sm font-medium text-gray-700 mb-2">Year *</label>
                <input type="number" name="year" value={newVehicle.year} onChange={handleVehicleChange} placeholder="e.g., 2020" min="1990" max="2026" className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div><label className="block text-sm font-medium text-gray-700 mb-2">Plate Number *</label>
                <input type="text" name="plateNumber" value={newVehicle.plateNumber} onChange={handleVehicleChange} placeholder="e.g., KL-07-AB-1234" className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div><label className="block text-sm font-medium text-gray-700 mb-2">Color *</label>
                <select name="color" value={newVehicle.color} onChange={handleVehicleChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Select Color</option>
                  <option value="Black">Black</option><option value="White">White</option><option value="Silver">Silver</option>
                  <option value="Blue">Blue</option><option value="Red">Red</option><option value="Grey">Grey</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 p-6 border-t border-gray-200">
              <button onClick={() => { setShowAddVehicle(false); setEditingVehicle(null); setNewVehicle({ model: '', year: '', plateNumber: '', color: '' }); }} className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition">Cancel</button>
              <button onClick={editingVehicle ? handleUpdateVehicle : handleAddVehicle} className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 transition flex items-center justify-center gap-2">
                <Car className="w-4 h-4" /> {editingVehicle ? 'Update Vehicle' : 'Add Vehicle'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper component
function Briefcase(props) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
    </svg>
  );
}