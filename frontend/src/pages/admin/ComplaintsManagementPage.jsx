import { useState, useEffect } from 'react';
import {
  Search, MessageSquare, CheckCircle, Clock, Send,
  User, Tag, Calendar, AlertCircle, RefreshCw, X, Eye
} from 'lucide-react';
import axios from 'axios';

const API = axios.create({ baseURL: 'http://127.0.0.1:8000/api' });
API.interceptors.request.use((cfg) => {
  const token = localStorage.getItem('token');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

export default function ComplaintsManagementPage() {
  const [complaints, setComplaints]       = useState([]);
  const [loading, setLoading]             = useState(true);
  const [searchTerm, setSearchTerm]       = useState('');
  const [filterStatus, setFilterStatus]   = useState('all');
  const [respondingTo, setRespondingTo]   = useState(null);
  const [responseText, setResponseText]   = useState('');
  const [notification, setNotification]   = useState({ show: false, msg: '', ok: true });

  // ── Fetch all complaints ──────────────────────────────────────────────────
  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const res = await API.get('/complaints/all/');
      setComplaints(res.data);
    } catch (err) {
      showNotif('Failed to load complaints', false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchComplaints(); }, []);

  // ── Auto-hide notification ────────────────────────────────────────────────
  useEffect(() => {
    if (notification.show) {
      const t = setTimeout(() => setNotification(n => ({ ...n, show: false })), 3000);
      return () => clearTimeout(t);
    }
  }, [notification.show]);

  const showNotif = (msg, ok = true) => setNotification({ show: true, msg, ok });

  // ── Mark In Review ────────────────────────────────────────────────────────
  const handleMarkInReview = async (id) => {
    try {
      await API.put(`/complaints/status/${id}/`, { status: 'In Review' });
      showNotif('Complaint marked as In Review');
      fetchComplaints();
    } catch (err) {
      showNotif('Failed to update status', false);
    }
  };

  // ── Send Response & Resolve ───────────────────────────────────────────────
  const handleRespond = async (id) => {
    if (!responseText.trim()) return;
    try {
      await API.put(`/complaints/respond/${id}/`, { admin_response: responseText });
      showNotif('Response sent and complaint resolved ✓');
      setRespondingTo(null);
      setResponseText('');
      fetchComplaints();
    } catch (err) {
      showNotif('Failed to send response', false);
    }
  };

  // ── Helpers ───────────────────────────────────────────────────────────────
  const getStatusColor = (status) => {
    switch (status) {
      case 'Resolved':  return 'bg-green-100 text-green-700';
      case 'In Review': return 'bg-yellow-100 text-yellow-700';
      default:          return 'bg-red-100 text-red-700';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Resolved':  return <CheckCircle className="w-4 h-4" />;
      case 'In Review': return <Clock className="w-4 h-4" />;
      default:          return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getBgColor = (status) => {
    switch (status) {
      case 'Resolved':  return 'bg-green-50';
      case 'In Review': return 'bg-yellow-50';
      default:          return 'bg-red-50';
    }
  };

  const stats = [
    { label: 'Pending',   value: complaints.filter(c => c.status === 'Pending').length,   icon: <AlertCircle className="w-5 h-5" />, color: 'red' },
    { label: 'In Review', value: complaints.filter(c => c.status === 'In Review').length,  icon: <Clock className="w-5 h-5" />,       color: 'yellow' },
    { label: 'Resolved',  value: complaints.filter(c => c.status === 'Resolved').length,   icon: <CheckCircle className="w-5 h-5" />, color: 'green' },
  ];

  const filtered = complaints.filter(c => {
    const q = searchTerm.toLowerCase();
    const matchSearch =
      String(c.id).includes(q) ||
      c.subject?.toLowerCase().includes(q) ||
      c.username?.toLowerCase().includes(q) ||
      c.category?.toLowerCase().includes(q);
    const matchStatus = filterStatus === 'all' || c.status === filterStatus;
    return matchSearch && matchStatus;
  });

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-6xl mx-auto">

        {/* Toast */}
        {notification.show && (
          <div className="fixed top-20 right-4 z-50">
            <div className={`text-white rounded-xl shadow-2xl p-4 flex items-center gap-3 min-w-[300px] ${
              notification.ok ? 'bg-green-500' : 'bg-red-500'
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
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Complaints Management</h1>
              <p className="text-gray-500 mt-1">View and respond to customer complaints</p>
            </div>
          </div>
          <button
            onClick={fetchComplaints}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition text-sm text-gray-600"
          >
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          {stats.map((s, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-md p-5">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${
                s.color === 'red' ? 'bg-red-100 text-red-600' :
                s.color === 'yellow' ? 'bg-yellow-100 text-yellow-600' :
                'bg-green-100 text-green-600'
              }`}>
                {s.icon}
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{s.value}</h3>
              <p className="text-sm text-gray-600">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Search & Filter */}
        <div className="bg-white rounded-2xl shadow-md p-5 mb-6 flex flex-wrap gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text" placeholder="Search by ID, customer, or subject..."
              value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="In Review">In Review</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>

        {/* Loading */}
        {loading && (
          <div className="bg-white rounded-2xl shadow-md p-12 text-center">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500">Loading complaints...</p>
          </div>
        )}

        {/* Complaints List */}
        {!loading && (
          <div className="space-y-4">
            {filtered.map((c) => (
              <div key={c.id} className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition">

                {/* Card Header */}
                <div className={`p-4 border-b ${getBgColor(c.status)}`}>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{c.subject}</h3>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mt-1">
                        <span>ID: CMP-{String(c.id).padStart(3,'0')}</span>
                        {c.service_id && <><span>·</span><span>Service: {c.service_id}</span></>}
                        <span>·</span>
                        <span>{new Date(c.created_at).toLocaleDateString('en-IN')}</span>
                      </div>
                    </div>
                    <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(c.status)}`}>
                      {getStatusIcon(c.status)}
                      <span className="ml-1">{c.status}</span>
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  {/* Customer + Category + Date */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Customer</p>
                      <p className="font-semibold text-gray-900 flex items-center gap-1">
                        <User className="w-4 h-4 text-gray-400" />{c.username || 'User #' + c.user}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Category</p>
                      <p className="font-semibold text-gray-900 flex items-center gap-1">
                        <Tag className="w-4 h-4 text-gray-400" />{c.category}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Submitted On</p>
                      <p className="font-semibold text-gray-900 flex items-center gap-1">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        {new Date(c.created_at).toLocaleDateString('en-IN')}
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="bg-gray-50 rounded-xl p-4 mb-4">
                    <p className="text-xs text-gray-500 mb-1 font-medium">Description:</p>
                    <p className="text-sm text-gray-700">{c.message}</p>
                  </div>

                  {/* Admin response (already sent) */}
                  {c.admin_response && (
                    <div className="bg-green-50 rounded-xl p-4 border border-green-200 mb-4">
                      <p className="text-sm font-semibold text-green-800 mb-1 flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" /> Your Response:
                      </p>
                      <p className="text-sm text-green-700">{c.admin_response}</p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3">
                    {c.status === 'Pending' && (
                      <button
                        onClick={() => handleMarkInReview(c.id)}
                        className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition text-sm"
                      >
                        <Eye className="w-4 h-4" /> Mark as In Review
                      </button>
                    )}
                    {c.status !== 'Resolved' && (
                      <button
                        onClick={() => { setRespondingTo(c.id); setResponseText(''); }}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
                      >
                        <Send className="w-4 h-4" /> Send Response &amp; Resolve
                      </button>
                    )}
                  </div>

                  {/* Response textarea (inline) */}
                  {respondingTo === c.id && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Your Response</label>
                      <textarea
                        value={responseText}
                        onChange={(e) => setResponseText(e.target.value)}
                        rows={4}
                        placeholder="Type your response to the customer..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-sm"
                      />
                      <div className="flex gap-3 mt-3">
                        <button
                          onClick={() => handleRespond(c.id)}
                          disabled={!responseText.trim()}
                          className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium disabled:opacity-50"
                        >
                          <Send className="w-4 h-4" /> Send Response &amp; Resolve
                        </button>
                        <button
                          onClick={() => setRespondingTo(null)}
                          className="px-5 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition text-sm font-medium"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Empty state */}
            {filtered.length === 0 && (
              <div className="bg-white rounded-2xl shadow-md p-12 text-center">
                <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No complaints found</h3>
                <p className="text-gray-500">
                  {complaints.length === 0 ? 'No complaints have been submitted yet.' : 'Try adjusting your filters.'}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}