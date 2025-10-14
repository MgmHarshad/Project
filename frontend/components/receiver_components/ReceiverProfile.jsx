import React, { useEffect, useState } from "react";
import Profile from "../../src/Assets/Profile.png";
import {
  getUser,
  logoutUser,
  updateUser,
  deleteUser,
  getReceiverStats,
} from "../../services/services";
import {
  ChartColumnIncreasing,
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
function ReceiverProfile() {
  const [receiver, setReceiver] = useState(null);
  const [stats, setStats] = useState({
    totalRequests: 0,
    pendingRequests: 0,
    matchedRequests: 0,
    totalFoodReceived: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    fullname: "",
    email: "",
    phno: "",
    password: "",
  });
  const [file, setFile] = useState(null);

  const [showPassword, setShowPassword] = useState(false);

  const openEdit = () => {
    setEditData({
      fullname: receiver?.fullname || "",
      email: receiver?.email || "",
      phno: receiver?.phno || "",
      password: receiver?.password || "",
    });
    setFile(null);
    setIsEditing(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((p) => ({ ...p, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files?.[0] || null);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      // append fields only if present (allows clearing fields too if you want)
      fd.append("fullname", editData.fullname);
      fd.append("email", editData.email);
      fd.append("phno", editData.phno);
      fd.append("password", editData.password);
      if (file) fd.append("profilePic", file); // match backend field name

      const token = localStorage.getItem("token");
      const res = await updateUser(fd, token);
      console.log("Update response:", res.data);
      // refresh profile
      await fetchReceiver();
      setIsEditing(false);
    } catch (err) {
      console.error("Update failed:", err.response?.data || err.message);
      alert("Update failed");
    }
  };

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
    fetchStats();
  }, []);

  const deletion = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await deleteUser(token);
      console.log("delete response:", res.data);
      window.location.href = "/";
    } catch (error) {
      console.error(
        "Error in deleting user",
        error.response?.data || error.message
      );
    }
  };

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

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
        <div className="bg-gray-100 p-4 sm:p-6 rounded-lg shadow-lg max-w-4xl mx-auto flex flex-col items-center mb-6">
          <div className="flex flex-row justify-center my-4 sm:my-5">
            <img
              src={receiver.profilePic}
              alt={
                receiver?.fullname
                  ? `${receiver.fullname} profile`
                  : "Profile Image"
              }
              className="h-30 w-30 sm:h-40 sm:w-40 lg:h-48 lg:w-40 rounded-full object-cover"
            />
          </div>
          <p className="font-bold text-xl sm:text-2xl text-center">{receiver.fullname}</p>
          <p className="cursor-pointer text-center text-sm sm:text-base">{receiver.email}</p>
          <p className="font-sans text-center text-sm sm:text-base">{receiver.phno}</p>
          <div className="flex flex-row justify-center mt-4">
            <button
              onClick={openEdit}
              className="bg-white text-green-800 w-full sm:w-48 lg:w-60 h-10 sm:h-12 rounded-lg cursor-pointer border text-sm sm:text-base"
            >
              Edit Profile
            </button>
          </div>

          <div className="flex flex-row gap-2 mt-6 sm:mt-8">
            <ChartColumnIncreasing size={24} className="sm:w-8 sm:h-8" />
            <p className="font-bold text-lg sm:text-2xl">Statistics</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8 mt-4 p-2 w-full">
            <div className="flex flex-col items-center">
              <p className="text-sm sm:text-base">
                Total Requests:{" "}
                <span className="font-sans font-bold">{stats.totalRequests}</span>
              </p>
              <p className="text-sm sm:text-base">
                Pending Requests:{" "}
                <span className="font-sans font-bold">{stats.pendingRequests}</span>
              </p>
            </div>
            <div className="flex flex-col items-center">
              <p className="text-sm sm:text-base">
                Matched Requests:{" "}
                <span className="font-sans font-bold">{stats.matchedRequests}</span>
              </p>
              <p className="text-sm sm:text-base">
                Food Received:{" "}
                <span className="font-sans font-bold">{stats.totalFoodReceived}</span>kg
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mx-4 my-4 p-2 w-full">
            <button
              onClick={deletion}
              className="bg-white text-green-800 w-full sm:w-48 lg:w-60 h-10 sm:h-12 rounded-lg cursor-pointer border text-sm sm:text-base ml-40"
            >
              Delete User
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
              className="bg-green-800 text-white w-full sm:w-48 lg:w-60 h-10 sm:h-12 rounded-lg cursor-pointer text-sm sm:text-base"
            >
              LogOut
            </button>
          </div>
        </div>
        
        {/* Edit modal */}
        {isEditing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <form
              onSubmit={handleEditSubmit}
              className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-md shadow-lg max-h-[90vh] overflow-y-auto"
              encType="multipart/form-data"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg sm:text-xl font-bold">Edit Profile</h3>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="text-gray-500 hover:text-gray-700 text-lg"
                >
                  ×
                </button>
              </div>

              <label className="block mb-3">
                <span className="text-sm sm:text-base font-medium">Fullname</span>
                <input
                  name="fullname"
                  value={editData.fullname}
                  onChange={handleEditChange}
                  className="w-full border-b-2 p-2 mt-1 text-sm sm:text-base"
                  required
                />
              </label>
              <label className="block mb-3">
                <span className="text-sm sm:text-base font-medium">Email</span>
                <input
                  name="email"
                  type="email"
                  value={editData.email}
                  onChange={handleEditChange}
                  className="w-full border-b-2 p-2 mt-1 text-sm sm:text-base"
                  required
                />
              </label>

              <label className="block mb-3">
                <span className="text-sm sm:text-base font-medium">Phone</span>
                <input
                  name="phno"
                  type="tel"
                  value={editData.phno}
                  onChange={handleEditChange}
                  className="w-full border-b-2 p-2 mt-1 text-sm sm:text-base"
                  required
                />
              </label>

              <label className="block mb-3">
                <span className="text-sm sm:text-base font-medium">Password</span>
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={editData.password}
                  onChange={handleEditChange}
                  className="w-full border-b-2 p-2 mt-1 text-sm sm:text-base"
                />
                <button 
                  type="button" 
                  onClick={togglePassword}
                  className="text-xs sm:text-sm text-blue-600 mt-1"
                >
                  {showPassword ? "Hide" : "Show"} Password
                </button>
              </label>

              <label className="block mb-4">
                <span className="text-sm sm:text-base font-medium">Profile Image</span>
                <input
                  type="file"
                  name="profilePic"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full mt-1 text-sm sm:text-base"
                />
              </label>
              <div className="flex flex-col sm:flex-row justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 border rounded text-sm sm:text-base"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-800 text-white rounded text-sm sm:text-base"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default ReceiverProfile;
