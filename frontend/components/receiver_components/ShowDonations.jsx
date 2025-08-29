import React, {useState, useEffect} from 'react'
import { getDonation } from '../../services/services';
function ShowDonations() {
    const [donations, setDonation] = useState([]);
    
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);
    
      const fetchDonation = async () => {
        try {
          setLoading(true);
          setError(null);
          const res = await getDonation();
          console.log("Donation data:", res.data);
          setDonation(res.data);
        } catch (err) {
          console.error("Donation fetch error:", err.response?.data || err.message);
          setError(err.response?.data?.error || "Failed to load donations");
        } finally {
          setLoading(false);
        }
      };
    
      useEffect(() => {
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
    <div className="font-serif text-green-800 bg-green-200 w-full h-screen p-10">
      <div className="bg-green-50 rounded-lg shadow-lg py-2">
        <h1 className="text-center font-bold text-2xl">Available Food Requests</h1>
        <table className="bg-white w-full text-center mt-2">
          <thead>
            <tr className="border-b-2">
              <th className="p-4">Donor Name</th>
              <th>Food Name</th>
              <th>Quantity</th>
              <th>Unit</th>
              <th>Location</th>
              <th>Expiry Time</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>{donations.map((donation)=>(
            <tr key={donation.id}>
                <td className="p-4">{donation.donor.fullname}</td>
                <td>{donation.foodName}</td>
                <td>{donation.quantity}</td>
                <td>{donation.unit}</td>
                <td>{donation.location}</td>
                <td>{donation.expiryTime}</td>
                <td>{donation.status}</td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  )
}

export default ShowDonations