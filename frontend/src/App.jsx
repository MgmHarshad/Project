import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from "../components/Dashboard";
// import './App.css'
import Login from "../components/Login";
import Register from "../components/Register";
import DonorDashboard from "../components/DonorDashboard";
import DonorNotification from "../components/donor_components/DonorNotification";
import DonorProfile from "../components/donor_components/DonorProfile";
import DonorHistory from "../components/donor_components/DonorHistory";
import DonorFoodRequests from "../components/donor_components/DonorFoodRequests";
import DonorFutureEvents from "../components/donor_components/DonorFutureEvents";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/donor" element={<DonorDashboard />} />
        <Route path="/donor/notification" element={<DonorNotification />} />
        <Route path="/donor/profile" element={<DonorProfile />} />
        <Route path="/donor/history" element={<DonorHistory/>}/>
        <Route path="/donor/requests" element={<DonorFoodRequests/>}/>
        <Route path="/donor/events" element={<DonorFutureEvents/>}/>
      </Routes>
    </Router>
  );
}

export default App;
