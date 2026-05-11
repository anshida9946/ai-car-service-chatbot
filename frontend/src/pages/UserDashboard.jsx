import { useState, useEffect } from 'react';
import {
  Calendar, Car, Clock, CheckCircle,
  Menu, X, LayoutDashboard, BookOpen, Wrench, MessageCircle,
  User, LogOut, FileText, AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getMyBookings } from '../services/bookingApi';

export default function UserDashboard() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState('dashboard');

  // Real booking data from API
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);

  // Get user from localStorage
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : { name: 'User', email: '' };

  // ── Fetch user's bookings on mount ────────────────────────────────────────
  useEffect(() => {
    getMyBookings()
      .then((res) => setBookings(res.data))
      .catch((err) => console.error('Failed to load bookings:', err))
      .finally(() => setLoadingBookings(false));
  }, []);

  // ── Derived stats from real data ──────────────────────────────────────────
  const totalBookings    = bookings.length;
  const completedCount   = bookings.filter(b => b.status === 'Completed').length;
  const upcomingBookings = bookings.filter(b => ['Pending', 'Approved', 'In Service'].includes(b.status));

  // ── Helpers ───────────────────────────────────────────────────────────────
  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved':   return 'bg-green-100 text-green-700';
      case 'Pending':    return 'bg-yellow-100 text-yellow-700';
      case 'In Service': return 'bg-blue-100 text-blue-700';
      case 'Completed':  return 'bg-gray-100 text-gray-700';
      case 'Cancelled':  return 'bg-red-100 text-red-700';
      default:           return 'bg-gray-100 text-gray-700';
    }
  };

  const menuItems = [
    { id: 'dashboard',      label: 'Dashboard',      icon: LayoutDashboard, path: '/user-dashboard' },
    { id: 'book-service',   label: 'Book Service',   icon: BookOpen,        path: '/book-service' },
    { id: 'service-status', label: 'Service Status', icon: Wrench,          path: '/service-status' },
    { id: 'complaints',     label: 'Complaints',     icon: FileText,        path: '/complaints' },
    { id: 'profile',        label: 'Profile',        icon: User,            path: '/profile' },
    { id: 'ai-chatbot',     label: 'AI Chatbot',     icon: MessageCircle,   path: '/chatbot' },
  ];

  const handleMenuClick = (item) => {
    setActiveMenu(item.id);
    if (item.path) navigate(item.path);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="flex h-screen bg-gray-100">

      {/* ── Sidebar ─────────────────────────────────────────────────────── */}
      <div className={`${isSidebarOpen ? 'w-72' : 'w-20'} bg-gradient-to-b from-gray-900 to-gray-800 text-white transition-all duration-300 flex flex-col shadow-xl`}>

        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-700 flex items-center justify-between">
          <div className={`flex items-center gap-3 ${!isSidebarOpen && 'justify-center w-full'}`}>
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <span className="text-xl">🦛</span>
            </div>
            {isSidebarOpen && (
              <div>
                <h1 className="text-xl font-bold">HIPPO CARS</h1>
                <p className="text-xs text-gray-400">User Panel</p>
              </div>
            )}
          </div>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* User Info */}
        <div className={`p-4 border-b border-gray-700 ${!isSidebarOpen && 'text-center'}`}>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-xl font-bold">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            {isSidebarOpen && (
              <div className="flex-1">
                <p className="font-semibold text-sm">{user?.name || 'User'}</p>
                <p className="text-xs text-gray-400">{user?.email || ''}</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleMenuClick(item)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                activeMenu === item.id
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              } ${!isSidebarOpen && 'justify-center'}`}
            >
              <item.icon size={20} />
              {isSidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-200 ${
              !isSidebarOpen && 'justify-center'
            }`}
          >
            <LogOut size={20} />
            {isSidebarOpen && <span className="text-sm font-medium">Logout</span>}
          </button>
        </div>
      </div>

      {/* ── Main Content ─────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-8">

          {/* Welcome Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {user?.name || 'User'}!
            </h1>
            <p className="text-gray-600">Here's what's happening with your vehicle services</p>
          </div>

          {/* Stats Cards — driven by real booking data */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-600 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium uppercase tracking-wide">Total Bookings</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{totalBookings}</p>
                </div>
                <Calendar className="w-12 h-12 text-blue-600 opacity-80" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-600 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium uppercase tracking-wide">Completed</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{completedCount}</p>
                </div>
                <CheckCircle className="w-12 h-12 text-green-600 opacity-80" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-600 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium uppercase tracking-wide">Active / Upcoming</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{upcomingBookings.length}</p>
                </div>
                <Clock className="w-12 h-12 text-yellow-600 opacity-80" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-600 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium uppercase tracking-wide">Cancelled</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {bookings.filter(b => b.status === 'Cancelled').length}
                  </p>
                </div>
                <Car className="w-12 h-12 text-red-600 opacity-80" />
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-8">

            {/* Upcoming / Active Bookings */}
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                Active Bookings
              </h2>

              {loadingBookings ? (
                <div className="text-center py-8">
                  <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                  <p className="text-sm text-gray-500">Loading...</p>
                </div>
              ) : upcomingBookings.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <AlertCircle className="w-10 h-10 mx-auto mb-2 opacity-40" />
                  <p className="text-sm">No active bookings right now.</p>
                  <button
                    onClick={() => handleMenuClick({ id: 'book-service', path: '/book-service' })}
                    className="mt-3 text-blue-600 text-sm hover:underline"
                  >
                    Book a service →
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {upcomingBookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-300 hover:border-blue-300"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-900">{booking.service_type}</h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {booking.car_model} · {booking.vehicle_number}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(booking.status)}`}>
                          {booking.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {booking.booking_date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {booking.booking_time}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* All Bookings History */}
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600" />
                Booking History
              </h2>

              {loadingBookings ? (
                <div className="text-center py-8">
                  <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                  <p className="text-sm text-gray-500">Loading...</p>
                </div>
              ) : bookings.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <AlertCircle className="w-10 h-10 mx-auto mb-2 opacity-40" />
                  <p className="text-sm">No booking history yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {bookings.slice(0, 5).map((booking) => (
                    <div
                      key={booking.id}
                      className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-0"
                    >
                      <div className="mt-1">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          booking.status === 'Completed'
                            ? 'bg-green-100'
                            : booking.status === 'Cancelled'
                            ? 'bg-red-100'
                            : 'bg-blue-100'
                        }`}>
                          {booking.status === 'Completed'
                            ? <CheckCircle className="w-4 h-4 text-green-600" />
                            : booking.status === 'Cancelled'
                            ? <AlertCircle className="w-4 h-4 text-red-500" />
                            : <Clock className="w-4 h-4 text-blue-500" />
                          }
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{booking.service_type}</p>
                        <p className="text-sm text-gray-600 mt-0.5">{booking.car_model}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <p className="text-xs text-gray-500">{booking.booking_date}</p>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(booking.status)}`}>
                            {booking.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quick Action — AI Chatbot CTA */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg p-6 text-white">
            <h2 className="text-xl font-bold mb-2">Need Help?</h2>
            <p className="mb-4 text-blue-100">
              Our AI chatbot is available 24/7 to assist you with bookings and queries
            </p>
            <button
              onClick={() => handleMenuClick({ id: 'ai-chatbot', path: '/chatbot' })}
              className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              Chat with AI Assistant
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}