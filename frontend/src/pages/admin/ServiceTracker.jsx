import { useState, useEffect } from 'react';
import {
  Search, Edit2, Save, CheckCircle, Clock,
  User, Car, Target, X, Wrench, RefreshCw, Zap, AlertCircle
} from 'lucide-react';
import { getAllBookings, updateBookingStatus } from '../../services/bookingApi';

// ── Stage mapping ────────────────────────────────────────────────────────────
// Booking status  →  how many of the 5 stages are "completed"
//   Pending       →  0  (nothing done yet — booking not even confirmed)
//   Approved      →  1  (Booking Confirmed ✓)
//   In Service    →  3  (Booking Confirmed ✓, Vehicle Received ✓, Service in Progress ✓)
//   Completed     →  5  (all stages done)
//   Cancelled     →  —  (not shown in tracker)

const STAGES = [
  'Booking Confirmed',
  'Vehicle Received',
  'Service in Progress',
  'Quality Check',
  'Ready for Pickup',
];

const statusToStage = (status) => {
  switch (status) {
    case 'Approved':   return 0; // stage index 0 is current
    case 'In Service': return 2; // stage index 2 is current
    case 'Completed':  return 4; // all done
    default:           return -1; // Pending / Cancelled — nothing confirmed yet
  }
};

// What booking status to set when admin picks a stage
const stageToStatus = (stageIndex) => {
  if (stageIndex <= 0) return 'Approved';
  if (stageIndex <= 2) return 'In Service';
  return 'Completed';
};

// Convert a booking from the API into the shape this component uses
const bookingToService = (b) => ({
  id: `SRV-${String(b.id).padStart(3, '0')}`,
  bookingId: b.id,
  customer: b.full_name,
  service: b.service_type,
  vehicle: b.car_model,
  plateNumber: b.vehicle_number,
  phone: b.phone,
  currentStage: statusToStage(b.status),
  stages: STAGES,
  status: b.status,
  bookingDate: b.booking_date,
  bookingTime: b.booking_time,
  lastUpdated: new Date(b.created_at).toLocaleString('en-IN'),
});

