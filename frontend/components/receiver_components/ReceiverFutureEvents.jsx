import React from "react";
import { getEvents } from "../../services/services";
import { useState, useEffect } from "react";
function ReceiverFutureEvents() {
  const [events, setEvents] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getEvents();
      console.log("Donation data:", res.data);
      setEvents(res.data);
    } catch (err) {
      console.error("Event fetch error:", err.response?.data || err.message);
      setError(err.response?.data?.error || "Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Add this before the return statement
  if (loading) {
    return (
      <div className="font-serif text-green-800 bg-green-200 w-full p-10">
        Loading Events...
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
    <div className="font-serif text-green-800 bg-green-200 w-full h-screen p-10">
      <div className="bg-green-50 rounded-lg shadow-lg py-2">
        <h1 className="text-center font-bold text-2xl">Future Events</h1>
        <table className="bg-white w-full text-center mt-2">
          <thead>
            <tr className="border-b-2">
              <th className="p-4">Organizer</th>
              <th>Event Name</th>
              <th>Date</th>
              <th>Location</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event._id || event.id}>
                <td className="p-4">{event.organizer.fullname}</td>
                <td>{event.eventName}</td>
                <td>{event.date}</td>
                <td>{event.location}</td>
                <td>{event.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ReceiverFutureEvents;
