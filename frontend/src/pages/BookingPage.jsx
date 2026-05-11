import { useState, useEffect } from 'react';
import { 
  Calendar, Car, Clock, CheckCircle, Wrench, Shield, 
  Headphones, Star, ArrowRight, Zap, Award, 
  Users, Sparkles, Gem, Gift, Loader, Phone, User, Hash, Edit3, MessageCircle
} from 'lucide-react';
import axios from 'axios';

export default function BookService() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");
  
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    car_model: "",
    vehicle_number: "",
    service_type: "",
    booking_date: "",
    booking_time: "",
    message: "",
  });
  
  const [submitted, setSubmitted] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedService, setSelectedService] = useState(null);

  const timeSlots = [
    '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
  ];

  const features = [
    { icon: <Shield className="w-5 h-5" />, title: "Certified Experts", desc: "250+ trained professionals" },
    { icon: <Zap className="w-5 h-5" />, title: "Quick Service", desc: "Same day delivery" },
    { icon: <Award className="w-5 h-5" />, title: "Quality Assured", desc: "1 Year warranty" },
    { icon: <Headphones className="w-5 h-5" />, title: "24/7 Support", desc: "Round the clock" }
  ];

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      setApiError("");
      
      const token = localStorage.getItem("token");
      const res = await axios.get("http://127.0.0.1:8000/api/services/", {
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      });
      
      let allServices = Array.isArray(res.data) ? res.data : [];
      
      const activeServices = allServices
        .filter(service => 
          service.status === "Active" || 
          service.status === "active" || 
          service.active === true
        )
        .map(service => ({
          id: service.id,
          name: service.name,
          price: Number(service.price || 0),
          duration: service.duration || "N/A",
          description: service.description || "No description",
          popular: service.is_popular || false,
          rating: service.rating || 4.5,
          reviews: service.bookings || 0,
          icon: getServiceIcon(service.name)
        }));
      
      setServices(activeServices);
      
      if (activeServices.length === 0) {
        setApiError("No active services available. Please check back later.");
      }
    } catch (err) {
      console.error("Service fetch failed:", err);
      setApiError("Unable to load services. Please try again later.");
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  const getServiceIcon = (name) => {
    const icons = {
      'oil': '🛢️',
      'tire': '🔄',
      'brake': '🛞',
      'engine': '⚙️',
      'full': '🔧',
      'ac': '❄️',
      'service': '🔧'
    };
    for (const [key, icon] of Object.entries(icons)) {
      if (name.toLowerCase().includes(key)) return icon;
    }
    return '🔧';
  };

  const formatIndianPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleServiceSelect = (service) => {
    setSelectedService(service);
    setFormData(prev => ({
      ...prev,
      service_type: service.id.toString()
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedService) {
      alert("Please select a service");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      
      const convertTime = (t) => {
        if (!t) return '';
        if (/^\d{2}:\d{2}:\d{2}$/.test(t)) return t;
        const [time, mod] = t.split(' ');
        let [h, m] = time.split(':');
        h = parseInt(h, 10);
        if (mod === 'AM') { if (h === 12) h = 0; }
        else { if (h !== 12) h += 12; }
        return String(h).padStart(2,'0') + ':' + m + ':00';
      };

      const bookingData = {
        full_name: formData.full_name,
        phone: formData.phone,
        car_model: formData.car_model,
        vehicle_number: formData.vehicle_number,
        service_type: selectedService.name,
        booking_date: formData.booking_date,
        booking_time: convertTime(formData.booking_time),
        message: formData.message,
      };

      await axios.post(
        "http://127.0.0.1:8000/api/bookings/create/",
        bookingData,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : undefined,
          },
        }
      );

      setCurrentStep(4);
      setSubmitted(true);
      
      setTimeout(() => {
        setSubmitted(false);
        setFormData({
          full_name: "",
          phone: "",
          car_model: "",
          vehicle_number: "",
          service_type: "",
          booking_date: "",
          booking_time: "",
          message: "",
        });
        setSelectedService(null);
        setCurrentStep(1);
      }, 5000);
      
    } catch (err) {
      console.error("Booking failed:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Booking failed. Please try again.");
    }
  };

  const nextStep = () => {
    if (currentStep === 1 && !selectedService) {
      alert("Please select a service");
      return;
    }
    if (currentStep === 2 && (!formData.full_name || !formData.phone || !formData.car_model || !formData.vehicle_number)) {
      alert("Please fill all required fields");
      return;
    }
    if (currentStep === 3 && (!formData.booking_date || !formData.booking_time)) {
      alert("Please select date and time");
      return;
    }
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-blue-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-300">Loading available services...</p>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-8">
        <div className="max-w-2xl w-full animate-fadeInUp">
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 text-center border border-white/20">
            <div className="relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 bg-green-500/20 rounded-full animate-ping"></div>
              </div>
              <div className="w-28 h-28 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 relative z-10 shadow-xl">
                <CheckCircle className="w-14 h-14 text-white" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Booking Confirmed! 🎉</h2>
            <p className="text-gray-300 mb-8">Your service appointment has been successfully booked.</p>
            
            <div className="bg-white/5 backdrop-blur rounded-2xl p-6 mb-8 text-left border border-white/10">
              <h3 className="font-bold text-white mb-4 text-lg flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-yellow-400" />
                Booking Details
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center pb-2 border-b border-white/10">
                  <span className="text-gray-400">Service</span>
                  <span className="text-gray-200">{selectedService?.name}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-white/10">
                  <span className="text-gray-400">Customer</span>
                  <span className="text-gray-200">{formData.full_name}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-white/10">
                  <span className="text-gray-400">Phone</span>
                  <span className="text-gray-200">{formData.phone}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-white/10">
                  <span className="text-gray-400">Vehicle</span>
                  <span className="text-gray-200">{formData.car_model} ({formData.vehicle_number})</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-white/10">
                  <span className="text-gray-400">Date & Time</span>
                  <span className="text-gray-200">{formData.booking_date} at {formData.booking_time}</span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-gray-400">Total Amount</span>
                  <span className="text-2xl font-bold text-green-400">{formatIndianPrice(selectedService?.price)}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setSubmitted(false);
                setFormData({
                  full_name: "",
                  phone: "",
                  car_model: "",
                  vehicle_number: "",
                  service_type: "",
                  booking_date: "",
                  booking_time: "",
                  message: "",
                });
                setSelectedService(null);
                setCurrentStep(1);
              }}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all font-semibold shadow-lg"
            >
              Book Another Service
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Navbar */}
      <nav className="relative z-10 bg-white/5 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center">
                <span className="text-xl">🦛</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">HIPPO CARS</h1>
                <p className="text-xs text-gray-400">Premium Auto Care</p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-6 text-sm text-gray-300">
              <a href="#" className="hover:text-white transition">Home</a>
              <a href="#" className="hover:text-white transition">Services</a>
              <a href="#" className="hover:text-white transition">About</a>
              <a href="#" className="hover:text-white transition">Contact</a>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center cursor-pointer hover:bg-white/20 transition">
                <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full flex items-center justify-center cursor-pointer">
                <span className="text-sm">👤</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur rounded-full px-4 py-2 mb-6">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              <span className="text-sm text-gray-300">Premium Car Service Booking</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
              Book Your Service
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Experience hassle-free car maintenance with our expert technicians
            </p>
          </div>

          {/* Steps Indicator */}
          <div className="max-w-3xl mx-auto mb-12">
            <div className="flex justify-between items-center">
              {[
                { step: 1, title: "Select Service", icon: <Wrench className="w-5 h-5" /> },
                { step: 2, title: "Your Details", icon: <Users className="w-5 h-5" /> },
                { step: 3, title: "Schedule Time", icon: <Calendar className="w-5 h-5" /> },
                { step: 4, title: "Confirmation", icon: <CheckCircle className="w-5 h-5" /> }
              ].map((item) => (
                <div key={item.step} className="flex-1 text-center relative">
                  <div className={`relative z-10 w-12 h-12 mx-auto rounded-full flex items-center justify-center transition-all duration-300 ${
                    currentStep >= item.step 
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/50' 
                      : 'bg-white/10 text-gray-400'
                  }`}>
                    {item.icon}
                  </div>
                  <div className={`text-xs mt-2 ${currentStep >= item.step ? 'text-white' : 'text-gray-500'}`}>
                    {item.title}
                  </div>
                  {item.step < 4 && (
                    <div className={`absolute top-5 left-1/2 w-full h-0.5 transition-all duration-300 ${
                      currentStep > item.step ? 'bg-gradient-to-r from-blue-500 to-indigo-500' : 'bg-white/10'
                    }`}></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* API Error Message */}
          {apiError && (
            <div className="max-w-3xl mx-auto mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-center">
              {apiError}
            </div>
          )}

          {/* Main Content */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Booking Form */}
            <div className="lg:col-span-2">
              <div className="bg-white/5 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/10">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Step 1: Service Selection */}
                  {currentStep === 1 && (
                    <div className="animate-fadeIn">
                      <label className="block text-sm font-semibold text-gray-300 mb-4">
                        Select Your Service
                      </label>
                      {services.length === 0 ? (
                        <div className="text-center py-8 text-gray-400">
                          <Wrench className="w-12 h-12 mx-auto mb-3 opacity-50" />
                          <p>No active services available</p>
                          <p className="text-sm mt-1">Please check back later</p>
                        </div>
                      ) : (
                        <div className="grid md:grid-cols-2 gap-4">
                          {services.map((service) => (
                            <div
                              key={service.id}
                              className={`relative p-4 rounded-xl cursor-pointer transition-all duration-300 ${
                                selectedService?.id === service.id
                                  ? 'bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border-2 border-blue-500 shadow-lg shadow-blue-500/20'
                                  : 'bg-white/5 border border-white/10 hover:bg-white/10 hover:scale-105'
                              }`}
                              onClick={() => handleServiceSelect(service)}
                            >
                              <div className="flex justify-between items-start mb-2">
                                <span className="text-3xl">{service.icon}</span>
                                {service.popular && (
                                  <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full">
                                    Popular
                                  </span>
                                )}
                              </div>
                              <h4 className="font-semibold text-white">{service.name}</h4>
                              <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
                                <Clock className="w-3 h-3" />
                                {service.duration}
                              </div>
                              <div className="mt-2">
                                <span className="text-xl font-bold text-blue-400">{formatIndianPrice(service.price)}</span>
                              </div>
                              <div className="flex items-center gap-1 mt-2">
                                <Star className="w-3 h-3 text-yellow-400 fill-current" />
                                <span className="text-xs text-gray-400">{service.rating} ({service.reviews} bookings)</span>
                              </div>
                              {selectedService?.id === service.id && (
                                <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                                  <CheckCircle className="w-4 h-4 text-white" />
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Step 2: Customer Details */}
                  {currentStep === 2 && (
                    <div className="space-y-5 animate-fadeIn">
                      {/* Full Name */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">
                          <User className="w-3 h-3 inline mr-1" />
                          Full Name <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="text"
                          name="full_name"
                          value={formData.full_name}
                          onChange={handleChange}
                          placeholder="Enter your full name"
                          required
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500 transition-all"
                        />
                      </div>

                      {/* Phone Number */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">
                          <Phone className="w-3 h-3 inline mr-1" />
                          Phone Number <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="Enter your phone number"
                          required
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500 transition-all"
                        />
                      </div>

                      {/* Car Model */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">
                          <Car className="w-3 h-3 inline mr-1" />
                          Car Model <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="text"
                          name="car_model"
                          value={formData.car_model}
                          onChange={handleChange}
                          placeholder="e.g., Honda Civic 2020"
                          required
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500 transition-all"
                        />
                      </div>

                      {/* Vehicle Number */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">
                          <Hash className="w-3 h-3 inline mr-1" />
                          Vehicle Number <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="text"
                          name="vehicle_number"
                          value={formData.vehicle_number}
                          onChange={handleChange}
                          placeholder="e.g., ABC-1234"
                          required
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500 transition-all"
                        />
                      </div>

                      {/* Additional Notes */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">
                          <MessageCircle className="w-3 h-3 inline mr-1" />
                          Additional Notes (Optional)
                        </label>
                        <textarea
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          rows={3}
                          placeholder="Any specific concerns or requirements..."
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500 resize-none transition-all"
                        />
                      </div>
                    </div>
                  )}

                  {/* Step 3: Schedule Time */}
                  {currentStep === 3 && (
                    <div className="space-y-5 animate-fadeIn">
                      {/* Date Selection */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">
                          <Calendar className="w-3 h-3 inline mr-1" />
                          Preferred Date <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="date"
                          name="booking_date"
                          value={formData.booking_date}
                          onChange={handleChange}
                          min={new Date().toISOString().split('T')[0]}
                          required
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white transition-all"
                        />
                      </div>

                      {/* Time Slot Selection */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">
                          <Clock className="w-3 h-3 inline mr-1" />
                          Time Slot <span className="text-red-400">*</span>
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                          {timeSlots.map((slot) => (
                            <button
                              key={slot}
                              type="button"
                              onClick={() => setFormData({ ...formData, booking_time: slot })}
                              className={`px-4 py-2 rounded-xl transition-all ${
                                formData.booking_time === slot
                                  ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg'
                                  : 'bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10'
                              }`}
                            >
                              {slot}
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      {/* Selected Service Summary */}
                      {selectedService && (
                        <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10">
                          <p className="text-sm text-gray-400 mb-2">Selected Service Summary</p>
                          <div className="flex justify-between items-center">
                            <div>
                              <span className="text-white font-semibold">{selectedService.name}</span>
                              <p className="text-xs text-gray-400 mt-1">{selectedService.duration}</p>
                            </div>
                            <div className="text-right">
                              <span className="text-blue-400 font-bold text-lg">{formatIndianPrice(selectedService.price)}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Navigation Buttons */}
                  <div className="flex gap-4 pt-4">
                    {currentStep > 1 && currentStep < 4 && (
                      <button
                        type="button"
                        onClick={prevStep}
                        className="flex-1 px-6 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all font-semibold"
                      >
                        Back
                      </button>
                    )}
                    {currentStep < 3 ? (
                      <button
                        type="button"
                        onClick={nextStep}
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all font-semibold"
                      >
                        Continue
                        <ArrowRight className="w-4 h-4 inline ml-2" />
                      </button>
                    ) : currentStep === 3 ? (
                      <button
                        type="submit"
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all font-semibold"
                      >
                        Confirm Booking
                        <Sparkles className="w-4 h-4 inline ml-2" />
                      </button>
                    ) : null}
                  </div>
                </form>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Selected Service Summary */}
              {selectedService && (
                <div className="bg-gradient-to-r from-blue-500/20 to-indigo-500/20 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Gem className="w-5 h-5 text-yellow-400" />
                    Selected Service
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Service</span>
                      <span className="text-white font-semibold">{selectedService.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Duration</span>
                      <span className="text-white">{selectedService.duration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Description</span>
                      <span className="text-white text-right text-sm">{selectedService.description}</span>
                    </div>
                    <div className="pt-3 border-t border-white/10">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Total Amount</span>
                        <span className="text-2xl font-bold text-blue-400">{formatIndianPrice(selectedService.price)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Features Grid */}
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                <h3 className="text-lg font-bold text-white mb-4">Why Choose Us</h3>
                <div className="grid grid-cols-2 gap-4">
                  {features.map((feature, idx) => (
                    <div key={idx} className="text-center p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all">
                      <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-2 text-blue-400">
                        {feature.icon}
                      </div>
                      <h4 className="text-sm font-semibold text-white">{feature.title}</h4>
                      <p className="text-xs text-gray-400">{feature.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Special Offer */}
              <div className="relative overflow-hidden bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-6 text-white shadow-xl">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full"></div>
                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/10 rounded-full"></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-3">
                    <Gift className="w-5 h-5" />
                    <span className="text-sm font-semibold">SPECIAL OFFER</span>
                  </div>
                  <h4 className="text-2xl font-bold mb-2">Get 10% OFF</h4>
                  <p className="text-sm text-orange-100 mb-3">on your first service booking</p>
                  <div className="bg-white/20 backdrop-blur rounded-lg px-3 py-2 inline-block">
                    <code className="text-sm font-mono">AUTO10</code>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(50px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}