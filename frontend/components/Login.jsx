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
      console.log(response);
      const user = response.data.user;
      const token = response.data.token;
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
      if (user.role === "donor") {
        navigate("/donor");
      } else if (user.role === "receiver") {
        navigate("/receiver");
      } else {
        navigate("/");
      }
      console.log("Login response:", response.data); // Debug log
      setFormData({ email: "", password: "" });
      // window.location.href = "/donor";
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      alert("Login failed: " + (err.response?.data?.error || err.message));
    }
  };
  return (
    <div className="font-serif text-green-800 mb-10 min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mt-4 sm:mt-6 lg:mt-10 p-4 sm:p-5 bg-green-800/80 text-white rounded-t-lg">
          <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold">Login</h1>
        </div>
        <form
          onSubmit={handleSubmit}
          className="text-center font-serif shadow-md p-4 sm:p-5 lg:p-6 border-2 hover:shadow-lg transition-shadow duration-300 text-green-800 rounded-b-lg"
        >
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
              className="border-b-2 p-2 w-full mt-2 focus:outline-none focus:border-b-2 text-sm sm:text-base"
              required
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
              className="border-b-2 p-2 w-full mt-2 focus:outline-none focus:border-b-2 text-sm sm:text-base"
              required
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

export default Login;
