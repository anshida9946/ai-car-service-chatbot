import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");  // Login.jsx saves as "token"
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// USER: create a new booking
export const createBooking = (data) =>
  API.post("/bookings/create/", data);

// USER: get only the logged-in user's bookings
export const getMyBookings = () =>
  API.get("/bookings/my/");

// USER: cancel their own booking
export const cancelBooking = (id) =>
  API.delete(`/bookings/cancel/${id}/`);

// ADMIN: get ALL bookings from every user
export const getAllBookings = () =>
  API.get("/bookings/all/");

// ADMIN: update a booking's status
// status must be one of: 'Pending', 'Approved', 'In Service', 'Completed', 'Cancelled'
export const updateBookingStatus = (id, newStatus) =>
  API.put(`/bookings/status/update/${id}/`, { status: newStatus });