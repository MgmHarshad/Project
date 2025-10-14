import React, { useState, useEffect } from "react";
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
import {
  getUser,
  logoutUser,
  createRequest,
  getMyRequests,
  getReceiverStats,
} from "../services/services";
function ReceiverDashboard() {
  const [receiver, setReceiver] = useState([]);

  const [Requests, setRequests] = useState([]);
  const [stats, setStats] = useState({
    totalRequests: 0,
    pendingRequests: 0,
    matchedRequests: 0,
    totalFoodReceived: 0
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    peopleCount: "",
    preferredTime: "",
    location: "",
  });

  const fetchReceiver = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getUser();
      console.log("Profile data:", res.data);
      setReceiver(res.data);
    } catch (err) {
      console.error("Profile fetch error:", err.response?.data || err.message);
      setError(err.response?.data?.error || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const fetchMyRequests = async () => {
    const token = localStorage.getItem("token");
    try {
      setLoading(true);
      setError(null);
      const res = await getMyRequests(token);
      console.log("Request data:", res.data);
      setRequests(res.data);
    } catch (err) {
      console.error("Requests fetch error:", err.response?.data || err.message);
      setError(err.response?.data?.error || "Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await getReceiverStats(token);
      console.log("Receiver stats:", res.data);
      setStats(res.data);
    } catch (err) {
      console.error("Stats fetch error:", err.response?.data || err.message);
      // Don't set error for stats, just log it
    }
  };

  useEffect(() => {
    fetchReceiver();
    fetchMyRequests();
    fetchStats();
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
    console.log("=== REQUEST FORM SUBMITTED ===");
    const token = localStorage.getItem("token");
    try {
      const response = await createRequest(formData, token);
      // const user = response.data.user;

      console.log("Request Response", response.data); // Debug log
      alert("Request Created successful!");
      setFormData({
        peopleCount: "",
        preferredTime: "",
        location: "",
      });
      window.location.href = "/receiver";
    } catch (err) {
      console.error("Request error:", err.response?.data || err.message);
      alert("Request failed: " + (err.response?.data?.error || err.message));
    }
  };
  return (
    <div className="font-serif text-green-800 min-h-screen">
      {/* Mobile Navigation */}
      <nav className="bg-gray-300 flex flex-col sm:flex-row h-auto sm:h-20 p-2 fixed w-full top-0 rounded-br-lg shadow-md z-20">
        <h1 className="text-xl sm:text-2xl lg:text-4xl font-bold mt-2 ml-2 sm:ml-4 cursor-pointer truncate">
          {receiver.fullname}
        </h1>
        <div className="flex items-center gap-2 sm:gap-4 ml-auto mt-2 sm:mt-0">
          <Bell
            className="h-8 w-8 sm:h-10 sm:w-10 cursor-pointer"
            onClick={() => (window.location.href = "/receiver/notification")}
          />
          <CircleUserRound
            className="h-8 w-8 sm:h-10 sm:w-10 cursor-pointer"
            onClick={() => (window.location.href = "/receiver/profile")}
          />
        </div>
      </nav>

      {/* Sidebar - Hidden on mobile, visible on larger screens */}
      <div className="hidden lg:block bg-gray-200 flex flex-col fixed h-full w-60 p-2 mt-20 top-0 rounded-br-lg shadow-md text-center">
        <div
          onClick={() => (window.location.href = "/receiver")}
          className="flex gap-2 mt-10 p-2 cursor-pointer text-2xl font-bold hover:bg-gray-300 rounded"
        >
          <LayoutDashboard />
          <p> Dashboard</p>
        </div>
        <div
          onClick={() => (window.location.href = "/receiver/history")}
          className="flex gap-2 mt-10 p-2 cursor-pointer text-2xl font-bold hover:bg-gray-300 rounded"
        >
          <History />
          <p> History</p>
        </div>
        <div
          onClick={() => (window.location.href = "/receiver/showdonations")}
          className="flex gap-2 mt-10 p-1 cursor-pointer text-2xl font-bold hover:bg-gray-300 rounded"
        >
          <HandPlatter />
          <p>Donations</p>
        </div>
        <div
          onClick={() => (window.location.href = "/receiver/claimed")}
          className="flex gap-2 mt-10 p-1 cursor-pointer text-2xl font-bold hover:bg-gray-300 rounded"
        >
          <HandPlatter />
          <p>Claimed</p>
        </div>
        <div
          onClick={() => (window.location.href = "/receiver/events")}
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
          onClick={() => (window.location.href = "/receiver")}
          className="flex gap-1 p-2 cursor-pointer text-sm font-bold bg-white rounded hover:bg-gray-100"
        >
          <LayoutDashboard size={16} />
          <span>Dashboard</span>
        </button>
        <button
          onClick={() => (window.location.href = "/receiver/history")}
          className="flex gap-1 p-2 cursor-pointer text-sm font-bold bg-white rounded hover:bg-gray-100"
        >
          <History size={16} />
          <span>History</span>
        </button>
        <button
          onClick={() => (window.location.href = "/receiver/showdonations")}
          className="flex gap-1 p-2 cursor-pointer text-sm font-bold bg-white rounded hover:bg-gray-100"
        >
          <HandPlatter size={16} />
          <span>Donations</span>
        </button>
        <button
          onClick={() => (window.location.href = "/receiver/claimed")}
          className="flex gap-1 p-2 cursor-pointer text-sm font-bold bg-white rounded hover:bg-gray-100"
        >
          <HandPlatter size={16} />
          <span>Claimed</span>
        </button>
        <button
          onClick={() => (window.location.href = "/receiver/events")}
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
            <p className="text-sm sm:text-base font-bold mt-2">Total Requests</p>
            <p className="text-lg sm:text-xl font-bold">{stats.totalRequests}</p>
          </div>
          <div className="bg-gray-100 rounded-lg flex flex-col shadow-md p-4 text-center items-center cursor-pointer hover:shadow-lg transition-shadow">
            <Truck size={32} className="sm:w-12 sm:h-12" />
            <p className="text-sm sm:text-base font-bold mt-2">Pending Requests</p>
            <p className="text-lg sm:text-xl font-bold">{stats.pendingRequests}</p>
          </div>
          <div className="bg-gray-100 rounded-lg flex flex-col shadow-md p-4 text-center items-center cursor-pointer hover:shadow-lg transition-shadow">
            <CircleCheck size={32} className="sm:w-12 sm:h-12" />
            <p className="text-sm sm:text-base font-bold mt-2">Matched Requests</p>
            <p className="text-lg sm:text-xl font-bold">{stats.matchedRequests}</p>
          </div>
          <div className="bg-gray-100 rounded-lg flex flex-col shadow-md p-4 text-center items-center cursor-pointer hover:shadow-lg transition-shadow">
            <Sprout size={32} className="sm:w-12 sm:h-12" />
            <p className="text-sm sm:text-base font-bold mt-2">Food Received</p>
            <p className="text-lg sm:text-xl font-bold">{stats.totalFoodReceived}(kg)</p>
          </div>
        </div>

        {/* Create Request Form */}
        <div className="w-full max-w-2xl mx-auto">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col items-center bg-gray-100 p-4 rounded-lg shadow-md mb-4"
          >
            <h3 className="text-xl sm:text-2xl font-bold mb-4">Create Request</h3>
            <input
              type="number"
              placeholder="People Count"
              name="peopleCount"
              value={formData.peopleCount}
              onChange={handleChange}
              className="border-b-2 p-2 w-full mt-4 focus:outline-none focus:border-b-2 text-sm sm:text-base"
              required
            />
            <input
              type="date"
              placeholder="Preferred Time"
              name="preferredTime"
              value={formData.preferredTime}
              onChange={handleChange}
              className="border-b-2 p-2 w-full mt-4 focus:outline-none focus:border-b-2 text-sm sm:text-base"
              required
            />
            <input
              type="text"
              placeholder="Location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="border-b-2 p-2 w-full mt-4 focus:outline-none focus:border-b-2 text-sm sm:text-base"
              required
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

        {/* Recent Requests Table */}
        <div className="w-full bg-gray-100 p-4 rounded-lg shadow-md mb-4">
          <h3 className="text-xl sm:text-2xl font-bold text-center mb-4">Recent Requests</h3>
          <div className="overflow-x-auto">
            <table className="w-full rounded-lg shadow-md">
              <thead className="bg-gray-300 text-sm sm:text-base lg:text-lg font-bold rounded-lg">
                <tr className="rounded-md">
                  <th className="p-2 text-left">People Count</th>
                  <th className="p-2 text-left">Preferred Time</th>
                  <th className="p-2 text-left hidden sm:table-cell">Location</th>
                  <th className="p-2 text-left">Status</th>
                  <th className="p-2 text-left hidden lg:table-cell">Donor</th>
                </tr>
              </thead>
              <tbody>
                {Requests.map((Request) => (
                  <tr key={Request._id || Request.id} className="border-b-2 rounded-b-lg">
                    <td className="p-2 text-sm sm:text-base">{Request.peopleCount}</td>
                    <td className="p-2 text-sm sm:text-base">{Request.preferredTime}</td>
                    <td className="p-2 text-sm sm:text-base hidden sm:table-cell">{Request.location}</td>
                    <td className="p-2 text-sm sm:text-base">
                      <span className={`px-2 py-1 rounded text-xs ${
                        Request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        Request.status === 'matched' ? 'bg-green-100 text-green-800' :
                        Request.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {Request.status}
                      </span>
                    </td>
                    <td className="p-2 text-sm sm:text-base hidden lg:table-cell">{Request.donor?.fullname || (Request.donor ? String(Request.donor) : "-")}</td>
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

export default ReceiverDashboard;
