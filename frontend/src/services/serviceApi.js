import axios from "axios";

const API = "http://127.0.0.1:8000/api/services/";

const getToken = () => localStorage.getItem("token");

const authHeaders = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
    "Content-Type": "application/json",
  },
});

// ADD
export const addService = async (data) => {
  const res = await axios.post(`${API}add/`, data, authHeaders());
  return res.data;
};

// GET PUBLIC (for booking page)
export const getAllServices = async () => {
  const res = await axios.get(API);
  return res.data;
};

// GET ADMIN — returns full axios response so callers can use res.data
export const getAllServicesAdmin = async () => {
  const res = await axios.get(`${API}admin/`, authHeaders());
  return res;
};

// UPDATE
export const updateService = async (id, data) => {
  const res = await axios.put(`${API}update/${id}/`, data, authHeaders());
  return res.data;
};

// DELETE
export const deleteService = async (id) => {
  const res = await axios.delete(`${API}delete/${id}/`, authHeaders());
  return res.data;
};

// TOGGLE
export const togglePopular = async (id) => {
  const res = await axios.patch(
    `${API}toggle-popular/${id}/`,
    {},
    authHeaders()
  );
  return res.data;
};