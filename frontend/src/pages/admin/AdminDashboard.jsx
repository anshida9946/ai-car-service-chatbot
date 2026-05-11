import { useState, useEffect } from 'react';
import {
  Users, Calendar, Activity,
  MessageSquare, Clock, Settings, Bell,
  LayoutDashboard, Wrench, BookOpen, FileText,
  Bot, LogOut, Menu, X, Target, BarChart3, AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API = axios.create({ baseURL: 'http://127.0.0.1:8000/api' });
API.interceptors.request.use((cfg) => {
  const token = localStorage.getItem('token');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeMenu, setActiveMenu]       = useState('dashboard');
  const [loading, setLoading]             = useState(true);

  // ── Real data state ───────────────────────────────────────────────────────
  const [bookings,   setBookings]   = useState([]);
  const [services,   setServices]   = useState([]);
  const [complaints, setComplaints] = useState([]);

  // ── Admin user from localStorage ─────────────────────────────────────────
  const userStr  = localStorage.getItem('user');
  const adminUser = (() => {
    try {
      const u = userStr ? JSON.parse(userStr) : {};
      return { name: u.name || u.username || 'Admin', email: u.email || 'admin@hippocars.com' };
    } catch { return { name: 'Admin', email: 'admin@hippocars.com' }; }
  })();

  const getInitials = () => {
    const parts = adminUser.name.split(' ');
    return parts.length >= 2
      ? (parts[0][0] + parts[1][0]).toUpperCase()
      : adminUser.name[0].toUpperCase();
  };

  // ── Fetch all data in parallel ────────────────────────────────────────────
  useEffect(() => {
    Promise.all([
      API.get('/bookings/all/'),
      API.get('/services/'),
      API.get('/complaints/all/'),
    ])
      .then(([bRes, sRes, cRes]) => {
        setBookings(bRes.data);
        setServices(sRes.data);
        setComplaints(cRes.data);
      })
      .catch(err => console.error('Dashboard fetch error:', err))
      .finally(() => setLoading(false));
  }, []);

  // ── Derived stats (all from real data) ───────────────────────────────────
  const totalBookings    = bookings.length;
  const activeServices   = services.filter(s => s.status === 'Active').length;
  const pendingComplaints = complaints.filter(c => c.status === 'Pending').length;
  const inServiceCount   = bookings.filter(b => b.status === 'In Service').length;

  // Today's bookings
  const todayStr    = new Date().toISOString().split('T')[0];
  const todayBookings = bookings.filter(b => b.booking_date === todayStr);

  // Recent bookings — last 5
  const recentBookings = [...bookings]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5);

  // ── Helpers ───────────────────────────────────────────────────────────────
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Approved':   return 'bg-green-100 text-green-700';
      case 'Pending':    return 'bg-yellow-100 text-yellow-700';
      case 'In Service': return 'bg-blue-100 text-blue-700';
      case 'Completed':  return 'bg-gray-100 text-gray-700';
      case 'Cancelled':  return 'bg-red-100 text-red-700';
      default:           return 'bg-gray-100 text-gray-600';
    }
  };

  const menuItems = [
    { id: 'dashboard',            label: 'Dashboard',       icon: LayoutDashboard, path: '/admin-dashboard' },
    { id: 'manage-services',      label: 'Manage Services', icon: Wrench,          path: '/admin/manage-services' },
    { id: 'manage-bookings',      label: 'Manage Bookings', icon: BookOpen,        path: '/admin/manage-bookings' },
    { id: 'service-tracker',      label: 'Service Tracker', icon: Target,          path: '/admin/service-tracker' },
    { id: 'complaints-management',label: 'Complaints',      icon: FileText,        path: '/admin/complaints-management' },
    { id: 'chatbot-monitoring',   label: 'AI Chatbot',      icon: Bot,             path: '/admin/chatbot-monitoring' },
  ];

  const handleMenuClick = (item) => {
    setActiveMenu(item.id);
    if (item.path) navigate(item.path);
  };

  const handleLogout = () => { localStorage.clear(); navigate('/login'); };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-100 flex">

      {/* ── Sidebar ────────────────────────────────────────────────────────── */}
      <div className={`${isSidebarOpen ? 'w-72' : 'w-20'} bg-gradient-to-b from-gray-900 to-gray-800 text-white transition-all duration-300 flex flex-col shadow-xl`}>
        <div className="p-6 border-b border-gray-700 flex items-center justify-between">
          <div className={`flex items-center gap-3 ${!isSidebarOpen && 'justify-center w-full'}`}>
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
              <span className="text-xl">🦛</span>
            </div>
            {isSidebarOpen && (
              <div>
                <h1 className="text-xl font-bold">HIPPO CARS</h1>
                <p className="text-xs text-gray-400">Admin Panel</p>
              </div>
            )}
          </div>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-gray-400 hover:text-white transition-colors">
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <div className={`p-4 border-b border-gray-700 ${!isSidebarOpen && 'text-center'}`}>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-xl font-bold">
              {getInitials()}
            </div>
            {isSidebarOpen && (
              <div className="flex-1">
                <p className="font-semibold text-sm truncate">{adminUser.name}</p>
                <p className="text-xs text-gray-400 truncate">{adminUser.email}</p>
              </div>
            )}
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleMenuClick(item)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                activeMenu === item.id
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              } ${!isSidebarOpen && 'justify-center'}`}
            >
              <item.icon size={20} />
              {isSidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-200 ${!isSidebarOpen && 'justify-center'}`}
          >
            <LogOut size={20} />
            {isSidebarOpen && <span className="text-sm font-medium">Logout</span>}
          </button>
        </div>
      </div>

      {/* ── Main Content ───────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto">

        {/* Top Header */}
        <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
          <div className="px-8 py-4 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-sm text-gray-500 mt-1">Overview of your service center operations</p>
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition">
                <Bell className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition">
                <Settings className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                <div className="text-right hidden md:block">
                  <p className="text-sm font-medium text-gray-900">{adminUser.name}</p>
                  <p className="text-xs text-gray-500">{adminUser.email}</p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                  {getInitials()}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8">

          {/* Loading skeleton */}
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[1,2,3,4].map(i => (
                <div key={i} className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-4" />
                  <div className="h-8 bg-gray-200 rounded w-1/3" />
                </div>
              ))}
            </div>
          )}

          {/* ── Stats Cards (real data) ──────────────────────────────────── */}
          {!loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

              <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition border-l-4 border-blue-500">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-lg bg-blue-100">
                    <Calendar className="w-6 h-6 text-blue-600" />
                  </div>
                  <span className="text-xs font-semibold px-2 py-1 rounded-full bg-blue-50 text-blue-600">
                    All time
                  </span>
                </div>
                <p className="text-gray-600 text-sm font-medium">Total Bookings</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{totalBookings}</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition border-l-4 border-green-500">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-lg bg-green-100">
                    <Activity className="w-6 h-6 text-green-600" />
                  </div>
                  <span className="text-xs font-semibold px-2 py-1 rounded-full bg-green-50 text-green-600">
                    Live
                  </span>
                </div>
                <p className="text-gray-600 text-sm font-medium">Active Services</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{activeServices}</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition border-l-4 border-yellow-500">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-lg bg-yellow-100">
                    <Clock className="w-6 h-6 text-yellow-600" />
                  </div>
                  <span className="text-xs font-semibold px-2 py-1 rounded-full bg-yellow-50 text-yellow-700">
                    Now
                  </span>
                </div>
                <p className="text-gray-600 text-sm font-medium">In Service</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{inServiceCount}</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition border-l-4 border-red-400">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-lg bg-red-100">
                    <MessageSquare className="w-6 h-6 text-red-500" />
                  </div>
                  <span className="text-xs font-semibold px-2 py-1 rounded-full bg-red-50 text-red-500">
                    Open
                  </span>
                </div>
                <p className="text-gray-600 text-sm font-medium">Pending Complaints</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{pendingComplaints}</p>
              </div>

            </div>
          )}

          {!loading && (
            <div className="grid lg:grid-cols-3 gap-8">

              {/* ── Recent Bookings Table ──────────────────────────────── */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl shadow-sm">
                  <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                      <Calendar className="w-6 h-6 text-blue-600" />
                      Recent Bookings
                    </h2>
                    <button
                      onClick={() => navigate('/admin/manage-bookings')}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      View all →
                    </button>
                  </div>

                  {recentBookings.length === 0 ? (
                    <div className="p-12 text-center text-gray-400">
                      <Calendar className="w-12 h-12 mx-auto mb-3 opacity-40" />
                      <p>No bookings yet</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                          <tr className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            <th className="px-6 py-3">ID</th>
                            <th className="px-6 py-3">Customer</th>
                            <th className="px-6 py-3">Service</th>
                            <th className="px-6 py-3">Vehicle</th>
                            <th className="px-6 py-3">Date</th>
                            <th className="px-6 py-3">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {recentBookings.map((b) => (
                            <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                              <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                #{b.id}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-700">{b.full_name}</td>
                              <td className="px-6 py-4 text-sm text-gray-700">{b.service_type}</td>
                              <td className="px-6 py-4 text-sm text-gray-700">
                                {b.car_model}
                                <span className="text-xs text-gray-400 block">{b.vehicle_number}</span>
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-700">
                                {b.booking_date}
                                <span className="text-xs text-gray-400 block">{b.booking_time}</span>
                              </td>
                              <td className="px-6 py-4">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(b.status)}`}>
                                  {b.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>

              {/* ── Right column ──────────────────────────────────────── */}
              <div className="space-y-6">

                {/* Today's Schedule */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Clock className="w-6 h-6 text-blue-600" />
                    Today's Bookings
                  </h2>

                  {todayBookings.length === 0 ? (
                    <div className="text-center py-6 text-gray-400">
                      <Clock className="w-10 h-10 mx-auto mb-2 opacity-40" />
                      <p className="text-sm">No bookings scheduled for today</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {todayBookings.slice(0, 5).map((b) => (
                        <div key={b.id} className="flex items-start justify-between pb-4 border-b border-gray-100 last:border-0">
                          <div>
                            <p className="font-medium text-gray-900">{b.service_type}</p>
                            <p className="text-sm text-gray-600">{b.full_name}</p>
                            <p className="text-xs text-gray-400">{b.booking_time} · {b.car_model}</p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ${getStatusBadge(b.status)}`}>
                            {b.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Quick Stats Card (real numbers) */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-sm p-6 text-white">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                      <BarChart3 className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-bold">Quick Stats</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-blue-100">Today's Bookings</span>
                      <span className="font-bold">{todayBookings.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-blue-100">Pending Approvals</span>
                      <span className="font-bold">
                        {bookings.filter(b => b.status === 'Pending').length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-blue-100">Completed (all time)</span>
                      <span className="font-bold">
                        {bookings.filter(b => b.status === 'Completed').length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-blue-100">Total Services Listed</span>
                      <span className="font-bold">{services.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-blue-100">Unresolved Complaints</span>
                      <span className="font-bold">
                        {complaints.filter(c => c.status !== 'Resolved').length}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Complaints Snapshot */}
                {complaints.filter(c => c.status === 'Pending').length > 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-5">
                    <h3 className="font-semibold text-red-800 mb-3 flex items-center gap-2">
                      <AlertCircle className="w-5 h-5" />
                      New Complaints
                    </h3>
                    <div className="space-y-2">
                      {complaints.filter(c => c.status === 'Pending').slice(0, 3).map(c => (
                        <div key={c.id} className="text-sm text-red-700 bg-white rounded-lg px-3 py-2 border border-red-100">
                          <p className="font-medium truncate">{c.subject}</p>
                          <p className="text-xs text-red-400 mt-0.5">{c.category}</p>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() => navigate('/admin/complaints-management')}
                      className="mt-3 text-xs text-red-600 hover:underline"
                    >
                      View all complaints →
                    </button>
                  </div>
                )}

              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}