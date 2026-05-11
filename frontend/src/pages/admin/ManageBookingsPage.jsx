import { useState, useEffect } from 'react';
import {
  Search, CheckCircle, XCircle, Calendar, Clock, Filter,
  Eye, Phone, Mail, Car,
  User, FileText, Download, RefreshCw,
  AlertCircle, Settings, Wrench
} from 'lucide-react';
import { getAllBookings, updateBookingStatus } from '../../services/bookingApi';

export default function ManageBookingsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // ── Fetch all bookings from the backend on mount ──────────────────────────
  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getAllBookings();
      setBookings(res.data);
    } catch (err) {
      setError('Failed to load bookings. Make sure the backend is running.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ── Send status update to backend, then re-fetch ──────────────────────────
  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await updateBookingStatus(id, newStatus);
      fetchBookings(); // re-fetch so UI reflects database truth
    } catch (err) {
      alert('Failed to update status. Please try again.');
      console.error(err);
    }
  };

  const handleApprove      = (id) => handleStatusUpdate(id, 'Approved');
  const handleStartService = (id) => handleStatusUpdate(id, 'In Service');
  const handleComplete     = (id) => handleStatusUpdate(id, 'Completed');
  const handleCancel       = (id) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      handleStatusUpdate(id, 'Cancelled');
    }
  };

  // ── Derived stats from real data ──────────────────────────────────────────
  const stats = [
    { label: 'Total Bookings', value: bookings.length,                                          icon: <Calendar className="w-5 h-5" />, color: 'blue' },
    { label: 'Pending',        value: bookings.filter(b => b.status === 'Pending').length,       icon: <Clock className="w-5 h-5" />,    color: 'yellow' },
    { label: 'In Service',     value: bookings.filter(b => b.status === 'In Service').length,    icon: <Settings className="w-5 h-5" />, color: 'orange' },
    { label: 'Completed',      value: bookings.filter(b => b.status === 'Completed').length,     icon: <CheckCircle className="w-5 h-5" />, color: 'green' },
  ];

  // ── Helpers ───────────────────────────────────────────────────────────────
  const formatIndianPrice = (price) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency', currency: 'INR',
      minimumFractionDigits: 0, maximumFractionDigits: 0
    }).format(price);

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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Approved':   return <CheckCircle className="w-4 h-4" />;
      case 'Pending':    return <Clock className="w-4 h-4" />;
      case 'In Service': return <Settings className="w-4 h-4" />;
      case 'Completed':  return <CheckCircle className="w-4 h-4" />;
      case 'Cancelled':  return <XCircle className="w-4 h-4" />;
      default:           return <AlertCircle className="w-4 h-4" />;
    }
  };

  // ── Filter bookings by search term and status dropdown ────────────────────
  const filteredBookings = bookings.filter((booking) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      String(booking.id).includes(q) ||
      booking.full_name?.toLowerCase().includes(q) ||
      booking.car_model?.toLowerCase().includes(q) ||
      booking.vehicle_number?.toLowerCase().includes(q) ||
      booking.service_type?.toLowerCase().includes(q);

    const matchesFilter = filterStatus === 'all' || booking.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Manage Bookings</h1>
              <p className="text-gray-500 mt-1">View, approve, and manage customer bookings</p>
            </div>
            <button
              onClick={fetchBookings}
              className="ml-auto flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition text-sm text-gray-600"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>

        {/* Error banner */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            {error}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white rounded-2xl shadow-md p-5 hover:shadow-lg transition">
              <div className="flex items-center justify-between mb-3">
                <div className="p-3 rounded-xl bg-gray-100">
                  <div className="text-gray-600">{stat.icon}</div>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
              <p className="text-sm text-gray-600 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-2xl shadow-md p-5 mb-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by ID, name, vehicle, plate number or service..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="pl-9 pr-8 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
              >
                <option value="all">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="In Service">In Service</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="bg-white rounded-2xl shadow-md p-12 text-center">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading bookings...</p>
          </div>
        )}

        {/* Bookings List */}
        {!loading && (
          <div className="space-y-4">
            {filteredBookings.map((booking) => (
              <div key={booking.id} className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition">

                {/* Status Header Bar */}
                <div className={`p-3 ${
                  booking.status === 'Pending'    ? 'bg-yellow-50' :
                  booking.status === 'Approved'   ? 'bg-green-50'  :
                  booking.status === 'In Service' ? 'bg-blue-50'   : 'bg-gray-50'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                        {getStatusIcon(booking.status)}
                        <span className="ml-1">{booking.status}</span>
                      </span>
                      <span className="text-xs text-gray-500">ID: #{booking.id}</span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {booking.booking_date} | {booking.booking_time}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  {/* Customer Info + Action Buttons */}
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-md">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{booking.full_name}</h3>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="flex items-center gap-1 text-xs text-gray-500">
                            <Phone className="w-3 h-3" />
                            {booking.phone}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons — shown based on current status */}
                    <div className="flex gap-2 flex-wrap">
                      {booking.status === 'Pending' && (
                        <>
                          <button
                            onClick={() => handleApprove(booking.id)}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Approve
                          </button>
                          <button
                            onClick={() => handleCancel(booking.id)}
                            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm"
                          >
                            <XCircle className="w-4 h-4" />
                            Cancel
                          </button>
                        </>
                      )}
                      {booking.status === 'Approved' && (
                        <button
                          onClick={() => handleStartService(booking.id)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
                        >
                          Start Service
                        </button>
                      )}
                      {booking.status === 'In Service' && (
                        <button
                          onClick={() => handleComplete(booking.id)}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm"
                        >
                          Mark Complete
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Service Details Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                    <div className="bg-gray-50 rounded-xl p-3">
                      <p className="text-xs text-gray-500 mb-1">Service</p>
                      <p className="font-semibold text-gray-900 flex items-center gap-1">
                        <Wrench className="w-4 h-4 text-blue-500" />
                        {booking.service_type}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-3">
                      <p className="text-xs text-gray-500 mb-1">Vehicle</p>
                      <p className="font-semibold text-gray-900 flex items-center gap-1">
                        <Car className="w-4 h-4 text-green-500" />
                        {booking.car_model}
                      </p>
                      <p className="text-xs text-gray-500">{booking.vehicle_number}</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-3">
                      <p className="text-xs text-gray-500 mb-1">Booked on</p>
                      <p className="font-semibold text-gray-900 text-sm">
                        {new Date(booking.created_at).toLocaleDateString('en-IN')}
                      </p>
                    </div>
                  </div>

                  {/* Customer Notes (message field) */}
                  {booking.message && (
                    <div className="bg-blue-50 rounded-xl p-3 border border-blue-200">
                      <p className="text-sm font-medium text-blue-800 mb-1 flex items-center gap-1">
                        <FileText className="w-4 h-4" />
                        Customer Notes:
                      </p>
                      <p className="text-sm text-blue-700">{booking.message}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Empty state */}
            {filteredBookings.length === 0 && !loading && (
              <div className="bg-white rounded-2xl shadow-md p-12 text-center">
                <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No bookings found</h3>
                <p className="text-gray-600">
                  {bookings.length === 0
                    ? 'No bookings have been made yet.'
                    : 'Try adjusting your filters or search criteria.'}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}