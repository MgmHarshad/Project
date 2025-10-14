import React, { Link } from "react";
import Logo from "../src/Assets/Logo1.png";
import DashContent from "./DashContent";
import Footer from "./Footer";
import "tailwindcss";
import { Soup } from "lucide-react";
function Dashboard() {
  return (
    <div className="bg-green-50 px-2 sm:px-4 pb-4 pt-1 rounded-lg font-serif text-green-800 min-h-screen">
      <nav className="bg-green-300 flex flex-col sm:flex-row items-center justify-between h-auto sm:h-30 p-2 sm:p-4 gap-2 sm:gap-0">
        <img
          className="cursor-pointer h-16 w-16 sm:h-25 sm:w-25 rounded-full"
          src={Logo}
          alt="Feed Connect Logo"
          onMouseEnter={(e) => {
            e.target.style.scale = "1.05";
          }}
          onMouseLeave={(e) => {
            e.target.style.scale = "1";
          }}
        />
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
          <button
            className="bg-green-800 text-white w-full sm:w-40 lg:w-40 h-10 sm:h-15 rounded-lg cursor-pointer text-sm sm:text-base"
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
            className="bg-white text-green-800 w-full sm:w-40 lg:w-40 h-10 sm:h-15 rounded-lg cursor-pointer text-sm sm:text-base"
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
        </div>
      </nav>
      <div className="rounded-lg overflow-hidden shadow-lg mt-4">
        <DashContent />
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
}

export default Dashboard;
