import React, { useState, useEffect } from "react";
import { getMyRequests, getUser, logoutUser } from "../../services/services";
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
function ReceiverHistory() {
  const [receiver, setReceiver] = useState([]);
  const [Requests, setRequests] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      console.log("Donation data:", res.data);
      setRequests(res.data);
    } catch (err) {
      console.error("Requests fetch error:", err.response?.data || err.message);
      setError(err.response?.data?.error || "Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReceiver();
    fetchMyRequests();
  }, []);

  // Add this before the return statement
  if (loading) {
    return (
      <div className="font-serif text-green-800 bg-green-200 w-full p-10">
        Loading Requests...
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
        <h1 className="text-center font-bold text-2xl mb-4">Request History</h1>
        <div className="bg-white">
          <table className="w-full text-center">
            <thead className="w-full text-center">
              <tr className="bg-gray-300 border-b-2">
                <th className="p-4">People Count</th>
                <th>Preferred Time</th>
                <th>Location</th>
                <th>Status</th>
                <th>Donor</th>
              </tr>
            </thead>
            <tbody>
              {Requests.map((Request) => (
                <tr key={Request._id || Request.id} className="border-b-2">
                  <td className="p-4">{Request.peopleCount}</td>
                  <td>{Request.preferredTime}</td>
                  <td>{Request.location}</td>
                  <td>{Request.status}</td>
                  <td>
                    {Request.donor?.fullname ||
                      (Request.donor ? String(Request.donor) : "-")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ReceiverHistory;
