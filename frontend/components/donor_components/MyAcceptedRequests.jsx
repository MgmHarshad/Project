import React, { useState, useEffect } from "react";
import {
  getMyAcceptedRequests,
  deliverRequest,
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

function MyAcceptedRequests() {
  const [donor, setDonor] = useState([]);

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [delivering, setDelivering] = useState({});

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

  const fetchAcceptedRequests = async () => {
    const token = localStorage.getItem("token");
    try {
      setLoading(true);
      setError(null);
      const res = await getMyAcceptedRequests(token);
      console.log("Accepted requests data:", res.data);
      setRequests(res.data);
    } catch (err) {
      console.error(
        "Accepted requests fetch error:",
        err.response?.data || err.message
      );
      setError(err.response?.data?.error || "Failed to load accepted requests");
    } finally {
      setLoading(false);
    }
  };

  const handleDeliverRequest = async (requestId) => {
    const token = localStorage.getItem("token");
    try {
      setDelivering((prev) => ({ ...prev, [requestId]: true }));
      console.log(`Marking request ${requestId} as delivered`);

      const response = await deliverRequest(requestId, token);
      console.log("Deliver response:", response.data);

      alert("Request marked as delivered successfully!");

      // Refresh the requests list
      await fetchAcceptedRequests();
    } catch (err) {
      console.error("Deliver error:", err.response?.data || err.message);
      alert(
        "Failed to mark request as delivered: " +
          (err.response?.data?.message || err.message)
      );
    } finally {
      setDelivering((prev) => ({ ...prev, [requestId]: false }));
    }
  };

  useEffect(() => {
    fetchDonor();
    fetchAcceptedRequests();
  }, []);

  if (loading) {
    return (
      <div className="font-serif text-green-800 bg-green-200 w-full p-10">
        Loading accepted requests...
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
          {donor.fullname}
        </h1>
        <div className="relative ml-auto">
          <Bell
            className="h-10 w-10 cursor-pointer mt-2"
            onClick={() => (window.location.href = "/donor/notification")}
          />
        </div>
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
          onClick={() => (window.location.href = "/donor/accepted")}
          className="flex gap-2 mt-10 p-1 cursor-pointer text-2xl font-bold"
        >
          <HandPlatter />
          <p>Accepted</p>
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
          className="flex gap-2 mt-15 p-2 cursor-pointer text-2xl font-bold"
        >
          <LogOut />
          <p> Logout</p>
        </div>
      </div>
      <div className="font-serif text-green-800 bg-white w-280 h-screen p-2 ml-60 mt-24">
        {/* <div className="bg-green-50 rounded-lg shadow-lg py-2"> */}
        <h1 className="text-center font-bold text-2xl">My Accepted Requests</h1>
        {requests.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-lg">No accepted requests found.</p>
          </div>
        ) : (
          <table className="bg-white w-full text-center mt-2">
            <thead>
              <tr className="border-b-2">
                <th className="p-4">Receiver Organization</th>
                <th>People Count</th>
                <th>Preferred Time</th>
                <th>Location</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => (
                <tr key={request._id}>
                  <td className="p-4">{request.receiver.fullname}</td>
                  <td>{request.peopleCount}</td>
                  <td>{request.preferredTime}</td>
                  <td>{request.location}</td>
                  <td>
                    <span
                      className={`px-2 py-1 rounded text-sm ${
                        request.status === "Matched"
                          ? "bg-green-100 text-green-800"
                          : request.status === "Delivered"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {request.status}
                    </span>
                  </td>
                  <td>
                    {request.status === "Matched" && (
                      <button
                        onClick={() => handleDeliverRequest(request._id)}
                        disabled={delivering[request._id]}
                        className={`px-4 py-2 rounded text-white font-medium ${
                          delivering[request._id]
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700"
                        }`}
                      >
                        {delivering[request._id]
                          ? "Marking..."
                          : "Mark as Delivered"}
                      </button>
                    )}
                    {request.status === "Delivered" && (
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
        {/* </div> */}
      </div>
    </div>
  );
}

export default MyAcceptedRequests;
