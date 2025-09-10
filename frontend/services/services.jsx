import axios from "axios";
const API = import.meta.env.VITE_BACKEND_URL || "http://localhost:8001";

export const registerUser = (user) =>
  axios.post(`${API}/api/users`, user, {
    headers: { "Content-Type": "multipart/form-data" },
    withCredentials: true,
  });

export const getUser = () =>
  axios.get(`${API}/api/user`, {
    withCredentials: true, // ✅ send cookies
  });

export const updateUser = (formData, token) =>
  axios.put(`${API}/api/update`, formData, {
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });

export const deleteUser = (token) =>
  axios.delete(`${API}/api/delete`, {
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const loginUser = (user) =>
  axios.post(`${API}/api/login`, user, {
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
  });

export const logoutUser = () =>
  axios.post(`${API}/api/logout`, {}, { withCredentials: true });

export const createDonation = (donation, token) =>
  axios.post(`${API}/api/donation`, donation, {
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

export const getDonation = () =>
  axios.get(`${API}/api/donation`, { withCredentials: true });

export const getMyDonations = (token) =>
  axios.get(`${API}/api/getMyDonations`, {
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

export const createEvents = (event, token) =>
  axios.post(`${API}/api/createEvent`, event, {
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

export const getEvents = () =>
  axios.get(`${API}/api/getEvents`, { withCredentials: true });

export const getMyEvents = (token) =>
  axios.get(`${API}/api/getMyEvents`, {
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

export const createRequest = (request, token) =>
  axios.post(`${API}/api/request`, request, {
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

export const getRequests = () =>
  axios.get(`${API}/api/requests`, { withCredentials: true });

export const getMyRequests = (token) =>
  axios.get(`${API}/api/getMyRequests`, {
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
