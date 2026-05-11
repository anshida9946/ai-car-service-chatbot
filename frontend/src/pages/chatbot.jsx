import React, { useState, useRef, useEffect } from "react";
import { sendMessageToBot } from "../services/chatbotService";
import { 
  Send, Bot, User, Sparkles, Clock, Calendar, Car, 
  Wrench, Battery, Droplet, Gauge, Phone, Mail, 
  MapPin, ChevronRight, MessageCircle, Mic, MicOff,
  Copy, CheckCheck, ThumbsUp, ThumbsDown, Star,
  Shield, Award, Headphones
} from 'lucide-react';

function Chatbot() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! 👋 I'm your HIPPO CARS AI assistant. How can I help you with your vehicle today?",
      sender: "bot",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const messagesEndRef = useRef(null);

  const services = [
    { name: "Oil Change", price: 4999, duration: "30 min", icon: "🛢️" },
    { name: "Brake Service", price: 12999, duration: "2 hours", icon: "🛞" },
    { name: "Battery Check", price: 2999, duration: "20 min", icon: "🔋" },
    { name: "Tire Rotation", price: 3999, duration: "45 min", icon: "🔄" },
    { name: "Engine Diagnostic", price: 8999, duration: "1 hour", icon: "⚙️" },
    { name: "Full Service", price: 19999, duration: "3 hours", icon: "🔧" },
  ];

  const quickActions = [
    { id: "prices", label: "💰 Service Prices", icon: "💰" },
    { id: "booking", label: "📅 Book Service", icon: "📅" },
    { id: "hours", label: "⏰ Working Hours", icon: "⏰" },
    { id: "location", label: "📍 Location", icon: "📍" },
    { id: "tracking", label: "📊 Track Status", icon: "📊" },
    { id: "support", label: "🎧 Support", icon: "🎧" },
  ];

  const suggestedQuestions = [
    { label: "💰 Pricing", question: "What are your service prices?" },
    { label: "📅 Booking", question: "How do I book a service?" },
    { label: "⏰ Hours", question: "What are your working hours?" },
    { label: "🛡️ Warranty", question: "Do you have warranty?" },
    { label: "💳 Payment", question: "What payment methods do you accept?" },
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const formatIndianPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const currentMessage = input.trim();

    const userMsg = {
      id: messages.length + 1,
      text: currentMessage,
      sender: "user",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    setShowQuickActions(false);

    try {
      const reply = await sendMessageToBot(currentMessage);
      const botMsg = {
        id: messages.length + 2,
        text: reply || "🤖 I can help with services and booking.",
        sender: "bot",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: messages.length + 2,
          text: "⚠️ Server error. Please try again.",
          sender: "bot",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }
    setLoading(false);
  };

  const handleQuickAction = (action) => {
    setInput(action.label);
    setTimeout(() => handleSend(), 100);
  };

  const handleSuggestedQuestion = (question) => {
    setInput(question);
    setTimeout(() => handleSend(), 100);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="max-w-7xl w-full mx-auto">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Services */}
          <div className="hidden lg:block bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                <Car className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-lg font-bold text-white">Our Services</h2>
            </div>
            <div className="space-y-3">
              {services.map((service, idx) => (
                <div 
                  key={idx} 
                  onClick={() => handleSuggestedQuestion(service.name)}
                  className="p-3 bg-white/5 rounded-xl hover:bg-white/10 transition cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{service.icon}</span>
                      <div>
                        <p className="text-sm font-medium text-white">{service.name}</p>
                        <p className="text-xs text-gray-400">{service.duration}</p>
                      </div>
                    </div>
                    <p className="text-sm font-bold text-blue-400">{formatIndianPrice(service.price)}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-6 border-t border-white/10">
              <div className="bg-white/5 rounded-xl p-3 mb-3">
                <div className="flex items-center gap-2 text-sm text-white">
                  <Shield className="w-4 h-4 text-green-400" />
                  <span>3 Months Warranty</span>
                </div>
              </div>
              <div className="bg-white/5 rounded-xl p-3">
                <div className="flex items-center gap-2 text-sm text-white">
                  <Award className="w-4 h-4 text-yellow-400" />
                  <span>Certified Mechanics</span>
                </div>
              </div>
            </div>
          </div>

          {/* Chat Section */}
          <div className="lg:col-span-3 bg-white rounded-2xl shadow-2xl flex flex-col h-[85vh]">
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 p-5 rounded-t-2xl">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-14 h-14 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center">
                    <Bot className="w-7 h-7 text-white" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    HIPPO CARS Assistant
                    <Sparkles className="w-4 h-4 text-yellow-400" />
                  </h2>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <p className="text-xs text-blue-100">Online - Ready to help 24/7</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="flex items-center gap-1 bg-white/20 px-3 py-1.5 rounded-full">
                    <Star className="w-3 h-3 text-yellow-400 fill-current" />
                    <span className="text-xs text-white">4.9</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            {showQuickActions && messages.length < 3 && (
              <div className="border-b border-gray-200 p-4 bg-gradient-to-r from-gray-50 to-blue-50">
                <p className="text-xs text-gray-500 mb-3">✨ Quick Actions</p>
                <div className="flex gap-2 flex-wrap">
                  {quickActions.map((action) => (
                    <button
                      key={action.id}
                      onClick={() => handleQuickAction(action)}
                      className="px-3 py-2 bg-white border border-gray-200 text-gray-700 text-sm rounded-xl hover:bg-blue-50 hover:border-blue-300 transition-all hover:shadow-md"
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex gap-3 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.sender === "bot" && (
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                  )}
                  <div
                    className={`max-w-md rounded-2xl px-5 py-3 shadow-sm ${
                      msg.sender === "user"
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                        : "bg-white text-gray-800 border border-gray-200"
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-line">{msg.text}</p>
                    <div className="flex items-center justify-between mt-2">
                      <p className={`text-xs ${msg.sender === "user" ? "text-blue-200" : "text-gray-400"}`}>
                        {msg.time}
                      </p>
                    </div>
                  </div>
                  {msg.sender === "user" && (
                    <div className="w-10 h-10 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-white" />
                    </div>
                  )}
                </div>
              ))}
              {loading && (
                <div className="flex gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div className="bg-white rounded-2xl px-5 py-3 border border-gray-200">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></span>
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggested Questions */}
            <div className="px-5 pb-2 pt-2 border-t border-gray-200">
              <div className="flex gap-2 flex-wrap">
                {suggestedQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSuggestedQuestion(q.question)}
                    className="px-3 py-1.5 bg-gray-100 text-gray-600 text-xs rounded-lg hover:bg-blue-50 hover:text-blue-600 transition"
                  >
                    {q.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Area */}
            <div className="p-5 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Ask me anything about HIPPO CARS services..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyPress}
                    disabled={loading}
                    className="w-full border border-gray-300 rounded-xl px-5 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <button
                  onClick={handleSend}
                  disabled={loading || !input.trim()}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition disabled:opacity-50 flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Send
                </button>
              </div>
              <p className="text-xs text-gray-400 text-center mt-3">
                Powered by HIPPO CARS AI • Secure & Private • 24/7 Support
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chatbot;