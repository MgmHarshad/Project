import axios from "axios";
const API = import.meta.env.VITE_BACKEND_URL || "http://localhost:8001";

export const registerUser = (user) =>
  axios.post(`${API}/api/users`, user, {
    headers: { "Content-Type": "application/json" },
  });
// export const getDonor = () => axios.get(`${API}/api/donors/689f30c601108853a3e629b8`)

export const loginUser = (user) =>
  axios.post(`${API}/api/login`, user, {
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
  });

export const logoutUser = () => axios.post(`${API}/api/logout`, {}, {withCredentials:true});

export const getUser = () =>
  axios.get(`${API}/api/user`, {
    withCredentials: true, // ✅ send cookies
  });

export const createDonation = (donation, token) => axios.post(`${API}/api/donation`, donation, {
  withCredentials: true,
  headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      }
})

export const getDonation = () => axios.get(`${API}/api/donation`,{withCredentials: true});