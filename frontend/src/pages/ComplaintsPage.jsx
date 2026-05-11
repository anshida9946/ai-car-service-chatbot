import { useState, useEffect } from 'react';
import {
  Send, MessageSquare, CheckCircle, Clock,
  AlertCircle, FileText, User,
  Zap, HelpCircle, Wrench, Phone, Mail, Headphones
} from 'lucide-react';
import axios from 'axios';

const API = axios.create({ baseURL: 'http://127.0.0.1:8000/api' });
API.interceptors.request.use((cfg) => {
  const token = localStorage.getItem('token');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

export default function ComplaintsPage() {
  const [formData, setFormData] = useState({
    subject: '', service_id: '', category: '', message: '',
  });
  const [submitting, setSubmitting]       = useState(false);
  const [submitted, setSubmitted]         = useState(false);
  const [submitError, setSubmitError]     = useState('');
  const [complaints, setComplaints]       = useState([]);
  const [loadingList, setLoadingList]     = useState(true);

  // ── Fetch user's complaints on mount ──────────────────────────────────────
  const fetchComplaints = () => {
    setLoadingList(true);
    API.get('/complaints/my/')
      .then(res => setComplaints(res.data))
      .catch(err => console.error('Failed to load complaints:', err))
      .finally(() => setLoadingList(false));
  };

  useEffect(() => { fetchComplaints(); }, []);

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError('');
    try {
      await API.post('/complaints/create/', formData);
      setSubmitted(true);
      setFormData({ subject: '', service_id: '', category: '', message: '' });
      fetchComplaints();  // refresh list immediately
      setTimeout(() => setSubmitted(false), 4000);
    } catch (err) {
      setSubmitError(
        err.response?.data?.detail ||
        JSON.stringify(err.response?.data) ||
        'Failed to submit. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // ── Helpers ───────────────────────────────────────────────────────────────
  const getStatusColor = (status) => {
    switch (status) {
      case 'Resolved':  return 'bg-green-100 text-green-700 border-green-200';
      case 'In Review': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default:          return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Resolved':  return <CheckCircle className="w-4 h-4" />;
      case 'In Review': return <Clock className="w-4 h-4" />;
      default:          return <MessageSquare className="w-4 h-4" />;
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-100">

      {/* Hero */}
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
                <MessageSquare className="w-4 h-4" />
                <span className="text-sm font-medium">Customer Support</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-3">Complaints &amp; Feedback</h1>
              <p className="text-lg text-blue-100">We value your feedback to improve our service</p>
            </div>
            <div className="flex gap-3">
              <div className="bg-blue-700/50 backdrop-blur rounded-xl px-5 py-3 text-center">
                <div className="text-2xl font-bold">24/7</div>
                <div className="text-xs text-blue-100">Support</div>
              </div>
              <div className="bg-blue-700/50 backdrop-blur rounded-xl px-5 py-3 text-center">
                <div className="text-2xl font-bold">48h</div>
                <div className="text-xs text-blue-100">Response</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">

          {/* ── Submit Form ─────────────────────────────────────────────── */}
          <div>
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center gap-3 mb-6 pb-3 border-b border-gray-200">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Wrench className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Submit New Complaint</h2>
              </div>

              {submitted && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-5 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 flex-shrink-0" />
                  <span>Your complaint has been submitted successfully!</span>
                </div>
              )}
              {submitError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-5 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span>{submitError}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subject <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text" name="subject" value={formData.subject}
                    onChange={handleChange} required
                    placeholder="Brief description of your concern"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Service ID (Optional)
                  </label>
                  <input
                    type="text" name="service_id" value={formData.service_id}
                    onChange={handleChange}
                    placeholder="e.g., SRV-2026-001"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="category" value={formData.category}
                    onChange={handleChange} required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select category</option>
                    <option value="Service Quality">Service Quality</option>
                    <option value="Service Delay">Service Delay</option>
                    <option value="Billing Issue">Billing Issue</option>
                    <option value="Staff Behavior">Staff Behavior</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="message" value={formData.message}
                    onChange={handleChange} required rows={6}
                    placeholder="Provide detailed information about your complaint..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>

                <button
                  type="submit" disabled={submitting}
                  className="w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  {submitting ? 'Submitting...' : 'Submit Complaint'}
                </button>
              </form>
            </div>
          </div>

          {/* ── Your Complaints (live from API) ─────────────────────────── */}
          <div>
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center gap-3 mb-6 pb-3 border-b border-gray-200">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-orange-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Your Complaints</h2>
              </div>

              {loadingList ? (
                <div className="text-center py-10">
                  <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Loading...</p>
                </div>
              ) : complaints.length === 0 ? (
                <div className="text-center py-12">
                  <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No complaints submitted yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {complaints.map((c) => (
                    <div key={c.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition">
                      <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
                        <div>
                          <h3 className="font-semibold text-gray-900">{c.subject}</h3>
                          <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 mt-1">
                            <span>ID: CMP-{String(c.id).padStart(3,'0')}</span>
                            {c.service_id && <><span>•</span><span>Service: {c.service_id}</span></>}
                            <span>•</span>
                            <span>{c.category}</span>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 border ${getStatusColor(c.status)}`}>
                          {getStatusIcon(c.status)}
                          <span className="ml-1">{c.status}</span>
                        </span>
                      </div>

                      <p className="text-xs text-gray-400 mb-3">
                        Submitted: {new Date(c.created_at).toLocaleDateString('en-IN')}
                      </p>

                      {/* Admin response */}
                      {c.admin_response ? (
                        <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                          <p className="text-sm font-medium text-green-800 mb-1">Response from Admin:</p>
                          <p className="text-sm text-green-700">{c.admin_response}</p>
                        </div>
                      ) : c.status === 'In Review' ? (
                        <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
                          <p className="text-sm text-yellow-700 flex items-center gap-2">
                            <Clock className="w-4 h-4 flex-shrink-0" />
                            Your complaint is being reviewed. We'll respond within 24-48 hours.
                          </p>
                        </div>
                      ) : c.status === 'Pending' ? (
                        <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                          <p className="text-sm text-gray-600 flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                            Awaiting review by our support team.
                          </p>
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Tips */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6 border border-blue-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Quick Tips</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              'Provide detailed information for faster resolution',
              'Include your service ID if available',
              'We respond to all complaints within 24-48 hours',
            ].map((tip, i) => (
              <div key={i} className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-700">{tip}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Bar */}
        <div className="mt-6 bg-white rounded-lg shadow-md p-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                <Headphones className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Need immediate assistance?</p>
                <p className="font-semibold text-gray-900">Contact our support team</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4" /> Call Now
              </button>
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4" /> Email Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}