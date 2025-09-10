import React, { useState, useEffect } from "react";
import { getMyRequests } from "../../services/services";
function ReceiverHistory() {
  const [Requests, setRequests] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    <div className="font-serif text-green-800 bg-green-200 w-full h-screen p-10">
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
              <tr key={Request.id} className="border-b-2">
                <td className="p-4">{Request.peopleCount}</td>
                <td>{Request.preferredTime}</td>
                <td>{Request.location}</td>
                <td>{Request.status}</td>
                <td>{Request.donor}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ReceiverHistory;
