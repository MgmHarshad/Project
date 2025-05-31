import React, { Link } from "react";
import Logo from "../src/Assets/Logo1.png";
import DashContent from "./DashContent";
import "tailwindcss";
import { Soup } from "lucide-react";
function Dashboard() {
  return (
    <div className="bg-green-50 pl-4 pr-4 pb-4 pt-1 rounded-lg font-serif  text-green-800">
      <nav className="bg-green-300 flex h-50 p-2">
        <img
          className="ml-10 cursor-pointer h-46 w-46 rounded-full"
          src={Logo}
          alt=""
          onMouseEnter={(e) => {
            e.target.style.scale = "1.05";
          }}
          onMouseLeave={(e) => {
            e.target.style.scale = "1";
          }}
        />
        <button
          className="bg-green-800 text-white w-60 h-12 rounded-lg cursor-pointer ml-auto"
          onClick={() => (window.location.href = "/login")}
          onMouseEnter={(e) => {
            e.target.style.scale = "1.05";
          }}
          onMouseLeave={(e) => {
            e.target.style.scale = "1";
          }}
        >
          Login
        </button>
        <button
          className="bg-white text-green-800 w-60 h-12 rounded-lg cursor-pointer ml-10"
          onClick={() => (window.location.href = "/register")}
          onMouseEnter={(e) => {
            e.target.style.scale = "1.05";
          }}
          onMouseLeave={(e) => {
            e.target.style.scale = "1";
          }}
        >
          Register
        </button>
      </nav>
      <div className="rounded-lg overflow-hidden shadow-lg mt-4">
        <DashContent />
      </div>
    </div>
  );
}

export default Dashboard;
