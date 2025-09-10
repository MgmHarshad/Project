import React, { useState, useEffect } from "react";
import { createEvents, getMyEvents } from "../../services/services";
function DonorFutureEvents() {
  const [formData, setFormData] = useState({
    eventName: "",
    date: "",
    location: "",
  });
  const [events, setEvents] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const response = await createEvents(formData, token);
      // const user = response.data.user;

      console.log("Event Creation Response", response.data); // Debug log
      alert("Donation successful!");
      setFormData({
        eventName: "",
        date: "",
        location: "",
      });
      window.location.href = "/donor/events";
    } catch (err) {
      console.error("Event Creation error:", err.response?.data || err.message);
      alert(
        "Event Creation failed: " + (err.response?.data?.error || err.message)
      );
    }
  };

  const fetchMyEvents = async () => {
    const token = localStorage.getItem("token");
    try {
      setLoading(true);
      setError(null);
      const res = await getMyEvents(token);
      console.log("Events data:", res.data);
      setEvents(res.data);
    } catch (err) {
      console.error("Event fetch error:", err.response?.data || err.message);
      setError(err.response?.data?.error || "Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyEvents();
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
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center w-full bg-gray-100 p-4 rounded-lg shadow-md"
        >
          <h3 className="text-2xl font-bold">Create Future Event</h3>
          <input
            type="text"
            placeholder="Event Name"
            name="eventName"
            value={formData.eventName}
            onChange={handleChange}
            className="border-b-2 p-2 w-full mt-4 focus:outline-none focus:border-b-2"
          />
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="border-b-2 p-2 w-full mt-4 focus:outline-none focus:border-b-2"
          />
          <input
            type="text"
            placeholder="Location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="border-b-2 p-2 w-full mt-4 focus:outline-none focus:border-b-2"
          />
          <button
            type="submit"
            className="bg-green-800 text-white w-60 h-12 rounded-lg cursor-pointer mt-6"
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
      <div className="bg-green-50 rounded-lg shadow-lg py-2 mt-10">
        <h1 className="text-center font-bold text-2xl">Future Events</h1>
        <table className="bg-white w-full text-center mt-2">
          <thead>
            <tr className="border-b-2">
              <th className="p-4">Event Name</th>
              <th>Date</th>
              <th>Location</th>
              <th>Organizer</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event._id || event.id}>
                <td className="p-4">{event.eventName}</td>
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

export default DonorFutureEvents;
