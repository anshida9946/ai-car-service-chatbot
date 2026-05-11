import { useState } from "react";
import axios from "axios";
import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const roleFromHome = location.state?.role || "user";
  
  // Fixed role based on what's passed from home, no selection
  const selectedRole = roleFromHome;
  
  const [data, setData] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const changeHandler = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    
    if (!data.username.trim()) {
      setError("Username is required!");
      return;
    }
    
    if (!data.password.trim()) {
      setError("Password is required!");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/login/",
        {
          username: data.username,
          password: data.password,
          role: selectedRole
        }
      );

      if (response.data.token || response.data.access) {
        localStorage.setItem("token", response.data.token || response.data.access);
        localStorage.setItem("userRole", selectedRole);
        localStorage.setItem("username", data.username);
        localStorage.setItem("userName", data.username);
        localStorage.setItem("isLoggedIn", "true");
        
        // Save user object for compatibility
        const user = {
          name: data.username,
          username: data.username,
          userType: selectedRole,
          role: selectedRole
        };
        localStorage.setItem("user", JSON.stringify(user));
      }

      alert(`Login Successful! Welcome ${data.username}`);
      
      // Redirect based on role
      if (selectedRole === "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/user-dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4">
      {/* Background Image with Blur and Dark Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat blur-sm scale-105"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2083&q=80')",
        }}
      ></div>
      
      {/* Dark Blue Overlay */}
      <div className="absolute inset-0 bg-blue-900/80 backdrop-blur-[2px]"></div>
      
      {/* Decorative elements */}
      <div
        className={`absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" xmlns="http://www.w3.org/2000/svg"%3E%3Cdefs%3E%3Cpattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse"%3E%3Cpath d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(59,130,246,0.08)" stroke-width="1"/%3E%3C/pattern%3E%3C/defs%3E%3Crect width="100%" height="100%" fill="url(%23grid)"/%3E%3C/svg%3E')]`}
      ></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500 opacity-10 rounded-full -mb-48 -mr-48 blur-3xl"></div>
      
      {/* Login Card */}
      <div className="relative z-10 bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl max-w-md w-full p-8 border border-white/20">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">
            {selectedRole === "admin" ? "👑" : "🚗"}
          </div>
          <h1 className="text-3xl font-bold text-blue-900 mb-2">HIPPO CARS</h1>
          <h2 className="text-2xl font-semibold text-gray-800">Welcome Back</h2>
          <p className="text-gray-600 mt-1">
            Login as <span className="font-semibold text-blue-700">{selectedRole === "admin" ? "Admin" : "User"}</span>
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={submitHandler}>
          <div className="space-y-5">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Username
              </label>
              <input
                type="text"
                name="username"
                placeholder="Enter your username"
                onChange={changeHandler}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white/90"
              />
              <p className="text-xs text-gray-500 mt-1">
                Demo: {selectedRole === "admin" ? "admin" : "user"} / {selectedRole === "admin" ? "admin123" : "user123"}
              </p>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                onChange={changeHandler}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white/90"
              />
            </div>

            {/* Remember Me and Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                Remember me
              </label>
              <button
                type="button"
                onClick={() => alert("Please contact admin to reset password")}
                className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
              >
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-700 to-blue-900 text-white font-bold py-3 rounded-lg hover:from-blue-800 hover:to-blue-950 transition duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Logging in...
                </span>
              ) : (
                `Login as ${selectedRole === "admin" ? "Admin" : "User"}`
              )}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Link 
              to="/signup" 
              state={{ role: selectedRole }}
              className="text-blue-700 font-semibold hover:text-blue-800 hover:underline"
            >
              Sign up here
            </Link>
          </p>
        </div>

        <div className="mt-4 text-center">
          <button
            onClick={() => navigate("/")}
            className="text-gray-500 hover:text-gray-700 text-sm flex items-center justify-center gap-1 mx-auto transition-colors"
          >
            <span>←</span> Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
