import React, { useState, useEffect } from "react";
import { getMyDonations } from "../../services/services";
function DonorHistory() {
  const [Donations, setDonations] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    <div className="font-serif text-green-800 bg-green-200 w-full h-screen p-10">
      <h1 className="text-center font-bold text-2xl mb-4">Donation History</h1>
      <div className="bg-white">
        <table className="w-full text-center">
          <thead className="w-full text-center">
            <tr className="bg-gray-300 border-b-2">
              <th className="p-4">Food Name</th>
              <th>Quantity</th>
              <th>Unit</th>
              <th>Location</th>
              <th>Expiry Time</th>
              <th>Status</th>
              <th>Receiver Organization</th>
            </tr>
          </thead>
          <tbody>
            {Donations.map((Donation) => (
              <tr key={Donation.id} className="border-b-2">
                <td className="p-4">{Donation.foodName}</td>
                <td>{Donation.quantity}</td>
                <td>{Donation.unit}</td>
                <td>{Donation.location}</td>
                <td>{Donation.expiryTime}</td>
                <td>{Donation.status}</td>
                <td></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DonorHistory;
