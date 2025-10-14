import React from "react";
import {
  Soup,
  Handshake,
  Truck,
  FileClock,
  ShieldUser,
  MapPin,
} from "lucide-react";
function DashContent() {
  return (
    <div>
      <div className="hero bg-gray-200 p-4 sm:p-6 lg:p-10 text-center text-green-800 min-h-80">
        <h1 className="text-2xl sm:text-3xl lg:text-5xl font-bold px-4">
          Connecting Surplus Food To Those In Need
        </h1>
        <p className="text-lg sm:text-xl lg:text-3xl mt-4 sm:mt-6 lg:mt-10 px-4">
          Empowering Communities Through Food Sharing
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-6 sm:mt-8 lg:mt-10">
          <button
            className="bg-green-800 text-white w-full sm:w-40 lg:w-60 h-10 sm:h-12 rounded-lg cursor-pointer text-sm sm:text-base"
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
            className="bg-white text-green-800 w-full sm:w-40 lg:w-60 h-10 sm:h-12 rounded-lg cursor-pointer text-sm sm:text-base"
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
      </div>
      <div className="bg-white">
        <div className="flex flex-col items-center p-4 sm:p-6 lg:p-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 w-full max-w-6xl mb-8 sm:mb-12 lg:mb-20">
            <div className="flex flex-col items-center shadow-md p-4 sm:p-5 rounded-lg cursor-pointer hover:shadow-lg transition-shadow duration-300">
              <Soup size={48} className="sm:w-16 sm:h-16 lg:w-18 lg:h-18" />
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-center mt-2">Easy Food Donation</h3>
              <p className="text-sm sm:text-base text-center mt-2">Donors Can Quickly Post Surplus Food In Few Steps</p>
            </div>
            <div className="flex flex-col items-center shadow-md p-4 sm:p-5 rounded-lg cursor-pointer hover:shadow-lg transition-shadow duration-300">
              <Handshake size={48} className="sm:w-16 sm:h-16 lg:w-18 lg:h-18" />
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-center mt-2">Verified NGOs</h3>
              <p className="text-sm sm:text-base text-center mt-2">Trusted Receivers Ensure, Food Reaches Those In Need</p>
            </div>
            <div className="flex flex-col items-center shadow-md p-4 sm:p-5 rounded-lg cursor-pointer hover:shadow-lg transition-shadow duration-300">
              <Truck size={48} className="sm:w-16 sm:h-16 lg:w-18 lg:h-18" />
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-center mt-2">Real Time Tracking</h3>
              <p className="text-sm sm:text-base text-center mt-2">Monitor The Journey From Donation To Delivery</p>
            </div>
            <div className="flex flex-col items-center shadow-md p-4 sm:p-5 rounded-lg cursor-pointer hover:shadow-lg transition-shadow duration-300">
              <FileClock size={48} className="sm:w-16 sm:h-16 lg:w-18 lg:h-18" />
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-center mt-2">Donation History</h3>
              <p className="text-sm sm:text-base text-center mt-2">View Your Previous Donations And Feedback</p>
            </div>
            <div className="flex flex-col items-center shadow-md p-4 sm:p-5 rounded-lg cursor-pointer hover:shadow-lg transition-shadow duration-300">
              <ShieldUser size={48} className="sm:w-16 sm:h-16 lg:w-18 lg:h-18" />
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-center mt-2">Role-Based Dashboards</h3>
              <p className="text-sm sm:text-base text-center mt-2">Tailored Dashboards For Donors, Receivers, And Admin</p>
            </div>
            <div className="flex flex-col items-center shadow-md p-4 sm:p-5 rounded-lg cursor-pointer hover:shadow-lg transition-shadow duration-300">
              <MapPin size={48} className="sm:w-16 sm:h-16 lg:w-18 lg:h-18" />
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-center mt-2">Location Matching</h3>
              <p className="text-sm sm:text-base text-center mt-2">Match Donations With Nearby NGOs For Fast PickUp</p>
            </div>
          </div>
          <div className="flex flex-col items-center w-full max-w-2xl shadow-md p-4 sm:p-5 rounded-lg cursor-pointer hover:shadow-lg transition-shadow duration-300">
            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-center">Ready To Make A Difference?</h3>
            <p className="text-sm sm:text-base text-center mt-2">Join Our Mission To Reduce Food Waste And Feed The Hungry</p>
            <div className="flex justify-center mt-4 sm:mt-6 lg:mt-10">
              <button
                className="bg-green-800 text-white w-full sm:w-40 lg:w-60 h-10 sm:h-12 rounded-lg cursor-pointer text-sm sm:text-base"
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
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashContent;
