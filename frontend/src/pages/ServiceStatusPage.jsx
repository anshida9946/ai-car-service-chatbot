import { useState, useEffect } from 'react';
import {
  Search, Clock, CheckCircle, AlertCircle, Car, Calendar,
  MapPin, Wrench
} from 'lucide-react';
import { getMyBookings } from '../services/bookingApi';

// ── Stage mapping (mirrors ServiceTracker logic exactly) ─────────────────────
const STAGES = [
  'Booking Confirmed',
  'Vehicle Received',
  'Service in Progress',
  'Quality Check',
  'Ready for Pickup',
];

const statusToStageIndex = (status) => {
  switch (status) {
    case 'Approved':   return 0;
    case 'In Service': return 2;
    case 'Completed':  return 4;
    default:           return -1; // Pending / Cancelled
  }
};

// Convert a booking from the API into the display shape
const bookingToService = (b) => {
  const stageIndex = statusToStageIndex(b.status);
  return {
    id: `SRV-${String(b.id).padStart(3, '0')}`,
    bookingId: b.id,
    service: b.service_type,
    vehicle: `${b.car_model} (${b.vehicle_number})`,
    status: b.status,
    date: b.booking_date,
    time: b.booking_time,
    location: 'Hippo Cars Service Center, Kochi',
    stages: STAGES.map((name, index) => ({
      name,
      completed: stageIndex >= 0 && index <= stageIndex,
      current: index === stageIndex,
    })),
  };
};

export default function ServiceStatusPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [bookings, setBookings]     = useState([]);
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    getMyBookings()
      .then(res => setBookings(res.data.map(bookingToService)))
      .catch(err => console.error('Failed to load bookings:', err))
      .finally(() => setLoading(false));
  }, []);

  // ── Helpers ───────────────────────────────────────────────────────────────
  const getStatusColors = (status) => {
    switch (status) {
      case 'Completed':  return { bg: 'bg-green-50',  dot: 'bg-green-500',  badge: 'bg-green-100 text-green-700',  border: 'border-green-200' };
      case 'In Service': return { bg: 'bg-blue-50',   dot: 'bg-blue-500',   badge: 'bg-blue-100 text-blue-700',    border: 'border-blue-200' };
      case 'Approved':   return { bg: 'bg-yellow-50', dot: 'bg-yellow-500', badge: 'bg-yellow-100 text-yellow-700',border: 'border-yellow-200' };
      case 'Cancelled':  return { bg: 'bg-red-50',    dot: 'bg-red-400',    badge: 'bg-red-100 text-red-700',      border: 'border-red-200' };
      default:           return { bg: 'bg-gray-50',   dot: 'bg-gray-400',   badge: 'bg-gray-100 text-gray-700',    border: 'border-gray-200' };
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'Approved':   return 'Confirmed';
      case 'In Service': return 'In Progress';
      case 'Completed':  return 'Completed';
      case 'Cancelled':  return 'Cancelled';
      default:           return 'Pending';
    }
  };

  const getProgress = (stages) => {
    const done = stages.filter(s => s.completed).length;
    return (done / stages.length) * 100;
  };

  const filteredBookings = bookings.filter(b =>
    b.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.vehicle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-100">

      {/* Hero Banner */}
      <div className="relative bg-gradient-to-r from-blue-800 to-blue-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img
            src="https://images.unsplash.com/photo-1485291571150-772bcfc10da5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
            alt="Car Service"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 py-16">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-blue-700/50 backdrop-blur rounded-full px-4 py-1.5 mb-4">
                <Wrench className="w-4 h-4" />
                <span className="text-sm font-medium">Track Your Service</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-3">Service Status</h1>
              <p className="text-lg text-blue-100">Track your vehicle service progress in real-time</p>
            </div>
            <div className="flex gap-3">
              <div className="bg-blue-700/50 backdrop-blur rounded-xl px-5 py-3 text-center">
                <div className="text-2xl font-bold">24/7</div>
                <div className="text-xs text-blue-100">Support</div>
              </div>
              <div className="bg-blue-700/50 backdrop-blur rounded-xl px-5 py-3 text-center">
                <div className="text-2xl font-bold">100%</div>
                <div className="text-xs text-blue-100">Genuine Parts</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Search */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by service ID, service type, or vehicle..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500">Loading your service history...</p>
          </div>
        )}

        {/* Bookings List */}
        {!loading && (
          <div className="space-y-6">
            {filteredBookings.map((booking) => {
              const progress     = getProgress(booking.stages);
              const statusColors = getStatusColors(booking.status);

              return (
                <div key={booking.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">

                  {/* Status Header */}
                  <div className={`p-4 ${statusColors.bg} border-b ${statusColors.border}`}>
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${statusColors.dot} ${booking.status === 'In Service' ? 'animate-pulse' : ''}`} />
                        <span className="font-semibold text-gray-700">{booking.id}</span>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors.badge}`}>
                        {getStatusLabel(booking.status)}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    {/* Service Header */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Car className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{booking.service}</h3>
                        <p className="text-sm text-gray-600">{booking.vehicle}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6">
                      <span className="flex items-center gap-1">
                        <Calendar size={14} />{booking.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={14} />{booking.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin size={14} />{booking.location}
                      </span>
                    </div>

                    {/* Progress Bar — only meaningful for active bookings */}
                    {booking.status !== 'Pending' && booking.status !== 'Cancelled' && (
                      <div className="mb-6">
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                          <span>Progress</span>
                          <span>{Math.round(progress)}% Complete</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 rounded-full h-2 transition-all duration-500"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Stage Timeline */}
                    {booking.status !== 'Pending' && booking.status !== 'Cancelled' && (
                      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-4">
                        {booking.stages.map((stage, idx) => (
                          <div key={idx} className="text-center">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2 ${
                              stage.completed
                                ? stage.current
                                  ? 'bg-blue-500 ring-4 ring-blue-200'
                                  : 'bg-green-500'
                                : 'bg-gray-200'
                            }`}>
                              {stage.completed
                                ? <CheckCircle size={16} className="text-white" />
                                : <span className="text-xs font-semibold text-gray-500">{idx + 1}</span>
                              }
                            </div>
                            <p className={`text-xs font-medium ${stage.completed ? 'text-gray-900' : 'text-gray-400'}`}>
                              {stage.name}
                            </p>
                            {stage.current && (
                              <p className="text-xs text-blue-600 mt-1 font-medium">← Now</p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Status messages for Pending / Cancelled */}
                    {booking.status === 'Pending' && (
                      <div className="flex items-center gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <Clock className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                        <p className="text-sm text-yellow-800">
                          Your booking is pending approval. We'll confirm it shortly.
                        </p>
                      </div>
                    )}
                    {booking.status === 'Cancelled' && (
                      <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                        <p className="text-sm text-red-800">This booking has been cancelled.</p>
                      </div>
                    )}
                    {booking.status === 'Completed' && (
                      <div className="items-center gap-2 px-3 py-1.5 bg-green-50 rounded-lg inline-flex">
                        <CheckCircle size={16} className="text-green-600" />
                        <span className="text-sm text-green-700 font-medium">Service completed — ready for pickup!</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Empty state */}
            {filteredBookings.length === 0 && (
              <div className="bg-white rounded-xl shadow-md p-12 text-center">
                <AlertCircle size={48} className="text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No services found</h3>
                <p className="text-gray-600">
                  {bookings.length === 0
                    ? "You haven't booked any services yet."
                    : 'Try adjusting your search.'}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}