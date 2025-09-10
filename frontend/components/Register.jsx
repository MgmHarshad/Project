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
      alert("Registered Successfully");
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
    <div className="font-serif  text-green-800 mb-10">
      <div className="text-center mt-10 p-5 bg-green-800/80 text-white w-300 m-auto rounded-t-lg">
        <h1 className="text-6xl font-bold">Register</h1>
      </div>
      <form
        onSubmit={handleSubmit}
        className="text-center w-300 m-auto font-serif shadow-md p-5 border-2 hover:shadow-lg transition-shadow duration-300 text-green-800 rounded-b-lg"
      >
        <div className="p-10">
          <label className="block text-3xl font-bold mt-10 text-left ml-2">
            Full Name:
          </label>
          <input
            type="text"
            name="fullname"
            value={formData.fullname}
            onChange={handleChange}
            placeholder="Enter Your Full Name"
            required
            className="border-b-2 p-2 w-full mt-2 focus:outline-none focus:border-b-2"
          />
        </div>
        <div className="p-10">
          <label className="block text-3xl font-bold mt-10 text-left ml-2">
            Phone Number:
          </label>
          <input
            type="number"
            name="phno"
            value={formData.phno}
            onChange={handleChange}
            placeholder="Enter Your Mobile Number"
            required
            className="border-b-2 p-2 w-full mt-2 focus:outline-none focus:border-b-2"
          />
        </div>
        <div className="p-10">
          <label className="block text-3xl font-bold mt-10 text-left ml-2">
            Email:
          </label>
          <input
            type="text"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter Your Email"
            required
            className="border-b-2 p-2 w-full mt-2 focus:outline-none focus:border-b-2"
          />
        </div>
        <div className="p-10">
          <label className="block text-3xl font-bold mt-10 text-left ml-2">
            Password:
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter Your Password"
            required
            className="border-b-2 p-2 w-full mt-2 focus:outline-none focus:border-b-2"
          />
        </div>
        <div className="p-10">
          <label className="block text-3xl font-bold mt-10 text-left ml-2">
            Role:
          </label>
          <select
            name="role"
            id="role"
            type="text"
            value={formData.role}
            onChange={handleChange}
            required
            className="border-b-2 p-2 w-full mt-2 focus:outline-none focus:border-b-2"
          >
            <option value="">Select Role</option>
            <option value="donor">Donor</option>
            <option value="receiver">Receiver</option>
          </select>
        </div>
        <div className="p-10">
          <label className="block text-3xl font-bold mt-10 text-left ml-2">
            Profile Pic:
          </label>
          <input
            type="file"
            name="profilePic"
            accept="image/*"
            onChange={handleFile} // No need for `value`
          />
        </div>
        <button
          type="submit"
          className="bg-green-800 text-white w-60 h-12 rounded-lg cursor-pointer ml-auto mt-10"
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
  );
}

export default Register;
