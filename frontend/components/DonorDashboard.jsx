import React, { useState, useEffect } from "react";
import {
  getUser,
  logoutUser,
  createDonation,
  getMyDonations,
  getDonorStats,
} from "../services/services";
import { getNotifications } from "../services/services";
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
import DonorHistory from "./donor_components/DonorHistory";
function DonorDashboard() {
  const [donor, setDonor] = useState([]);

  const [Donations, setDonations] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [stats, setStats] = useState({
    totalDonations: 0,
    pendingDonations: 0,
    matchedDonations: 0,
    totalFoodSaved: 0
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    foodName: "",
    quantity: "",
    unit: "",
    location: "",
    hoursSincePrepared: "",
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

  const fetchMyDonations = async () => {
    const token = localStorage.getItem("token");
    try {
      setLoading(true);
      setError(null);
      const res = await getMyDonations(token);
      console.log("Donation data:", res.data);
      setDonations(res.data);
    } catch (err) {
      console.error(
        "Donations fetch error:",
        err.response?.data || err.message
      );
      setError(err.response?.data?.error || "Failed to load donations");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await getDonorStats(token);
      console.log("Donor stats:", res.data);
      setStats(res.data);
    } catch (err) {
      console.error("Stats fetch error:", err.response?.data || err.message);
      // Don't set error for stats, just log it
    }
  };

  useEffect(() => {
    fetchDonor();
    fetchMyDonations();
    fetchStats();
    // fetch unread notifications count
    (async () => {
      try{
        const token = localStorage.getItem("token");
        const res = await getNotifications(token);
        const count = (res.data || []).filter(n => !n.read).length;
        setUnreadCount(count);
      }catch(e){ /* ignore */ }
    })();
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
    console.log("=== DONATION FORM SUBMITTED ===");
    const token = localStorage.getItem("token");
    try {
      const payload = {
        foodName: formData.foodName,
        quantity: Number(formData.quantity),
        unit: formData.unit,
        location: formData.location,
        hoursSincePrepared:
          formData.hoursSincePrepared === ""
            ? undefined
            : Number(formData.hoursSincePrepared),
      };

      const response = await createDonation(payload, token);
      // const user = response.data.user;

      console.log("Donation Response", response.data); // Debug log
      const ml = response.data?.mlPrediction;
      const usedExpiry = response.data?.donation?.expiryDuration;
      const msg = ml?.spoilage_risk
        ? `Donation successful! Risk: ${ml.spoilage_risk}, Remaining: ${ml.remaining_fresh_hours}h, Expiry set to: ${usedExpiry}h`
        : `Donation successful! Expiry set to: ${usedExpiry}h`;
      alert(msg);
      setFormData({
        foodName: "",
        quantity: "",
        unit: "",
        location: "",
        hoursSincePrepared: "",
      });
      window.location.href = "/donor";
    } catch (err) {
      console.error("Donation error:", err.response?.data || err.message);
      alert("Donation failed: " + (err.response?.data?.error || err.message));
    }
  };
  return (
    <div className="font-serif text-green-800 min-h-screen">
      {/* Mobile Navigation */}
      <nav className="bg-gray-300 flex flex-col sm:flex-row h-auto sm:h-20 p-2 fixed w-full top-0 rounded-br-lg shadow-md z-20">
        <h1 className="text-xl sm:text-2xl lg:text-4xl font-bold mt-2 ml-2 sm:ml-4 cursor-pointer truncate">
          {donor.fullname}
        </h1>
        <div className="flex items-center gap-2 sm:gap-4 ml-auto mt-2 sm:mt-0">
          <div className="relative">
            <Bell
              className="h-8 w-8 sm:h-10 sm:w-10 cursor-pointer"
              onClick={() => (window.location.href = "/donor/notification")}
            />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full px-1">
                {unreadCount}
              </span>
            )}
          </div>
          <CircleUserRound
            className="h-8 w-8 sm:h-10 sm:w-10 cursor-pointer"
            onClick={() => (window.location.href = "/donor/profile")}
          />
        </div>
      </nav>

      {/* Sidebar - Hidden on mobile, visible on larger screens */}
      <div className="hidden lg:block bg-gray-200 flex flex-col fixed h-full w-60 p-2 mt-20 top-0 rounded-br-lg shadow-md text-center">
        <div
          onClick={() => (window.location.href = "/donor")}
          className="flex gap-2 mt-10 p-2 cursor-pointer text-2xl font-bold hover:bg-gray-300 rounded"
        >
          <LayoutDashboard />
          <p> Dashboard</p>
        </div>
        <div
          onClick={() => (window.location.href = "/donor/history")}
          className="flex gap-2 mt-10 p-2 cursor-pointer text-2xl font-bold hover:bg-gray-300 rounded"
        >
          <History />
          <p> History</p>
        </div>
        <div
          onClick={() => (window.location.href = "/donor/showrequests")}
          className="flex gap-2 mt-10 p-1 cursor-pointer text-2xl font-bold hover:bg-gray-300 rounded"
        >
          <HandPlatter />
          <p>Food Requests</p>
        </div>
        <div
          onClick={() => (window.location.href = "/donor/accepted")}
          className="flex gap-2 mt-10 p-1 cursor-pointer text-2xl font-bold hover:bg-gray-300 rounded"
        >
          <HandPlatter />
          <p>Accepted</p>
        </div>
        <div
          onClick={() => (window.location.href = "/donor/events")}
          className="flex gap-2 mt-10 p-2 cursor-pointer text-2xl font-bold hover:bg-gray-300 rounded"
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
          className="flex gap-2 mt-15 p-2 cursor-pointer text-2xl font-bold hover:bg-gray-300 rounded"
        >
          <LogOut />
          <p> Logout</p>
        </div>
      </div>

      {/* Mobile Menu - Visible on mobile */}
      <div className="lg:hidden bg-gray-200 flex flex-wrap justify-center gap-2 p-2 mt-20 shadow-md">
        <button
          onClick={() => (window.location.href = "/donor")}
          className="flex gap-1 p-2 cursor-pointer text-sm font-bold bg-white rounded hover:bg-gray-100"
        >
          <LayoutDashboard size={16} />
          <span>Dashboard</span>
        </button>
        <button
          onClick={() => (window.location.href = "/donor/history")}
          className="flex gap-1 p-2 cursor-pointer text-sm font-bold bg-white rounded hover:bg-gray-100"
        >
          <History size={16} />
          <span>History</span>
        </button>
        <button
          onClick={() => (window.location.href = "/donor/showrequests")}
          className="flex gap-1 p-2 cursor-pointer text-sm font-bold bg-white rounded hover:bg-gray-100"
        >
          <HandPlatter size={16} />
          <span>Requests</span>
        </button>
        <button
          onClick={() => (window.location.href = "/donor/accepted")}
          className="flex gap-1 p-2 cursor-pointer text-sm font-bold bg-white rounded hover:bg-gray-100"
        >
          <HandPlatter size={16} />
          <span>Accepted</span>
        </button>
        <button
          onClick={() => (window.location.href = "/donor/events")}
          className="flex gap-1 p-2 cursor-pointer text-sm font-bold bg-white rounded hover:bg-gray-100"
        >
          <CalendarCheck size={16} />
          <span>Events</span>
        </button>
        <button
          onClick={async () => {
            try {
              await logoutUser();
              localStorage.removeItem("uid");
              window.location.href = "/";
            } catch (error) {
              console.error(error);
            }
          }}
          className="flex gap-1 p-2 cursor-pointer text-sm font-bold bg-white rounded hover:bg-gray-100"
        >
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="mt-24 lg:ml-60 p-2 sm:p-4">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-100 rounded-lg flex flex-col shadow-md p-4 text-center items-center cursor-pointer hover:shadow-lg transition-shadow">
            <HandPlatter size={32} className="sm:w-12 sm:h-12" />
            <p className="text-sm sm:text-base font-bold mt-2">Total Donations</p>
            <p className="text-lg sm:text-xl font-bold">{stats.totalDonations}</p>
          </div>
          <div className="bg-gray-100 rounded-lg flex flex-col shadow-md p-4 text-center items-center cursor-pointer hover:shadow-lg transition-shadow">
            <Truck size={32} className="sm:w-12 sm:h-12" />
            <p className="text-sm sm:text-base font-bold mt-2">Pending Donations</p>
            <p className="text-lg sm:text-xl font-bold">{stats.pendingDonations}</p>
          </div>
          <div className="bg-gray-100 rounded-lg flex flex-col shadow-md p-4 text-center items-center cursor-pointer hover:shadow-lg transition-shadow">
            <CircleCheck size={32} className="sm:w-12 sm:h-12" />
            <p className="text-sm sm:text-base font-bold mt-2">Matched Donations</p>
            <p className="text-lg sm:text-xl font-bold">{stats.matchedDonations}</p>
          </div>
          <div className="bg-gray-100 rounded-lg flex flex-col shadow-md p-4 text-center items-center cursor-pointer hover:shadow-lg transition-shadow">
            <Sprout size={32} className="sm:w-12 sm:h-12" />
            <p className="text-sm sm:text-base font-bold mt-2">Food Saved</p>
            <p className="text-lg sm:text-xl font-bold">{stats.totalFoodSaved}(kg)</p>
          </div>
        </div>

        {/* Create Donation Form */}
        <div className="w-full max-w-2xl mx-auto">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col items-center bg-gray-100 p-4 rounded-lg shadow-md mb-4"
          >
            <h3 className="text-xl sm:text-2xl font-bold mb-4">Create Donation</h3>
            <input
              type="text"
              placeholder="Food Name"
              name="foodName"
              value={formData.foodName}
              onChange={handleChange}
              className="border-b-2 p-2 w-full mt-4 focus:outline-none focus:border-b-2 text-sm sm:text-base"
              required
            />
            <div className="flex flex-col sm:flex-row gap-2 mt-2 w-full">
              <input
                type="number"
                placeholder="Quantity"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                className="border-b-2 p-2 flex-1 mt-4 focus:outline-none focus:border-b-2 text-sm sm:text-base"
                required
              />
              <select
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                className="border-b-2 p-2 flex-1 mt-4 focus:outline-none focus:border-b-2 bg-white text-sm sm:text-base"
                required
              >
                <option value="" disabled>Select Unit</option>
                <option value="Kg">Kg</option>
                <option value="Litres">Litres</option>
                <option value="Pieces">Pieces</option>
                <option value="Packets">Packets</option>
              </select>
            </div>
            <input
              type="text"
              placeholder="Location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="border-b-2 p-2 w-full mt-4 focus:outline-none focus:border-b-2 text-sm sm:text-base"
              required
            />
            <input
              type="number"
              placeholder="Hours Since Prepared (optional)"
              name="hoursSincePrepared"
              value={formData.hoursSincePrepared}
              onChange={handleChange}
              className="border-b-2 p-2 w-full mt-4 focus:outline-none focus:border-b-2 text-sm sm:text-base"
            />
            <button
              type="submit"
              className="bg-green-800 text-white w-full sm:w-48 lg:w-60 h-10 sm:h-12 rounded-lg cursor-pointer mt-6 text-sm sm:text-base"
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
        </div>

        {/* Recent Donations Table */}
        <div className="w-full bg-gray-100 p-4 rounded-lg shadow-md mb-4">
          <h3 className="text-xl sm:text-2xl font-bold text-center mb-4">Recent Donations</h3>
          <div className="overflow-x-auto">
            <table className="w-full rounded-lg shadow-md">
              <thead className="bg-gray-300 text-sm sm:text-base lg:text-lg font-bold rounded-lg">
                <tr className="rounded-md">
                  <th className="p-2 text-left">Food Name</th>
                  <th className="p-2 text-left">Quantity</th>
                  <th className="p-2 text-left">Unit</th>
                  <th className="p-2 text-left hidden sm:table-cell">Location</th>
                  <th className="p-2 text-left hidden lg:table-cell">Expiry Time</th>
                  <th className="p-2 text-left">Status</th>
                  <th className="p-2 text-left hidden lg:table-cell">Receiver</th>
                </tr>
              </thead>
              <tbody>
                {Donations.map((Donation) => (
                  <tr key={Donation._id || Donation.id} className="border-b-2 rounded-b-lg">
                    <td className="p-2 text-sm sm:text-base">{Donation.foodName}</td>
                    <td className="p-2 text-sm sm:text-base">{Donation.quantity}</td>
                    <td className="p-2 text-sm sm:text-base">{Donation.unit}</td>
                    <td className="p-2 text-sm sm:text-base hidden sm:table-cell">{Donation.location}</td>
                    <td className="p-2 text-sm sm:text-base hidden lg:table-cell">{Donation.expiryTime}</td>
                    <td className="p-2 text-sm sm:text-base">
                      <span className={`px-2 py-1 rounded text-xs ${
                        Donation.status === 'available' ? 'bg-green-100 text-green-800' :
                        Donation.status === 'matched' ? 'bg-yellow-100 text-yellow-800' :
                        Donation.status === 'delivered' ? 'bg-blue-100 text-blue-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {Donation.status}
                      </span>
                    </td>
                    <td className="p-2 text-sm sm:text-base hidden lg:table-cell">{Donation.receiver?.fullname || (Donation.receiver ? String(Donation.receiver) : "-")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DonorDashboard;
