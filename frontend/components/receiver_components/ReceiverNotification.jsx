import React, { useEffect, useState } from "react";
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
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

function ReceiverNotification() {
  const [receiver, setReceiver] = useState([]);
  const [notifications, setNotifications] = useState([]);
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

  const fetchNotifications = async () => {
    const token = localStorage.getItem("token");
    try {
      setLoading(true);
      const res = await getNotifications(token);
      setNotifications(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReceiver();
    fetchNotifications();
  }, []);

  const navigateForNotification = (n) => {
    // Map receiver-side notifications to target pages
    switch (n.type) {
      case "donation_created":
        window.location.href = "/receiver/showdonations";
        break;
      case "donation_delivered":
      case "donation_claimed":
        window.location.href = "/receiver/claimed";
        break;
      case "request_accepted":
      case "request_delivered":
        window.location.href = "/receiver/history";
        break;
      case "event_created":
        window.location.href = "/receiver/events";
        break;
      default:
        window.location.href = "/receiver";
    }
  };

  const handleMarkRead = async (id) => {
    const token = localStorage.getItem("token");
    try {
      console.log(`Marking notification ${id} as read`);
      const response = await markNotificationRead(id, token);
      console.log("Mark as read response:", response.data);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
      const clicked = notifications.find((n) => n._id === id);
      if (clicked) {
        navigateForNotification(clicked);
      }
    } catch (e) {
      console.error("Error marking notification as read:", e);
      setError(
        e.response?.data?.message || "Failed to mark notification as read"
      );
    }
  };

  const handleMarkAll = async () => {
    const token = localStorage.getItem("token");
    try {
      console.log("Marking all notifications as read");
      const response = await markAllNotificationsRead(token);
      console.log("Mark all as read response:", response.data);
      const res = await getNotifications(token);
      setNotifications(res.data);
    } catch (e) {
      console.error("Error marking all notifications as read:", e);
      setError(
        e.response?.data?.message || "Failed to mark all notifications as read"
      );
    }
  };

  if (loading)
    return <div className="font-serif text-green-800">Loading...</div>;
  if (error) return <div className="font-serif text-green-800">{error}</div>;

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
      <div className="font-serif text-green-800 w-280 ml-60 mt-24">
        <div className="flex justify-end mt-6 mr-10">
          <button
            className="bg-green-800 text-white px-4 py-2 rounded"
            onClick={handleMarkAll}
          >
            Mark all as read
          </button>
        </div>
        {notifications.map((n) => (
          <div
            key={n._id}
            className={`flex flex-col mt-10 mb-10 p-4 bg-gray-100 rounded-lg shadow-md text-center items-center cursor-pointer ml-10 mr-10 ${
              n.read ? "" : "border-2 border-green-700"
            }`}
            onClick={() => handleMarkRead(n._id)}
          >
            <p className="text-2xl font-bold mt-1">{n.title}</p>
            <p className="mt-1">{n.message}</p>
            <p className="mt-1 text-sm text-gray-600">
              {new Date(n.createdAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ReceiverNotification;