export default function ServiceTracker() {
  const [searchTerm, setSearchTerm]       = useState('');
  const [editingId, setEditingId]         = useState(null);
  const [services, setServices]           = useState([]);
  const [loading, setLoading]             = useState(true);
  const [notification, setNotification]   = useState({ show: false, msg: '', ok: true });

  // ── Data ──────────────────────────────────────────────────────────────────
  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await getAllBookings();
      // Show only active bookings (not Pending/Cancelled) in the tracker
      const active = res.data.filter(b =>
        ['Approved', 'In Service', 'Completed'].includes(b.status)
      );
      setServices(active.map(bookingToService));
    } catch (err) {
      showNotif('Failed to load services', false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchServices(); }, []);

  // ── Auto-hide notification ────────────────────────────────────────────────
  useEffect(() => {
    if (notification.show) {
      const t = setTimeout(() => setNotification(n => ({ ...n, show: false })), 3000);
      return () => clearTimeout(t);
    }
  }, [notification.show]);

  const showNotif = (msg, ok = true) =>
    setNotification({ show: true, msg, ok });

  // ── Stage update ─────────────────────────────────────────────────────────
  const handleUpdateStage = async (bookingId, stageIndex, serviceName) => {
    const newStatus = stageToStatus(stageIndex);
    try {
      await updateBookingStatus(bookingId, newStatus);
      showNotif(`${serviceName} → ${newStatus}`);
      setEditingId(null);
      fetchServices();
    } catch (err) {
      showNotif('Failed to update status', false);
    }
  };

  // ── Helpers ───────────────────────────────────────────────────────────────
  const getProgress = (service) =>
    service.currentStage < 0
      ? 0
      : ((service.currentStage + 1) / service.stages.length) * 100;

  const filteredServices = services.filter(s =>
    s.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.vehicle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.service.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="relative z-10 max-w-6xl mx-auto p-8">

        {/* Toast */}
        {notification.show && (
          <div className="fixed top-20 right-4 z-50">
            <div className={`text-white rounded-xl shadow-2xl p-4 flex items-center gap-3 min-w-[300px] ${
              notification.ok ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-red-500'
            }`}>
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm font-medium">{notification.msg}</p>
              <button onClick={() => setNotification(n => ({ ...n, show: false }))} className="ml-auto">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Service Tracker</h1>
              <p className="text-gray-500 mt-1">Track and manage service progress in real-time</p>
            </div>
          </div>
          <button
            onClick={fetchServices}
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm text-gray-600 hover:shadow-md transition"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>

        {/* Search */}
        <div className="bg-white rounded-2xl shadow-md p-5 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by service ID, customer, or vehicle..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="bg-white rounded-2xl shadow-md p-12 text-center">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500">Loading services...</p>
          </div>
        )}

        {/* Services List */}
        {!loading && (
          <div className="space-y-6">
            {filteredServices.map((service) => {
              const progress    = getProgress(service);
              const isCompleted = service.status === 'Completed';

              return (
                <div key={service.id} className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300">

                  {/* Card Header */}
                  <div className={`p-5 ${isCompleted ? 'bg-green-50' : 'bg-gradient-to-r from-blue-50 to-purple-50'}`}>
                    <div className="flex flex-wrap justify-between items-start gap-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h2 className="text-2xl font-bold text-gray-900">{service.service}</h2>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            isCompleted ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                          }`}>
                            {service.status}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1"><User className="w-4 h-4" />{service.customer}</span>
                          <span className="flex items-center gap-1"><Car className="w-4 h-4" />{service.vehicle} ({service.plateNumber})</span>
                          <span className="flex items-center gap-1"><Wrench className="w-4 h-4" />{service.bookingDate} · {service.bookingTime}</span>
                        </div>
                        <div className="flex gap-4 mt-2 text-xs text-gray-400">
                          <span>Service ID: {service.id}</span>
                          <span>Booking ID: #{service.bookingId}</span>
                        </div>
                      </div>

                      {!isCompleted && editingId !== service.id && (
                        <button
                          onClick={() => setEditingId(service.id)}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition shadow-md"
                        >
                          <Edit2 className="w-4 h-4" />
                          Update Status
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="p-6">
                    {/* Progress Bar */}
                    <div className="mb-8">
                      <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>Overall Progress</span>
                        <span className="font-semibold text-blue-600">{Math.round(progress)}% Complete</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-full h-2.5 transition-all duration-500"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Timeline */}
                    <div className="relative">
                      <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-200" />
                      <div className="space-y-6">
                        {service.stages.map((stage, index) => {
                          const done    = service.currentStage >= 0 && index <= service.currentStage;
                          const current = index === service.currentStage;
                          return (
                            <div key={index} className="relative flex items-start gap-4">
                              <div className="relative z-10">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                                  done
                                    ? current
                                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 ring-4 ring-blue-200 shadow-lg'
                                      : 'bg-green-500'
                                    : 'bg-gray-200'
                                }`}>
                                  {done
                                    ? <CheckCircle className="w-5 h-5 text-white" />
                                    : <span className="text-sm font-semibold text-gray-500">{index + 1}</span>
                                  }
                                </div>
                              </div>
                              <div className="flex-1 pt-1">
                                <p className={`font-semibold ${done ? 'text-gray-900' : 'text-gray-400'}`}>{stage}</p>
                                {current && (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full mt-1">
                                    <Zap className="w-3 h-3" /> Current Stage
                                  </span>
                                )}
                                {done && !current && <p className="text-xs text-green-600 mt-1">✓ Completed</p>}
                              </div>

                              {/* Set-as-current button (edit mode) */}
                              {editingId === service.id && index > service.currentStage && (
                                <button
                                  onClick={() => handleUpdateStage(service.bookingId, index, service.service)}
                                  className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs rounded-lg hover:from-blue-600 hover:to-purple-600 transition shadow-md"
                                >
                                  <Save className="w-3 h-3" /> Set as Current
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Stage Picker (edit mode) */}
                    {editingId === service.id && (
                      <div className="mt-8 pt-6 border-t border-gray-200">
                        <div className="bg-gray-50 rounded-xl p-5">
                          <div className="flex items-center gap-2 mb-3">
                            <Zap className="w-5 h-5 text-blue-500" />
                            <h4 className="font-semibold text-gray-900">Update Service Stage</h4>
                          </div>
                          <p className="text-sm text-gray-600 mb-4">Select which stage this service has reached:</p>
                          <div className="flex flex-wrap gap-3">
                            {service.stages.map((stage, index) => (
                              <button
                                key={index}
                                onClick={() => handleUpdateStage(service.bookingId, index, service.service)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                  index === service.currentStage
                                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md'
                                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                                }`}
                              >
                                {stage}
                              </button>
                            ))}
                          </div>
                          <button
                            onClick={() => setEditingId(null)}
                            className="mt-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300 transition font-medium"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Empty state */}
            {filteredServices.length === 0 && (
              <div className="bg-white rounded-2xl shadow-md p-12 text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No active services</h3>
                <p className="text-gray-500">
                  {services.length === 0
                    ? 'Approve a booking first to see it here.'
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