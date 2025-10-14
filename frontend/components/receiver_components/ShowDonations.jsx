import React, { useState, useEffect } from "react";
import {
  getAvailableDonations,
  claimDonation,
  getUser,
  logoutUser,
} from "../../services/services";
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
function ShowDonations() {
  const [receiver, setReceiver] = useState([]);

  const [donations, setDonation] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [claiming, setClaiming] = useState({});

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

  const fetchDonation = async () => {
    const token = localStorage.getItem("token");
    try {
      setLoading(true);
      setError(null);
      const res = await getAvailableDonations(token);
      console.log("Available donations data:", res.data);
      setDonation(res.data);
    } catch (err) {
      console.error("Donation fetch error:", err.response?.data || err.message);
      setError(err.response?.data?.error || "Failed to load donations");
    } finally {
      setLoading(false);
    }
  };

  const handleClaimDonation = async (donationId) => {
    const token = localStorage.getItem("token");
    try {
      setClaiming((prev) => ({ ...prev, [donationId]: true }));
      console.log(`Claiming donation ${donationId}`);

      const response = await claimDonation(donationId, token);
      console.log("Claim response:", response.data);

      alert("Donation claimed successfully!");

      // Refresh the donations list
      await fetchDonation();
    } catch (err) {
      console.error("Claim error:", err.response?.data || err.message);
      alert(
        "Failed to claim donation: " +
          (err.response?.data?.message || err.message)
      );
    } finally {
      setClaiming((prev) => ({ ...prev, [donationId]: false }));
    }
  };

  useEffect(() => {
    fetchReceiver();
    fetchDonation();
  }, []);

  // Add this before the return statement
  if (loading) {
    return (
      <div className="font-serif text-green-800 bg-green-200 w-full p-10">
        Loading donations...
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
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
          <h1 className="text-center font-bold text-xl sm:text-2xl mb-4 sm:mb-6">
            Available Food Donations
          </h1>
          <div className="overflow-x-auto">
            <table className="bg-white w-full text-center">
              <thead>
                <tr className="border-b-2 bg-gray-300">
                  <th className="p-2 sm:p-4 text-sm sm:text-base">Donor Name</th>
                  <th className="p-2 sm:p-4 text-sm sm:text-base">Food Name</th>
                  <th className="p-2 sm:p-4 text-sm sm:text-base">Quantity</th>
                  <th className="p-2 sm:p-4 text-sm sm:text-base">Unit</th>
                  <th className="p-2 sm:p-4 text-sm sm:text-base hidden sm:table-cell">Location</th>
                  <th className="p-2 sm:p-4 text-sm sm:text-base hidden lg:table-cell">Expiry Time</th>
                  <th className="p-2 sm:p-4 text-sm sm:text-base">Status</th>
                  <th className="p-2 sm:p-4 text-sm sm:text-base">Action</th>
                </tr>
              </thead>
              <tbody>
                {donations.map((donation) => (
                  <tr key={donation._id} className="border-b">
                    <td className="p-2 sm:p-4 text-sm sm:text-base">{donation.donor.fullname}</td>
                    <td className="p-2 sm:p-4 text-sm sm:text-base">{donation.foodName}</td>
                    <td className="p-2 sm:p-4 text-sm sm:text-base">{donation.quantity}</td>
                    <td className="p-2 sm:p-4 text-sm sm:text-base">{donation.unit}</td>
                    <td className="p-2 sm:p-4 text-sm sm:text-base hidden sm:table-cell">{donation.location}</td>
                    <td className="p-2 sm:p-4 text-sm sm:text-base hidden lg:table-cell">{donation.expiryTime}</td>
                    <td className="p-2 sm:p-4 text-sm sm:text-base">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          donation.status === "available"
                            ? "bg-green-100 text-green-800"
                            : donation.status === "matched"
                            ? "bg-yellow-100 text-yellow-800"
                            : donation.status === "delivered"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {donation.status}
                      </span>
                    </td>
                    <td className="p-2 sm:p-4 text-sm sm:text-base">
                      {donation.status === "available" && (
                        <button
                          onClick={() => handleClaimDonation(donation._id)}
                          disabled={claiming[donation._id]}
                          className={`px-2 sm:px-4 py-1 sm:py-2 rounded text-white font-medium text-xs sm:text-sm ${
                            claiming[donation._id]
                              ? "bg-gray-400 cursor-not-allowed"
                              : "bg-green-600 hover:bg-green-700"
                          }`}
                        >
                          {claiming[donation._id] ? "Claiming..." : "Claim"}
                        </button>
                      )}
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

export default ShowDonations;
