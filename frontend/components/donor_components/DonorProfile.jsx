import React, { useState, useEffect } from "react";
import { ChartColumnIncreasing, Medal, History } from "lucide-react";
import {
  getUser,
  logoutUser,
  updateUser,
  deleteUser,
} from "../../services/services";

function DonorProfile() {
  // const [donor, setDonor] = useState([]);
  const [donor, setDonor] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    fullname: "",
    email: "",
    phno: "",
    password: "",
  });
  const [file, setFile] = useState(null);

  const [showPassword, setShowPassword] = useState(false);

  const openEdit = () => {
    setEditData({
      fullname: donor?.fullname || "",
      email: donor?.email || "",
      phno: donor?.phno || "",
      password: donor?.password || "",
    });
    setFile(null);
    setIsEditing(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((p) => ({ ...p, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files?.[0] || null);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      // append fields only if present (allows clearing fields too if you want)
      fd.append("fullname", editData.fullname);
      fd.append("email", editData.email);
      fd.append("phno", editData.phno);
      fd.append("password", editData.password);
      if (file) fd.append("profilePic", file); // match backend field name

      const token = localStorage.getItem("token");
      const res = await updateUser(fd, token);
      console.log("Update response:", res.data);
      // refresh profile
      await fetchDonor();
      setIsEditing(false);
    } catch (err) {
      console.error("Update failed:", err.response?.data || err.message);
      alert("Update failed");
    }
  };

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

  useEffect(() => {
    fetchDonor();
  }, []);

  const deletion = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await deleteUser(token);
      console.log("delete response:", res.data);
      window.location.href = "/";
    } catch (error) {
      console.error(
        "Error in deleting user",
        error.response?.data || error.message
      );
    }
  };

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

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
            src={donor.profilePic}
            alt={
              donor?.fullname ? `${donor.fullname} profile` : "Profile Image"
            }
            className="h-46 w-46 rounded-full"
          />
        </div>
        <p className="font-bold text-2xl text-center">{donor.fullname}</p>
        <p className="cursor-pointer text-center">{donor.email}</p>
        <p className="font-sans text-center">{donor.phno}</p>
        <div className="flex flex-row justify-center mt-2">
          <button
            onClick={openEdit}
            className="bg-white text-green-800 w-60 h-12 rounded-lg cursor-pointer border"
          >
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
          <button
            onClick={deletion}
            className="bg-white text-green-800 w-60 h-12 rounded-lg cursor-pointer border"
          >
            Delete User
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
      {/* Edit modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <form
            onSubmit={handleEditSubmit}
            className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg"
            encType="multipart/form-data"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Edit Profile</h3>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                Close
              </button>
            </div>

            <label className="block mb-2">
              Fullname
              <input
                name="fullname"
                value={editData.fullname}
                onChange={handleEditChange}
                className="w-full border-b-2 p-2 mt-1"
              />
            </label>
            <label className="block mb-2">
              Email
              <input
                name="email"
                value={editData.email}
                onChange={handleEditChange}
                className="w-full border-b-2 p-2 mt-1"
              />
            </label>

            <label className="block mb-2">
              Phone
              <input
                name="phno"
                value={editData.phno}
                onChange={handleEditChange}
                className="w-full border-b-2 p-2 mt-1"
              />
            </label>

            <label className="block mb-2">
              Password
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                value={editData.password}
                onChange={handleEditChange}
                className="w-full border-b-2 p-2 mt-1"
              />
              <button type="button" onClick={togglePassword}>
                {showPassword ? "Hide" : "Show"}Password
              </button>
            </label>

            <label className="block mb-4">
              Profile Image
              <input
                type="file"
                name="profilePic"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full mt-1"
              />
            </label>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-green-800 text-white rounded"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default DonorProfile;
