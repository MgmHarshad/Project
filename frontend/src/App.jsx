import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from "../components/Dashboard";
// import './App.css'
import Login from "../components/Login";
import ProtectedRoutes from "../services/ProtectedRoutes";
import Register from "../components/Register";
import DonorDashboard from "../components/DonorDashboard";
import DonorNotification from "../components/donor_components/DonorNotification";
import DonorProfile from "../components/donor_components/DonorProfile";
import DonorHistory from "../components/donor_components/DonorHistory";
import DonorFoodRequests from "../components/donor_components/DonorFoodRequests";
import MyAcceptedRequests from "../components/donor_components/MyAcceptedRequests";
import DonorFutureEvents from "../components/donor_components/DonorFutureEvents";

import ReceiverDashboard from "../components/ReceiverDashboard";
import ReceiverNotification from "../components/receiver_components/ReceiverNotification";
import ReceiverProfile from "../components/receiver_components/ReceiverProfile";
import ReceiverHistory from "../components/receiver_components/ReceiverHistory";
import ShowDonations from "../components/receiver_components/ShowDonations";
import MyClaimedDonations from "../components/receiver_components/MyClaimedDonations";
import ReceiverFutureEvents from "../components/receiver_components/ReceiverFutureEvents";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/donor" element={<ProtectedRoutes role="donor"><DonorDashboard /></ProtectedRoutes>} />
        <Route path="/donor/notification" element={<ProtectedRoutes role="donor"><DonorNotification /></ProtectedRoutes>} />
        <Route path="/donor/profile" element={<ProtectedRoutes role="donor"><DonorProfile /></ProtectedRoutes>} />
        <Route path="/donor/history" element={<ProtectedRoutes role="donor"><DonorHistory/></ProtectedRoutes>}/>
        <Route path="/donor/showrequests" element={<ProtectedRoutes role="donor"><DonorFoodRequests/></ProtectedRoutes>}/>
        <Route path="/donor/accepted" element={<ProtectedRoutes role="donor"><MyAcceptedRequests/></ProtectedRoutes>}/>
        <Route path="/donor/events" element={<ProtectedRoutes role="donor"><DonorFutureEvents/></ProtectedRoutes>}/>
        <Route path="/receiver" element={<ProtectedRoutes role="receiver"><ReceiverDashboard /></ProtectedRoutes>} />
        <Route path="/receiver/notification" element={<ProtectedRoutes role="receiver"><ReceiverNotification /></ProtectedRoutes>} />
        <Route path="/receiver/profile" element={<ProtectedRoutes role="receiver"><ReceiverProfile /></ProtectedRoutes>} />
        <Route path="/receiver/history" element={<ProtectedRoutes role="receiver"><ReceiverHistory/></ProtectedRoutes>}/>
        <Route path="/receiver/showdonations" element={<ProtectedRoutes role="receiver"><ShowDonations/></ProtectedRoutes>}/>
        <Route path="/receiver/claimed" element={<ProtectedRoutes role="receiver"><MyClaimedDonations/></ProtectedRoutes>}/>
        <Route path="/receiver/events" element={<ProtectedRoutes role="receiver"><ReceiverFutureEvents/></ProtectedRoutes>}/>
      </Routes>
    </Router>
  );
}

export default App;
