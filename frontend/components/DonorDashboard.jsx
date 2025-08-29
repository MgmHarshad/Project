import { Sidebar } from "lucide-react";
import React, { useState, useEffect } from "react";
import { getUser } from "../services/services";
import { logoutUser } from "../services/services";
import { createDonation } from "../services/services";
import {
  CircleUserRound,
  Bell,
  LayoutDashboard,
  History,
  CalendarCheck,
  HandPlatter,
  LogOut,
  Truck,
  CircleCheck,
  Sprout,
} from "lucide-react";
import { Link } from "react-router-dom";
function DonorDashboard() {
  const [donor, setDonor] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    foodName: "",
    quantity: "",
    unit: "",
    location: "",
    expiryDuration: "",
  });

  const fetchDonor = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getUser();
      console.log("Profile data:", res.data);
      setDonor(res.data);
    } catch (err) {
      console.error("Profile fetch error:", err.response?.data || err.message);
      setError(err.response?.data?.error || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonor();
  }, []);

  // Add this before the return statement
  if (loading) {
    return (
      <div className="font-serif text-green-800 bg-green-200 w-full p-10">
        Loading profile...
      </div>
    );
  }

  if (error) {
    return (
      <div className="font-serif text-green-800 bg-green-200 w-full p-10">
        Error: {error}
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const response = await createDonation(formData, token);
      // const user = response.data.user;

      console.log("Donation Response", response.data); // Debug log
      alert("Donation successful!");
      setFormData({
        foodName: "",
        quantity: "",
        unit: "",
        location: "",
        expiryDuration: "",
      });
      window.location.href = "/donor";
    } catch (err) {
      console.error("Donation error:", err.response?.data || err.message);
      alert("Donation failed: " + (err.response?.data?.error || err.message));
    }
  };
  return (
    <div className="font-serif text-green-800">
      <nav className="bg-gray-300 flex h-20 p-2 fixed w-full top-0 rounded-br-lg shadow-md z-20">
        <h1 className="text-4xl font-bold mt-2 ml-4 cursor-pointer">
          {donor.fullname}
        </h1>
        <Bell
          className="h-10 w-10 cursor-pointer mt-2 ml-auto"
          onClick={() => (window.location.href = "/donor/notification")}
        />
        <CircleUserRound
          className="h-10 w-10 cursor-pointer mt-2 ml-10 mr-4"
          onClick={() => (window.location.href = "/donor/profile")}
        />
      </nav>
      <div className="bg-gray-200 flex flex-col fixed h-full w-60 p-2 mt-20 top-0 rounded-br-lg shadow-md text-center">
        <div
          onClick={() => (window.location.href = "/donor")}
          className="flex gap-2 mt-10 p-2 cursor-pointer text-2xl font-bold"
        >
          <LayoutDashboard />
          <p> Dashboard</p>
        </div>
        <div
          onClick={() => (window.location.href = "/donor/history")}
          className="flex gap-2 mt-10 p-2 cursor-pointer text-2xl font-bold"
        >
          <History />
          <p> History</p>
        </div>
        <div
          onClick={() => (window.location.href = "/donor/showrequests")}
          className="flex gap-2 mt-10 p-1 cursor-pointer text-2xl font-bold"
        >
          <HandPlatter />
          <p>Food Requests</p>
        </div>
        <div
          onClick={() => (window.location.href = "/donor/events")}
          className="flex gap-2 mt-10 p-2 cursor-pointer text-2xl font-bold"
        >
          <CalendarCheck />
          <p> Future Events</p>
        </div>
        <div
          onClick={async () => {
            try {
              await logoutUser();
              localStorage.removeItem("uid");
              window.location.href = "/";
            } catch (error) {
              console.error(error);
            }
          }}
          className="flex gap-2 mt-35 p-2 cursor-pointer text-2xl font-bold"
        >
          <LogOut />
          <p> Logout</p>
        </div>
      </div>
      <div className="flex flex-row gap-10 mt-24 ml-60 p-2">
        <div className="bg-gray-100 rounded-lg flex flex-col shadow-md p-4 w-64 text-center items-center cursor-pointer">
          <HandPlatter size={48} />
          <p className="text-1xl font-bold">Total Donations</p>
          <p className="text-1xl font-bold">12</p>
        </div>
        <div className="bg-gray-100 rounded-lg flex flex-col shadow-md p-4 w-64 text-center items-center cursor-pointer">
          <Truck size={48} />
          <p className="text-1xl font-bold">Pending Donations</p>
          <p className="text-1xl font-bold">2</p>
        </div>
        <div className="bg-gray-100 rounded-lg flex flex-col shadow-md p-4 w-64 text-center items-center cursor-pointer">
          <CircleCheck size={48} />
          <p className="text-1xl font-bold">Matched Donations</p>
          <p className="text-1xl font-bold">10</p>
        </div>
        <div className="bg-gray-100 rounded-lg flex flex-col shadow-md p-4 w-64 text-center items-center cursor-pointer">
          <Sprout size={48} />
          <p className="text-1xl font-bold">Food Saved</p>
          <p className="text-1xl font-bold">130(kg)</p>
        </div>
      </div>
      <div className="flex flex-row gap-8">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center mt-10 ml-62 w-138 bg-gray-100 p-4 rounded-lg shadow-md mb-4"
        >
          <h3 className="text-2xl font-bold">Create Donation</h3>
          <input
            type="text"
            placeholder="Food Name"
            name="foodName"
            value={formData.foodName}
            onChange={handleChange}
            className="border-b-2 p-2 w-full mt-4 focus:outline-none focus:border-b-2"
          />
          <div className="flex flex-row gap-4 mt-2">
            <input
              type="number"
              placeholder="Quantity"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              className="border-b-2 p-2 w-64 mt-4 focus:outline-none focus:border-b-2"
            />
            <input
              type="text"
              placeholder="(Kg, servings)"
              name="unit"
              value={formData.unit}
              onChange={handleChange}
              className="border-b-2 p-2 w-64 mt-4 focus:outline-none focus:border-b-2"
            />
          </div>
          <input
            type="text"
            placeholder="Location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="border-b-2 p-2 w-full mt-4 focus:outline-none focus:border-b-2"
          />
          <input
            type="number"
            placeholder="Expiry Duration"
            name="expiryDuration"
            value={formData.expiryDuration}
            onChange={handleChange}
            className="border-b-2 p-2 w-full mt-4 focus:outline-none focus:border-b-2"
          />
          <button 
            type="submit"
            className="bg-green-800 text-white w-60 h-12 rounded-lg cursor-pointer mt-6"
            onMouseEnter={(e) => {
              e.target.style.scale = "1.05";
            }}
            onMouseLeave={(e) => {
              e.target.style.scale = "1";
            }}
          >
            Submit
          </button>
        </form>
        <div className="text-center mt-10 w-136 bg-gray-100 p-4 rounded-lg shadow-md mb-4">
          <h3 className="text-2xl font-bold">Recent Donations</h3>
          <table className="w-full mt-4 rounded-lg shadow-md">
            <thead className="bg-gray-300 text-2xl font-bold rounded-lg">
              <tr className="rounded-md">
                <th className="p-2">Date</th>
                <th className="p-2">Food Type</th>
                <th className="p-2">Quantity (kg)</th>
                <th className="p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b-2 rounded-b-lg">
                <th className="p-2">2025-6-1</th>
                <td className="p-2">Rice</td>
                <td className="p-2">10kg</td>
                <td className="p-2">Delivered</td>
              </tr>
              <tr className="border-b-2 rounded-b-lg">
                <th className="p-2">2025-6-2</th>
                <td className="p-2">Veg Curry</td>
                <td className="p-2">15kg</td>
                <td className="p-2">Delivered</td>
              </tr>
              <tr className="border-b-2 rounded-b-lg">
                <th className="p-2">2025-6-3</th>
                <td className="p-2">Rice</td>
                <td className="p-2">10kg</td>
                <td className="p-2">Delivered</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default DonorDashboard;
