import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/services";

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser(formData);
      const user = response.data.user;
      localStorage.setItem("user", JSON.stringify(user));
      if (user.role === "donor") {
        navigate("/donor");
      } else if (user.role === "receiver") {
        navigate("/receiver");
      } else {
        navigate("/");
      }
      console.log("Login response:", response.data); // Debug log
      alert("Login successful!");
      setFormData({ email: "", password: "" });
      // window.location.href = "/donor";
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      alert("Login failed: " + (err.response?.data?.error || err.message));
    }
  };
  return (
    <div className="font-serif  text-green-800 mb-10">
      <div className="text-center mt-10 p-5 bg-green-800/80 text-white w-300 m-auto rounded-t-lg">
        <h1 className="text-6xl font-bold">Login</h1>
      </div>
      <form
        onSubmit={handleSubmit}
        className="text-center w-300 m-auto font-serif shadow-md p-5 border-2 hover:shadow-lg transition-shadow duration-300 text-green-800 rounded-b-lg"
      >
        <div className="p-5">
          <label className="block text-3xl font-bold mt-10 text-left ml-2">
            Email:
          </label>
          <input
            type="text"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter Your Email"
            className="border-b-2 p-2 w-full mt-2 focus:outline-none focus:border-b-2"
          />
        </div>
        <div className="p-5">
          <label className="block text-3xl font-bold mt-10 text-left ml-2">
            Password:
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter Your Password"
            className="border-b-2 p-2 w-full mt-2 focus:outline-none focus:border-b-2"
          />
        </div>
        <button
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

export default Login;
