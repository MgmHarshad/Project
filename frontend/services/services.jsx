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

// Notifications
export const getNotifications = (token) =>
  axios.get(`${API}/api/notifications`, {
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

export const markNotificationRead = (id, token) =>
  axios.patch(`${API}/api/notifications/${id}/read`, {}, {
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

export const markAllNotificationsRead = (token) =>
  axios.patch(`${API}/api/notifications/read-all`, {}, {
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

// Donation status management
export const getAvailableDonations = (token) =>
  axios.get(`${API}/api/donations/available`, {
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

export const claimDonation = (id, token) =>
  axios.patch(`${API}/api/donations/${id}/claim`, {}, {
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

export const deliverDonation = (id, token) =>
  axios.patch(`${API}/api/donations/${id}/deliver`, {}, {
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

export const getMyClaimedDonations = (token) =>
  axios.get(`${API}/api/donations/my-claimed`, {
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

// Request status management
export const getAvailableRequests = (token) =>
  axios.get(`${API}/api/requests/available`, {
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

export const acceptRequest = (id, token) =>
  axios.patch(`${API}/api/requests/${id}/accept`, {}, {
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

export const deliverRequest = (id, token) =>
  axios.patch(`${API}/api/requests/${id}/deliver`, {}, {
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

export const getMyAcceptedRequests = (token) =>
  axios.get(`${API}/api/requests/my-accepted`, {
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

// Statistics
export const getDonorStats = (token) =>
  axios.get(`${API}/api/stats/donor`, {
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

export const getReceiverStats = (token) =>
  axios.get(`${API}/api/stats/receiver`, {
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
