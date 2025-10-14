import React from "react";
import { registerUser } from "../services/services";
import { useState } from "react";
function Register() {
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    phno: "",
    password: "",
    role: "",
  });

  const [file, setFile] = useState(null);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFile = (e) => {
    setFile(e.target.files[0]);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("sending data", formData);

    try {
      const fd = new FormData();
      Object.keys(formData).forEach((k) => fd.append(k, formData[k]));
      if (file) fd.append("profilePic", file);
      await registerUser(fd);
      console.log("registered Successfully");
      window.location.href = "/login";
      setFormData({
        fullname: "",
        email: "",
        phno: "",
        password: "",
        role: "",
      });
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="font-serif text-green-800 mb-10 min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mt-4 sm:mt-6 lg:mt-10 p-4 sm:p-5 bg-green-800/80 text-white rounded-t-lg">
          <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold">Register</h1>
        </div>
        <form
          onSubmit={handleSubmit}
          className="text-center font-serif shadow-md p-4 sm:p-5 lg:p-6 border-2 hover:shadow-lg transition-shadow duration-300 text-green-800 rounded-b-lg"
        >
          <div className="p-2 sm:p-3 lg:p-5">
            <label className="block text-lg sm:text-xl lg:text-3xl font-bold mt-4 sm:mt-6 lg:mt-10 text-left">
              Full Name:
            </label>
            <input
              type="text"
              name="fullname"
              value={formData.fullname}
              onChange={handleChange}
              placeholder="Enter Your Full Name"
              required
              className="border-b-2 p-2 w-full mt-2 focus:outline-none focus:border-b-2 text-sm sm:text-base"
            />
          </div>
          <div className="p-2 sm:p-3 lg:p-5">
            <label className="block text-lg sm:text-xl lg:text-3xl font-bold mt-4 sm:mt-6 lg:mt-10 text-left">
              Phone Number:
            </label>
            <input
              type="tel"
              name="phno"
              value={formData.phno}
              onChange={handleChange}
              placeholder="Enter Your Mobile Number"
              required
              className="border-b-2 p-2 w-full mt-2 focus:outline-none focus:border-b-2 text-sm sm:text-base"
            />
          </div>
          <div className="p-2 sm:p-3 lg:p-5">
            <label className="block text-lg sm:text-xl lg:text-3xl font-bold mt-4 sm:mt-6 lg:mt-10 text-left">
              Email:
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter Your Email"
              required
              className="border-b-2 p-2 w-full mt-2 focus:outline-none focus:border-b-2 text-sm sm:text-base"
            />
          </div>
          <div className="p-2 sm:p-3 lg:p-5">
            <label className="block text-lg sm:text-xl lg:text-3xl font-bold mt-4 sm:mt-6 lg:mt-10 text-left">
              Password:
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter Your Password"
              required
              className="border-b-2 p-2 w-full mt-2 focus:outline-none focus:border-b-2 text-sm sm:text-base"
            />
          </div>
          <div className="p-2 sm:p-3 lg:p-5">
            <label className="block text-lg sm:text-xl lg:text-3xl font-bold mt-4 sm:mt-6 lg:mt-10 text-left">
              Role:
            </label>
            <select
              name="role"
              id="role"
              value={formData.role}
              onChange={handleChange}
              required
              className="border-b-2 p-2 w-full mt-2 focus:outline-none focus:border-b-2 text-sm sm:text-base bg-white"
            >
              <option value="">Select Role</option>
              <option value="donor">Donor</option>
              <option value="receiver">Receiver</option>
            </select>
          </div>
          <div className="p-2 sm:p-3 lg:p-5">
            <label className="block text-lg sm:text-xl lg:text-3xl font-bold mt-4 sm:mt-6 lg:mt-10 text-left">
              Profile Pic:
            </label>
            <input
              type="file"
              name="profilePic"
              accept="image/*"
              onChange={handleFile}
              className="w-full mt-2 text-sm sm:text-base"
            />
          </div>
          <button
            type="submit"
            className="bg-green-800 text-white w-full sm:w-48 lg:w-60 h-10 sm:h-12 rounded-lg cursor-pointer mt-6 sm:mt-8 lg:mt-10 text-sm sm:text-base"
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
    </div>
  );
}

export default Register;
