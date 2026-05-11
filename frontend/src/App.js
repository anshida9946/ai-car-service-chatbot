// import React from "react";
// import { BrowserRouter, Routes, Route } from "react-router-dom";

// import Home from "./pages/Home";
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import BookingPage from "./pages/BookingPage";
// import Chatbot from "./pages/chatbot";
// import UserDashboard from "./pages/UserDashboard";
// import AdminDashboard from "./pages/admin/AdminDashboard";
// import ServiceStatusPage from "./pages/ServiceStatusPage";
// import ComplaintsPage from "./pages/ComplaintsPage";
// import UserProfilePage from "./pages/UserProfilePage";
// import ManageServicesPage from "./pages/admin/ManageServicesPage";
// import ManageBookingsPage from "./pages/admin/ManageBookingsPage";
// import ServiceTracker from "./pages/admin/ServiceTracker";

// function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         {/* Public Routes */}
//         <Route path="/" element={<Home />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/signup" element={<Register />} />
        
//         {/* User Routes */}
//         <Route path="/book-service" element={<BookingPage />} />
//         <Route path="/chatbot" element={<Chatbot />} />
//         <Route path="/user-dashboard" element={<UserDashboard />} />
//         <Route path="/service-status" element={<ServiceStatusPage />} />
//         <Route path="/complaints" element={<ComplaintsPage />} />
//         <Route path="/profile" element={<UserProfilePage />} />
        
//         {/* Admin Routes */}
//         <Route path="/admin-dashboard" element={<AdminDashboard />} />
//         <Route path="/admin/manage-services" element={<ManageServicesPage />} />
//         <Route path="/admin/manage-bookings" element={<ManageBookingsPage />} />
//         <Route path="/admin/service-tracker" element={<ServiceTracker />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import BookingPage from "./pages/BookingPage";
import Chatbot from "./pages/chatbot";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ServiceStatusPage from "./pages/ServiceStatusPage";
import ComplaintsPage from "./pages/ComplaintsPage";
import UserProfilePage from "./pages/UserProfilePage";
import ManageServicesPage from "./pages/admin/ManageServicesPage";
import ManageBookingsPage from "./pages/admin/ManageBookingsPage";
import ServiceTracker from "./pages/admin/ServiceTracker";
import ComplaintsManagementPage from "./pages/admin/ComplaintsManagementPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Register />} />
        
        {/* User Routes */}
        <Route path="/book-service" element={<BookingPage />} />
        <Route path="/chatbot" element={<Chatbot />} />
        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/service-status" element={<ServiceStatusPage />} />
        <Route path="/complaints" element={<ComplaintsPage />} />
        <Route path="/profile" element={<UserProfilePage />} />
        
        {/* Admin Routes */}
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/admin/manage-services" element={<ManageServicesPage />} />
        <Route path="/admin/manage-bookings" element={<ManageBookingsPage />} />
        <Route path="/admin/service-tracker" element={<ServiceTracker />} />
        <Route path="/admin/complaints-management" element={<ComplaintsManagementPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;