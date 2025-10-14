import Donations from "../models/donation.models.js";
import Requests from "../models/requests.models.js";
import mongoose from "mongoose";

// Get donor statistics
const getDonorStats = async (req, res) => {
  try {
    console.log("=== GET DONOR STATS ===");
    const donorId = req.user?.id;
    
    if (!donorId) {
      return res.status(400).json({ message: "Donor not found in token" });
    }

    // Get all donations by this donor
    const allDonations = await Donations.find({ donor: donorId });
    
    // Calculate statistics
    const totalDonations = allDonations.length;
    
    const pendingDonations = allDonations.filter(d => d.status === "available").length;
    
    const matchedDonations = allDonations.filter(d => 
      d.status === "matched" || d.status === "delivered"
    ).length;
    
    // Calculate total food saved (sum of quantities for delivered donations)
    const deliveredDonations = allDonations.filter(d => d.status === "delivered");
    const totalFoodSaved = deliveredDonations.reduce((total, donation) => {
      // Convert all units to a common unit (kg) for calculation
      let quantityInKg = donation.quantity;
      
      // Simple conversion - you might want to make this more sophisticated
      switch (donation.unit) {
        case "Litres":
          quantityInKg = donation.quantity * 1; // Assume 1L ≈ 1kg for food
          break;
        case "Pieces":
          quantityInKg = donation.quantity * 0.1; // Assume 1 piece ≈ 0.1kg
          break;
        case "Packets":
          quantityInKg = donation.quantity * 0.5; // Assume 1 packet ≈ 0.5kg
          break;
        default: // "Kg"
          quantityInKg = donation.quantity;
      }
      
      return total + quantityInKg;
    }, 0);

    const stats = {
      totalDonations,
      pendingDonations,
      matchedDonations,
      totalFoodSaved: Math.round(totalFoodSaved * 100) / 100 // Round to 2 decimal places
    };

    console.log(`Donor ${donorId} stats:`, stats);
    res.json(stats);
  } catch (error) {
    console.error("Error getting donor stats:", error);
    res.status(500).json({ message: "Failed to get donor statistics" });
  }
};

// Get receiver statistics
const getReceiverStats = async (req, res) => {
  try {
    console.log("=== GET RECEIVER STATS ===");
    const receiverId = req.user?.id;
    
    if (!receiverId) {
      return res.status(400).json({ message: "Receiver not found in token" });
    }

    // Get all requests by this receiver
    const allRequests = await Requests.find({ receiver: receiverId });
    
    // Get all donations claimed by this receiver
    const claimedDonations = await Donations.find({ receiver: receiverId });
    
    // Calculate statistics
    const totalRequests = allRequests.length;
    
    const pendingRequests = allRequests.filter(r => r.status === "Pending").length;
    
    const matchedRequests = allRequests.filter(r => 
      r.status === "Matched" || r.status === "Delivered"
    ).length;
    
    // Calculate total food received (sum of quantities for delivered donations)
    const deliveredDonations = claimedDonations.filter(d => d.status === "delivered");
    const totalFoodReceived = deliveredDonations.reduce((total, donation) => {
      // Convert all units to a common unit (kg) for calculation
      let quantityInKg = donation.quantity;
      
      // Simple conversion - you might want to make this more sophisticated
      switch (donation.unit) {
        case "Litres":
          quantityInKg = donation.quantity * 1; // Assume 1L ≈ 1kg for food
          break;
        case "Pieces":
          quantityInKg = donation.quantity * 0.1; // Assume 1 piece ≈ 0.1kg
          break;
        case "Packets":
          quantityInKg = donation.quantity * 0.5; // Assume 1 packet ≈ 0.5kg
          break;
        default: // "Kg"
          quantityInKg = donation.quantity;
      }
      
      return total + quantityInKg;
    }, 0);

    const stats = {
      totalRequests,
      pendingRequests,
      matchedRequests,
      totalFoodReceived: Math.round(totalFoodReceived * 100) / 100 // Round to 2 decimal places
    };

    console.log(`Receiver ${receiverId} stats:`, stats);
    res.json(stats);
  } catch (error) {
    console.error("Error getting receiver stats:", error);
    res.status(500).json({ message: "Failed to get receiver statistics" });
  }
};

export { getDonorStats, getReceiverStats };
