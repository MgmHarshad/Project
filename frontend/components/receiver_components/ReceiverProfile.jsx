import React, { useEffect, useState } from "react";
import Profile from "../../src/Assets/Profile.png";
import { ChartColumnIncreasing } from "lucide-react";
import { Medal } from "lucide-react";
import { History } from "lucide-react";
import { getUser } from "../../services/services";
import { logoutUser } from "../../services/services";
function ReceiverProfile() {
  const [receiver, setReceiver] = useState([]);

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

  useEffect(() => {
    fetchReceiver();
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
  return (
    <div className="font-serif text-green-800 bg-green-200 w-full p-10">
      <div className="bg-white p-2 rounded-lg shadow-lg mx-40 flex flex-col items-center">
        <div className="flex flex-row justify-center my-5">
          <img
            src={Profile}
            alt="Profile Image"
            className="h-46 w-46 rounded-full"
          />
        </div>
        <p className="font-bold text-2xl text-center">{receiver.fullname}</p>
        <p className="cursor-pointer text-center">{receiver.email}</p>
        <p className="font-sans text-center">9481131520</p>
        <div className="flex flex-row justify-center mt-2">
          <button className="bg-white text-green-800 w-60 h-12 rounded-lg cursor-pointer border">
            Edit Profile
          </button>
        </div>
        <div className="p-2 rounded-lg shadow-lg mx-4 my-4 w-200">
          <div className="flex flex-row gap-2">
            <ChartColumnIncreasing />
            <p className="font-bold text-2xl">Statistics</p>
          </div>
          <div className="flex flex-row gap-100 justify-around mt-2 p-2">
            <div className="flex flex-col items-center">
              <p>
                Total Donations: <span className="font-sans">8</span>
              </p>
              <p>
                Meals Donated: <span className="font-sans">240</span>
              </p>
            </div>
            <div className="flex flex-col items-center">
              <p>
                Total Weight: <span className="font-sans">72</span>Kg
              </p>
              <p>
                Recent Donation: <span className="font-sans">18</span>Jul{" "}
                <span className="font-sans">2025</span>
              </p>
            </div>
          </div>
        </div>
        <div className="p-2 rounded-lg shadow-lg mx-4 my-4 w-200">
          <div className="flex flex-row gap-2">
            <Medal />
            <p>
              <span className="font-bold text-2xl">Achievements</span>{" "}
              <span className="ml-120">View All</span>
            </p>
          </div>
          <div className="flex flex-row gap-100 mt-2 p-2 justify-around">
            <p>First Donation</p>
            <p>Monthly Contributor</p>
          </div>
        </div>
        <div className="p-2 rounded-lg shadow-lg mx-4 my-4 w-200">
          <div className="flex flex-row gap-2">
            <History />
            <p className="font-bold text-2xl">Donation History</p>
          </div>
          <div className="flex flex-row gap-4 mt-2 p-2 justify-around">
            <p>
              <span className="font-sans">18</span>Jul{" "}
              <span className="font-sans">2025</span>
            </p>
            <p>Rice</p>
            <p>
              <span className="font-sans">15</span> kg
            </p>
          </div>
          <div className="flex flex-row gap-4 mt-2 p-2 justify-around">
            <p>
              <span className="font-sans">20</span>Jul{" "}
              <span className="font-sans">2025</span>
            </p>
            <p>Dosa</p>
            <p>
              <span className="font-sans">40</span>
            </p>
          </div>
        </div>
        <div className="flex flex-row gap-50 mx-4 my-4 p-2">
          <button className="bg-white text-green-800 w-60 h-12 rounded-lg cursor-pointer border">
            Change Password
          </button>
          <button
            onClick={async () => {
              try {
                await logoutUser();
                localStorage.removeItem("uid");
                window.location.href = "/";
              } catch (error) {
                console.error(error);
              }
            }}
            className="bg-green-800 text-white w-60 h-12 rounded-lg cursor-pointer"
          >
            LogOut
          </button>
        </div>
      </div>
    </div>
  );
}

export default ReceiverProfile;
