import React, { useState, useEffect } from "react";
import { getUser, getMyDonations, logoutUser } from "../../services/services";
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
function DonorHistory() {
  const [donor, setDonor] = useState([]);
  const [Donations, setDonations] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  useEffect(() => {
    fetchDonor();
    fetchMyDonations();
  }, []);

  // Add this before the return statement
  if (loading) {
    return (
      <div className="font-serif text-green-800 bg-green-200 w-full p-10">
        Loading Donations...
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
    <div className="text-green-800 font-serif min-h-screen">
      {/* Mobile Navigation */}
      <nav className="bg-gray-300 flex flex-col sm:flex-row h-auto sm:h-20 p-2 fixed w-full top-0 rounded-br-lg shadow-md z-20">
        <h1 className="text-xl sm:text-2xl lg:text-4xl font-bold mt-2 ml-2 sm:ml-4 cursor-pointer truncate">
          {donor.fullname}
        </h1>
        <div className="flex items-center gap-2 sm:gap-4 ml-auto mt-2 sm:mt-0">
          <Bell
            className="h-8 w-8 sm:h-10 sm:w-10 cursor-pointer"
            onClick={() => (window.location.href = "/donor/notification")}
          />
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
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
          <h1 className="text-center font-bold text-xl sm:text-2xl mb-4 sm:mb-6">
            Donation History
          </h1>
          <div className="overflow-x-auto">
            <table className="w-full text-center">
              <thead className="bg-gray-300 border-b-2">
                <tr>
                  <th className="p-2 sm:p-4 text-sm sm:text-base">Food Name</th>
                  <th className="p-2 sm:p-4 text-sm sm:text-base">Quantity</th>
                  <th className="p-2 sm:p-4 text-sm sm:text-base">Unit</th>
                  <th className="p-2 sm:p-4 text-sm sm:text-base hidden sm:table-cell">Location</th>
                  <th className="p-2 sm:p-4 text-sm sm:text-base hidden lg:table-cell">Expiry Time</th>
                  <th className="p-2 sm:p-4 text-sm sm:text-base">Status</th>
                  <th className="p-2 sm:p-4 text-sm sm:text-base hidden lg:table-cell">Receiver</th>
                </tr>
              </thead>
              <tbody>
                {Donations.map((Donation) => (
                  <tr key={Donation._id || Donation.id} className="border-b-2">
                    <td className="p-2 sm:p-4 text-sm sm:text-base">{Donation.foodName}</td>
                    <td className="p-2 sm:p-4 text-sm sm:text-base">{Donation.quantity}</td>
                    <td className="p-2 sm:p-4 text-sm sm:text-base">{Donation.unit}</td>
                    <td className="p-2 sm:p-4 text-sm sm:text-base hidden sm:table-cell">{Donation.locationName || Donation.location}</td>
                    <td className="p-2 sm:p-4 text-sm sm:text-base hidden lg:table-cell">{Donation.expiryTime}</td>
                    <td className="p-2 sm:p-4 text-sm sm:text-base">
                      <span className={`px-2 py-1 rounded text-xs ${
                        Donation.status === 'available' ? 'bg-green-100 text-green-800' :
                        Donation.status === 'matched' ? 'bg-yellow-100 text-yellow-800' :
                        Donation.status === 'delivered' ? 'bg-blue-100 text-blue-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {Donation.status}
                      </span>
                    </td>
                    <td className="p-2 sm:p-4 text-sm sm:text-base hidden lg:table-cell">
                      {Donation.receiver?.fullname ||
                        (Donation.receiver ? String(Donation.receiver) : "-")}
                    </td>
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

export default DonorHistory;
