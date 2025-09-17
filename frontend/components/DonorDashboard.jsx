import React, { useState, useEffect } from "react";
import {
  getUser,
  logoutUser,
  createDonation,
  getMyDonations,
} from "../services/services";
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
import { Link } from "react-router-dom";
function DonorDashboard() {
  const [donor, setDonor] = useState([]);

  const [Donations, setDonations] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    foodName: "",
    quantity: "",
    unit: "",
    location: "",
    hoursSincePrepared: "",
  });

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
    fetchDonor();
    fetchMyDonations();
  }, []);

  // Add this before the return statement
  if (loading) {
    return (
      <div className="font-serif text-green-800 bg-green-200 w-full p-10">
        Loading profile...
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

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const payload = {
        foodName: formData.foodName,
        quantity: Number(formData.quantity),
        unit: formData.unit,
        location: formData.location,
        hoursSincePrepared:
          formData.hoursSincePrepared === ""
            ? undefined
            : Number(formData.hoursSincePrepared),
      };

      const response = await createDonation(payload, token);
      // const user = response.data.user;

      console.log("Donation Response", response.data); // Debug log
      const ml = response.data?.mlPrediction;
      const usedExpiry = response.data?.donation?.expiryDuration;
      const msg = ml?.spoilage_risk
        ? `Donation successful! Risk: ${ml.spoilage_risk}, Remaining: ${ml.remaining_fresh_hours}h, Expiry set to: ${usedExpiry}h`
        : `Donation successful! Expiry set to: ${usedExpiry}h`;
      alert(msg);
      setFormData({
        foodName: "",
        quantity: "",
        unit: "",
        location: "",
        hoursSincePrepared: "",
      });
      window.location.href = "/donor";
    } catch (err) {
      console.error("Donation error:", err.response?.data || err.message);
      alert("Donation failed: " + (err.response?.data?.error || err.message));
    }
  };
  return (
    <div className="font-serif text-green-800">
      <nav className="bg-gray-300 flex h-20 p-2 fixed w-full top-0 rounded-br-lg shadow-md z-20">
        <h1 className="text-4xl font-bold mt-2 ml-4 cursor-pointer">
          {donor.fullname}
        </h1>
        <Bell
          className="h-10 w-10 cursor-pointer mt-2 ml-auto"
          onClick={() => (window.location.href = "/donor/notification")}
        />
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
          className="flex gap-2 mt-35 p-2 cursor-pointer text-2xl font-bold"
        >
          <LogOut />
          <p> Logout</p>
        </div>
      </div>
      <div className="flex flex-row gap-10 mt-24 ml-60 p-2">
        <div className="bg-gray-100 rounded-lg flex flex-col shadow-md p-4 w-64 text-center items-center cursor-pointer">
          <HandPlatter size={48} />
          <p className="text-1xl font-bold">Total Donations</p>
          <p className="text-1xl font-bold">12</p>
        </div>
        <div className="bg-gray-100 rounded-lg flex flex-col shadow-md p-4 w-64 text-center items-center cursor-pointer">
          <Truck size={48} />
          <p className="text-1xl font-bold">Pending Donations</p>
          <p className="text-1xl font-bold">2</p>
        </div>
        <div className="bg-gray-100 rounded-lg flex flex-col shadow-md p-4 w-64 text-center items-center cursor-pointer">
          <CircleCheck size={48} />
          <p className="text-1xl font-bold">Matched Donations</p>
          <p className="text-1xl font-bold">10</p>
        </div>
        <div className="bg-gray-100 rounded-lg flex flex-col shadow-md p-4 w-64 text-center items-center cursor-pointer">
          <Sprout size={48} />
          <p className="text-1xl font-bold">Food Saved</p>
          <p className="text-1xl font-bold">130(kg)</p>
        </div>
      </div>
      <div className="w-280">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center mt-10 ml-62 w-full bg-gray-100 p-4 rounded-lg shadow-md mb-4"
        >
          <h3 className="text-2xl font-bold">Create Donation</h3>
          <input
            type="text"
            placeholder="Food Name"
            name="foodName"
            value={formData.foodName}
            onChange={handleChange}
            className="border-b-2 p-2 w-full mt-4 focus:outline-none focus:border-b-2"
          />
          <div className="flex flex-row gap-2 mt-2">
            <input
              type="number"
              placeholder="Quantity"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              className="border-b-2 p-2 w-134 mt-4 focus:outline-none focus:border-b-2"
            />
            <select
              name="unit"
              value={formData.unit}
              onChange={handleChange}
              className="border-b-2 p-2 w-134 mt-4 focus:outline-none focus:border-b-2 bg-white"
            >
              <option value="" disabled>Select Unit</option>
              <option value="Kg">Kg</option>
              <option value="Litres">Litres</option>
              <option value="Pieces">Pieces</option>
              <option value="Packets">Packets</option>
            </select>
          </div>
          <input
            type="text"
            placeholder="Location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="border-b-2 p-2 w-full mt-4 focus:outline-none focus:border-b-2"
          />
          <input
            type="number"
            placeholder="Hours Since Prepared (optional)"
            name="hoursSincePrepared"
            value={formData.hoursSincePrepared}
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
      <div className="text-center mt-10 w-280 bg-gray-100 p-4 rounded-lg shadow-md mb-4 ml-62">
        <h3 className="text-2xl font-bold">Recent Donations</h3>
        <table className="w-full mt-4 rounded-lg shadow-md">
          <thead className="bg-gray-300 text-2xl font-bold rounded-lg">
            <tr className="rounded-md">
              <th className="p-2">Food Name</th>
              <th>Quantity</th>
              <th>Unit</th>
              <th>Location</th>
              <th>Expiry Time</th>
              {/* <th>Risk</th> */}
              <th>Status</th>
              <th>Receiver Organization</th>
            </tr>
          </thead>
          <tbody>
            {Donations.map((Donation) => (
              <tr key={Donation.id} className="border-b-2 rounded-b-lg">
                <td className="p-4">{Donation.foodName}</td>
                <td>{Donation.quantity}</td>
                <td>{Donation.unit}</td>
                <td>{Donation.location}</td>
                <td>{Donation.expiryTime}</td>
                {/* <td>{Donation.spoilageRisk ?? "-"}</td> */}
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

export default DonorDashboard;
