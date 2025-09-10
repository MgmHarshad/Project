import React, { useState, useEffect } from "react";
import { getRequests } from "../../services/services";
function DonorFoodRequests() {
  const [Requests, setRequests] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getRequests();
      console.log("Requests data:", res.data);
      setRequests(res.data);
    } catch (err) {
      console.error("Requests fetch error:", err.response?.data || err.message);
      setError(err.response?.data?.error || "Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // Add this before the return statement
  if (loading) {
    return (
      <div className="font-serif text-green-800 bg-green-200 w-full p-10">
        Loading requests...
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
        <h1 className="text-center font-bold text-2xl">Food Requests</h1>
        <table className="bg-white w-full text-center mt-2">
          <thead>
            <tr className="border-b-2">
              <th className="p-4">Receiver Organization</th>
              <th>People Count</th>
              <th>Preferred Time</th>
              <th>Location</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {Requests.map((Request) => (
              <tr key={Request.id}>
                <td className="p-4">{Request.receiver.fullname}</td>
                <td>{Request.peopleCount}</td>
                <td>{Request.preferredTime}</td>
                <td>{Request.location}</td>
                <td>{Request.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DonorFoodRequests;
