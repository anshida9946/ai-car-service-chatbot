import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [userName, setUserName] = useState('');
  const [showLoginOptions, setShowLoginOptions] = useState(false);
  const [showSignupOptions, setShowSignupOptions] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('userRole');
    const name = localStorage.getItem('userName');
    
    if (token && role && name) {
      setIsLoggedIn(true);
      setUserRole(role);
      setUserName(name);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    setIsLoggedIn(false);
    setUserRole(null);
    setUserName('');
    window.location.href = '/';
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown-container')) {
        setShowLoginOptions(false);
        setShowSignupOptions(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const features = [
    { icon: "📅", title: "Easy Booking", desc: "Book your car service in minutes through our intelligent chatbot" },
    { icon: "⏰", title: "Real-Time Tracking", desc: "Track your vehicle service status in real-time" },
    { icon: "💬", title: "24/7 AI Support", desc: "Our AI chatbot is available round the clock" },
    { icon: "🔒", title: "Secure & Private", desc: "Your data is encrypted and secure" },
    { icon: "🔧", title: "Expert Service", desc: "Certified mechanics and quality parts" },
    { icon: "🚗", title: "All Brands", desc: "We service all major car brands and models" },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section with Background Image */}
      <div className="relative bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=2083&q=80" 
            alt="Luxury Car Service Background"
            className="w-full h-full object-cover opacity-30 pointer-events-none"
          />
        </div>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-blue-900/50 to-black/60 pointer-events-none"></div>
        
        {/* Header */}
        <header className="relative z-50 bg-white/10 backdrop-blur-md border-b border-white/20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <Link to="/" className="flex items-center gap-3 group relative z-50">
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-xl shadow-lg group-hover:scale-105 transition">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 10H4a2 2 0 01-2-2V4a2 2 0 012-2h16a2 2 0 012 2v7m-6 4h6m-3-3v6" />
                  </svg>
                </div>
                <div>
                  <span className="text-2xl font-bold text-white">HIPPO<span className="text-blue-400">CARS</span></span>
                  <p className="text-xs text-gray-300">AI-Powered Auto Care</p>
                </div>
              </Link>

              <div className="flex gap-3 items-center">
                {isLoggedIn ? (
                  <>
                    <span className="text-sm text-gray-200 hidden sm:inline-flex items-center">
                      Welcome, <span className="font-semibold text-blue-300 ml-1">{userName}</span>
                    </span>
                    <Link
                      to={userRole === 'admin' ? '/admin-dashboard' : '/user-dashboard'}
                      className="px-6 py-2 text-blue-300 hover:text-white font-medium transition-colors relative z-50"
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="px-6 py-2 bg-red-600/90 backdrop-blur-sm text-white rounded-lg hover:bg-red-700 transition-all shadow-md hover:shadow-lg relative z-50"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <div className="relative dropdown-container z-50">
                      <button
                        onClick={() => {
                          setShowLoginOptions(!showLoginOptions);
                          setShowSignupOptions(false);
                        }}
                        className="px-6 py-2 text-gray-200 hover:text-white font-medium transition-colors inline-flex items-center gap-2 relative z-50"
                      >
                        Login
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {showLoginOptions && (
                        <div className="absolute right-0 mt-2 w-64 bg-gray-900 rounded-xl shadow-2xl border border-gray-700 py-2 z-[100]">
                          <Link
                            to="/login"
                            state={{ role: "user" }}
                            className="block w-full text-left px-4 py-3 hover:bg-gray-800 transition-colors rounded-lg mx-2"
                            onClick={() => setShowLoginOptions(false)}
                          >
                            <div className="flex items-center gap-3">
                              <div className="bg-blue-500/20 p-2 rounded-lg">
                                <span className="text-xl">🚗</span>
                              </div>
                              <div>
                                <div className="font-semibold text-white">Login as User</div>
                                <div className="text-xs text-gray-400">Book services & track vehicle</div>
                              </div>
                            </div>
                          </Link>
                          <Link
                            to="/login"
                            state={{ role: "admin" }}
                            className="block w-full text-left px-4 py-3 hover:bg-gray-800 transition-colors rounded-lg mx-2"
                            onClick={() => setShowLoginOptions(false)}
                          >
                            <div className="flex items-center gap-3">
                              <div className="bg-purple-500/20 p-2 rounded-lg">
                                <span className="text-xl">👑</span>
                              </div>
                              <div>
                                <div className="font-semibold text-white">Login as Admin</div>
                                <div className="text-xs text-gray-400">Manage bookings & services</div>
                              </div>
                            </div>
                          </Link>
                        </div>
                      )}
                    </div>
                    <div className="relative dropdown-container z-50">
                      <button
                        onClick={() => {
                          setShowSignupOptions(!showSignupOptions);
                          setShowLoginOptions(false);
                        }}
                        className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg relative z-50"
                      >
                        Sign Up
                      </button>
                      {showSignupOptions && (
                        <div className="absolute right-0 mt-2 w-64 bg-gray-900 rounded-xl shadow-2xl border border-gray-700 py-2 z-[100]">
                          <Link
                            to="/signup"
                            state={{ role: "user" }}
                            className="block w-full text-left px-4 py-3 hover:bg-gray-800 transition-colors rounded-lg mx-2"
                            onClick={() => setShowSignupOptions(false)}
                          >
                            <div className="flex items-center gap-3">
                              <div className="bg-blue-500/20 p-2 rounded-lg">
                                <span className="text-xl">📝</span>
                              </div>
                              <div>
                                <div className="font-semibold text-white">Sign up as User</div>
                                <div className="text-xs text-gray-400">Create a customer account</div>
                              </div>
                            </div>
                          </Link>
                          <Link
                            to="/signup"
                            state={{ role: "admin" }}
                            className="block w-full text-left px-4 py-3 hover:bg-gray-800 transition-colors rounded-lg mx-2"
                            onClick={() => setShowSignupOptions(false)}
                          >
                            <div className="flex items-center gap-3">
                              <div className="bg-purple-500/20 p-2 rounded-lg">
                                <span className="text-xl">👨‍💼</span>
                              </div>
                              <div>
                                <div className="font-semibold text-white">Sign up as Admin</div>
                                <div className="text-xs text-gray-400">Register as administrator</div>
                              </div>
                            </div>
                          </Link>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Hero Content */}
        <section className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative z-20">
              <div className="inline-block px-4 py-2 bg-blue-500/20 backdrop-blur-sm text-blue-300 rounded-full text-sm font-medium mb-6 border border-blue-400/30">
                🤖 AI-Powered Service Center
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                AI-Based Car Service Booking & <span className="text-blue-400">Customer Support</span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-300 mb-8">
                Experience seamless car service booking with our intelligent AI chatbot. Get instant support, real-time updates, and hassle-free appointment scheduling.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                {!isLoggedIn ? (
                  <>
                    <Link
                      to="/signup"
                      state={{ role: "user" }}
                      className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 font-semibold relative z-20"
                    >
                      Get Started 
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                    <button
                      onClick={() => setShowLoginOptions(true)}
                      className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-lg hover:bg-white/20 transition-all border border-white/20 font-semibold relative z-20"
                    >
                      Login
                    </button>
                  </>
                ) : (
                  <Link
                    to={userRole === 'admin' ? '/admin-dashboard' : '/user-dashboard'}
                    className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 font-semibold relative z-20"
                  >
                    Go to Dashboard
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                )}
              </div>
              <div className="flex items-center gap-6 mt-8">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">⭐</span>
                  <span className="text-gray-300">4.9/5 Rating</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">👥</span>
                  <span className="text-gray-300">10k+ Customers</span>
                </div>
              </div>
            </div>
            <div className="relative z-20">
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-8 shadow-2xl">
                <div className="bg-white rounded-xl p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">💬</span>
                    <div>
                      <p className="font-semibold text-gray-900">AI Assistant</p>
                      <p className="text-sm text-gray-500">Available 24/7</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-700">Hi! How can I help you with your car service today?</p>
                    </div>
                    <div className="bg-gray-100 p-3 rounded-lg text-right">
                      <p className="text-sm text-gray-700">I need to book an oil change</p>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-700">Great! I can help you with that. What date works for you?</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Features Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Why Choose HIPPO CARS?</h2>
            <p className="text-lg sm:text-xl text-gray-600">Powerful features designed for your convenience</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="p-6 rounded-xl border-2 border-gray-200 hover:border-blue-500 hover:shadow-lg transition-all group">
                <div className="bg-blue-100 w-14 h-14 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-500 transition-colors">
                  <span className="text-3xl group-hover:text-white transition-colors">{feature.icon}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-r from-blue-50 to-indigo-50 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-blue-600">10k+</div>
              <div className="text-sm text-gray-600 mt-1">Happy Customers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-blue-600">4.9/5</div>
              <div className="text-sm text-gray-600 mt-1">Average Rating</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-blue-600">24/7</div>
              <div className="text-sm text-gray-600 mt-1">Support Available</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-blue-600">100%</div>
              <div className="text-sm text-gray-600 mt-1">Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-lg text-gray-600">Get your car serviced in three simple steps</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Book Online</h3>
              <p className="text-gray-600">Choose your service and schedule through our AI chatbot</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl font-bold text-purple-600">2</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Get Service</h3>
              <p className="text-gray-600">Expert mechanics service your vehicle with quality parts</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl font-bold text-green-600">3</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Track & Receive</h3>
              <p className="text-gray-600">Track progress in real-time and get your car back</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
            <span className="text-lg">🚀</span>
            <span className="text-white text-sm font-semibold">GET STARTED TODAY</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">Ready for <span className="text-yellow-400">Smarter Car Care</span>?</h2>
          <p className="text-lg sm:text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join 10,000+ drivers who trust HIPPO CARS. Get started free — no credit card required.
          </p>
          {!isLoggedIn ? (
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                to="/signup"
                state={{ role: "user" }}
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl font-semibold"
              >
                Create Free Account →
              </Link>
              <button className="px-8 py-4 border-2 border-white text-white rounded-xl font-semibold hover:bg-white/10 transition transform hover:scale-105">
                See Live Demo
              </button>
            </div>
          ) : (
            <Link
              to={userRole === 'admin' ? '/admin-dashboard' : '/user-dashboard'}
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl font-semibold"
            >
              Go to Dashboard
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 10H4a2 2 0 01-2-2V4a2 2 0 012-2h16a2 2 0 012 2v7m-6 4h6m-3-3v6" />
                  </svg>
                </div>
                <div>
                  <span className="text-white font-bold text-xl">HIPPO<span className="text-blue-500">CARS</span></span>
                  <p className="text-xs text-gray-500">AI-Powered Auto Care</p>
                </div>
              </div>
              <p className="text-sm">
                AI-powered car service booking and customer support platform.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-sm">
                <li className="hover:text-white cursor-pointer transition-colors">Oil Change</li>
                <li className="hover:text-white cursor-pointer transition-colors">Tire Service</li>
                <li className="hover:text-white cursor-pointer transition-colors">Brake Repair</li>
                <li className="hover:text-white cursor-pointer transition-colors">Engine Diagnostics</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li className="hover:text-white cursor-pointer transition-colors">About Us</li>
                <li className="hover:text-white cursor-pointer transition-colors">Contact</li>
                <li className="hover:text-white cursor-pointer transition-colors">Careers</li>
                <li className="hover:text-white cursor-pointer transition-colors">Privacy Policy</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm">
                <li>support@hippocars.com</li>
                <li>+91 98765 43210</li>
                <li>Mon-Sat: 9AM - 8PM</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>&copy; 2026 HIPPO CARS. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}