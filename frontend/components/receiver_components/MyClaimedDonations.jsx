import React, { useState, useEffect } from "react";
import {
  getMyClaimedDonations,
  deliverDonation,
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

function MyClaimedDonations() {
  const [receiver, setReceiver] = useState([]);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [delivering, setDelivering] = useState({});

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

  const fetchClaimedDonations = async () => {
    const token = localStorage.getItem("token");
    try {
      setLoading(true);
      setError(null);
      const res = await getMyClaimedDonations(token);
      console.log("Claimed donations data:", res.data);
      setDonations(res.data);
    } catch (err) {
      console.error(
        "Claimed donations fetch error:",
        err.response?.data || err.message
      );
      setError(err.response?.data?.error || "Failed to load claimed donations");
    } finally {
      setLoading(false);
    }
  };

  const handleDeliverDonation = async (donationId) => {
    const token = localStorage.getItem("token");
    try {
      setDelivering((prev) => ({ ...prev, [donationId]: true }));
      console.log(`Marking donation ${donationId} as delivered`);

      const response = await deliverDonation(donationId, token);
      console.log("Deliver response:", response.data);

      alert("Donation marked as delivered successfully!");

      // Refresh the donations list
      await fetchClaimedDonations();
    } catch (err) {
      console.error("Deliver error:", err.response?.data || err.message);
      alert(
        "Failed to mark donation as delivered: " +
          (err.response?.data?.message || err.message)
      );
    } finally {
      setDelivering((prev) => ({ ...prev, [donationId]: false }));
    }
  };

  useEffect(() => {
    fetchReceiver();
    fetchClaimedDonations();
  }, []);

  if (loading) {
    return (
      <div className="font-serif text-green-800 bg-green-200 w-full p-10">
        Loading claimed donations...
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
    <div className="font-serif text-green-800">
      <nav className="bg-gray-300 flex h-20 p-2 fixed w-full top-0 rounded-br-lg shadow-md z-20">
        <h1 className="text-4xl font-bold mt-2 ml-4 cursor-pointer">
          {receiver.fullname}
        </h1>
        <Bell
          className="h-10 w-10 cursor-pointer mt-2 ml-auto"
          onClick={() => (window.location.href = "/receiver/notification")}
        />
        <CircleUserRound
          className="h-10 w-10 cursor-pointer mt-2 ml-10 mr-4"
          onClick={() => (window.location.href = "/receiver/profile")}
        />
      </nav>
      <div className="bg-gray-200 flex flex-col fixed h-full w-60 p-2 mt-20 top-0 rounded-br-lg shadow-md text-center">
        <div
          onClick={() => (window.location.href = "/receiver")}
          className="flex gap-2 mt-10 p-2 cursor-pointer text-2xl font-bold"
        >
          <LayoutDashboard />
          <p> Dashboard</p>
        </div>
        <div
          onClick={() => (window.location.href = "/receiver/history")}
          className="flex gap-2 mt-10 p-2 cursor-pointer text-2xl font-bold"
        >
          <History />
          <p> History</p>
        </div>
        <div
          onClick={() => (window.location.href = "/receiver/showdonations")}
          className="flex gap-2 mt-10 p-1 cursor-pointer text-2xl font-bold"
        >
          <HandPlatter />
          <p>Donations</p>
        </div>
        <div
          onClick={() => (window.location.href = "/receiver/claimed")}
          className="flex gap-2 mt-10 p-1 cursor-pointer text-2xl font-bold"
        >
          <HandPlatter />
          <p>Claimed</p>
        </div>
        <div
          onClick={() => (window.location.href = "/receiver/events")}
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
          className="flex gap-2 mt-15 p-2 cursor-pointer text-2xl font-bold"
        >
          <LogOut />
          <p> Logout</p>
        </div>
      </div>
      <div className="font-serif text-green-800 bg-white w-280 h-screen p-2 mt-24 ml-60">
        <h1 className="text-center font-bold text-2xl">My Claimed Donations</h1>
        {donations.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-lg">No claimed donations found.</p>
          </div>
        ) : (
          <table className="bg-white w-full text-center mt-2">
            <thead>
              <tr className="border-b-2 bg-gray-100">
                <th className="p-4">Donor Name</th>
                <th>Food Name</th>
                <th>Quantity</th>
                <th>Unit</th>
                <th>Location</th>
                <th>Expiry Time</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {donations.map((donation) => (
                <tr key={donation._id}>
                  <td className="p-4">{donation.donor.fullname}</td>
                  <td>{donation.foodName}</td>
                  <td>{donation.quantity}</td>
                  <td>{donation.unit}</td>
                  <td>{donation.location}</td>
                  <td>{donation.expiryTime}</td>
                  <td>
                    <span
                      className={`px-2 py-1 rounded text-sm ${
                        donation.status === "matched"
                          ? "bg-yellow-100 text-yellow-800"
                          : donation.status === "delivered"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {donation.status}
                    </span>
                  </td>
                  <td>
                    {donation.status === "matched" && (
                      <button
                        onClick={() => handleDeliverDonation(donation._id)}
                        disabled={delivering[donation._id]}
                        className={`px-4 py-2 rounded text-white font-medium ${
                          delivering[donation._id]
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700"
                        }`}
                      >
                        {delivering[donation._id]
                          ? "Marking..."
                          : "Mark as Delivered"}
                      </button>
                    )}
                    {donation.status === "delivered" && (
                      <span className="text-green-600 font-medium">
                        ✓ Delivered
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default MyClaimedDonations;
