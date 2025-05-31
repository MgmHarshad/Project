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
      <div className="hero bg-gray-200 p-10 text-center text-green-800 h-80">
        <h1 className="text-5xl font-bold">
          Connecting Surplus Food To Those In Need
        </h1>
        <p className="text-3xl mt-10">
          Empowering Communities Through Food Sharing
        </p>
        <button
          className="bg-green-800 text-white w-60 h-12 rounded-lg cursor-pointer ml-auto mt-10"
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
      </div>
      <div className="bg-white">
        <div className="flex flex-col items-center p-10">
          <div className="flex flex-row justify-around w-full mb-20">
            <div className="flex flex-col items-center w-110 shadow-md p-5 rounded-lg cursor-pointer hover:shadow-lg transition-shadow duration-300">
              <Soup size={72} />
              <h3 className="text-2xl font-bold">Easy Food Donation</h3>
              <p>Donors Can Quickly Post Surplus Food In Few Steps</p>
            </div>
            <div className="flex flex-col items-center w-110 shadow-md p-5 rounded-lg cursor-pointer hover:shadow-lg transition-shadow duration-300">
              <Handshake size={72} />
              <h3 className="text-2xl font-bold">Verified NGOs</h3>
              <p>Trusted Receivers Ensure, Food Reaches Those In Need</p>
            </div>
          </div>
          <div className="flex flex-row justify-around w-full mb-20">
            <div className="flex flex-col items-center w-110 shadow-md p-5 rounded-lg cursor-pointer hover:shadow-lg transition-shadow duration-300">
              <Truck size={72} />
              <h3 className="text-2xl font-bold">Real Time Tracking</h3>
              <p>Monitor The Journey From Donation To Delivery</p>
            </div>
            <div className="flex flex-col items-center w-110 shadow-md p-5 rounded-lg cursor-pointer hover:shadow-lg transition-shadow duration-300">
              <FileClock size={72} />
              <h3 className="text-2xl font-bold">Donation History</h3>
              <p>View Your Previous Donations And Feedback</p>
            </div>
          </div>
          <div className="flex flex-row justify-around w-full mb-20">
            <div className="flex flex-col items-center w-110 shadow-md p-5 rounded-lg cursor-pointer hover:shadow-lg transition-shadow duration-300">
              <ShieldUser size={72} />
              <h3 className="text-2xl font-bold">Role-Based Dashboards</h3>
              <p>Tailored Dashboards For Donors, Receivers, And Admin</p>
            </div>
            <div className="flex flex-col items-center w-110 shadow-md p-5 rounded-lg cursor-pointer hover:shadow-lg transition-shadow duration-300">
              <MapPin size={72} />
              <h3 className="text-2xl font-bold">Location Matching</h3>
              <p>Match Donations With Nearby NGOs For Fast PickUp</p>
            </div>
          </div>
          <div className="flex flex-col items-center w-200 shadow-md p-5 rounded-lg cursor-pointer hover:shadow-lg transition-shadow duration-300">
            <h3 className="text-2xl font-bold">Ready To Make A Difference?</h3>
            <p>Join Our Mission To Reduce Food Waste And Feed The Hungry</p>
            <div className="flex gap-5">
              <button
                className="bg-green-800 text-white w-60 h-12 rounded-lg cursor-pointer mt-10"
                // onClick={() => (window.location.href = "/login")}
                onMouseEnter={(e) => {
                  e.target.style.scale = "1.05";
                }}
                onMouseLeave={(e) => {
                  e.target.style.scale = "1";
                }}
              >
                Register As A Donor
              </button>
              <button
                className="bg-green-800 text-white w-60 h-12 rounded-lg cursor-pointer mt-10"
                // onClick={() => (window.location.href = "/login")}
                onMouseEnter={(e) => {
                  e.target.style.scale = "1.05";
                }}
                onMouseLeave={(e) => {
                  e.target.style.scale = "1";
                }}
              >
                Register As An NGO
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashContent;
