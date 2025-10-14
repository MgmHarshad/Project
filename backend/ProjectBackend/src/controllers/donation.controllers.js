import express from "express";
import Donations from "../models/donation.models.js";
import axios from 'axios';
import Users from "../models/users.models.js";
import Notifications from "../models/notification.models.js";
import mongoose from "mongoose";
const createDonation = async (req, res) => {
  try {
    console.log("=== CREATE DONATION ENDPOINT CALLED ===");
    // `req.user` should already be populated by your authMiddleware
    const donorId = req.user?.id;
    if (!donorId) {
      return res.status(400).json({ message: "Donor not found in token" });
    }

    // Extract fields from body
    const {
      foodName,
      quantity,
      unit,
      location,
      expiryDuration,
      status,
      receiver,
    } = req.body;

    // ML enrichment from middleware (optional but preferred)
    const ml = req.mlPrediction || {};

    // Determine expiryDuration: prefer ML remaining time; fallback to provided value
    let computedExpiryDuration =
      typeof ml.remaining_fresh_hours === 'number' && Number.isFinite(ml.remaining_fresh_hours)
        ? Math.max(0, ml.remaining_fresh_hours)
        : expiryDuration;

    // Validate required fields (allow expiryDuration to be set by ML)
    if (!foodName || !quantity || !unit || !location || (computedExpiryDuration === undefined || computedExpiryDuration === null)) {
      return res.status(400).json({ message: "Missing required fields (expiryDuration can be auto-filled by ML if available)" });
    }

    // Create donation document
    const donation = new Donations({
      donor: donorId,
      foodName,
      quantity,
      unit,
      location,
      expiryDuration: computedExpiryDuration,
      status,
      receiver,
      spoilageRisk: ml.spoilage_risk,
      remainingFreshHours: ml.remaining_fresh_hours,
    });

    await donation.save();

    // Notify all receivers when a donor creates a donation
    console.log(`Creating notifications for donation ${donation._id}`);
    const receivers = await Users.find({ role: "receiver" }).select("_id");
    console.log(`Found ${receivers.length} receivers to notify`);
    
    const receiverNotifs = receivers.map((r) => ({
      recipient: r._id,
      actor: donorId,
      type: "donation_created",
      title: "New Donation Available",
      message: `${quantity} ${unit} of ${foodName} available at ${location}.`,
      relatedModel: "Donations",
      relatedId: donation._id,
    }));
    
    if (receiverNotifs.length) {
      console.log(`Inserting ${receiverNotifs.length} notifications for donation ${donation._id}`);
      try {
        const insertedNotifs = await Notifications.insertMany(receiverNotifs, { ordered: false });
        console.log(`Successfully inserted ${insertedNotifs.length} notifications`);
      } catch (error) {
        if (error.code === 11000) {
          console.log(`Some notifications already exist for donation ${donation._id}, skipping duplicates`);
        } else {
          console.error(`Error inserting notifications for donation ${donation._id}:`, error);
        }
      }
    }

    res.status(201).json({
      message: "Donation created successfully",
      donation,
      mlPrediction: ml,
    });
  } catch (error) {
    console.error("Donation creation error:", error);
    res
      .status(500)
      .json({ message: "Failed to create donation", error: error.message });
  }
};

const getDonation = async (req, res) => {
  try {
    const donation = await Donations.find()
      .populate("donor", "fullname")
      .populate("receiver", "fullname");

    const formattedDonations = donation.map((donation) => ({
      ...donation.toObject(),
      expiryTime: new Date(donation.expiryTime).toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata", // Convert to IST
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
    }));
    res.json(formattedDonations);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "failed to get donations" });
  }
};

const getMyDonations = async (req, res) => {
  try {
    const donorId = req.user?.id;
    const donation = await Donations.find({ donor: donorId })
      .populate("donor", "fullname")
      .populate("receiver", "fullname");

    const formattedDonations = donation.map((donation) => ({
      ...donation.toObject(),
      expiryTime: new Date(donation.expiryTime).toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata", // Convert to IST
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
    }));
    res.json(formattedDonations);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "failed to get donations" });
  }
};

// Get available donations (for receivers - excludes expired and matched)
const getAvailableDonations = async (req, res) => {
  try {
    console.log("=== GET AVAILABLE DONATIONS ===");
    
    // First, update any expired donations
    await updateExpiredDonations();
    
    const donations = await Donations.find({ 
      status: "available",
      expiryTime: { $gt: new Date() } // Only non-expired donations
    })
    .populate("donor", "fullname")
    .sort({ createdAt: -1 });

    const formattedDonations = donations.map((donation) => ({
      ...donation.toObject(),
      expiryTime: new Date(donation.expiryTime).toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
    }));
    
    console.log(`Found ${formattedDonations.length} available donations`);
    res.json(formattedDonations);
  } catch (error) {
    console.error("Error getting available donations:", error);
    res.status(500).json({ message: "Failed to get available donations" });
  }
};

// Claim a donation (receiver claims it)
const claimDonation = async (req, res) => {
  try {
    console.log("=== CLAIM DONATION ===");
    const receiverId = req.user?.id;
    const { id } = req.params;
    
    console.log(`Receiver ${receiverId} claiming donation ${id}`);
    
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid donation ID" });
    }
    
    if (!mongoose.Types.ObjectId.isValid(receiverId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    // Check if donation exists and is available
    const donation = await Donations.findOne({ 
      _id: id, 
      status: "available",
      expiryTime: { $gt: new Date() } // Not expired
    });
    
    if (!donation) {
      console.log(`Donation ${id} not found or not available`);
      return res.status(404).json({ 
        message: "Donation not found or no longer available" 
      });
    }
    
    // Update donation status and assign to receiver
    const updatedDonation = await Donations.findByIdAndUpdate(
      id,
      { 
        status: "matched",
        receiver: receiverId
      },
      { new: true }
    ).populate("donor", "fullname").populate("receiver", "fullname");
    
    console.log(`Successfully claimed donation ${id} by receiver ${receiverId}`);
    
    // Notify the donor that their donation was claimed
    const donorNotification = new Notifications({
      recipient: donation.donor,
      actor: receiverId,
      type: "donation_claimed",
      title: "Donation Claimed",
      message: `Your donation of ${donation.quantity} ${donation.unit} ${donation.foodName} has been claimed.`,
      relatedModel: "Donations",
      relatedId: donation._id,
    });
    
    await donorNotification.save();
    console.log(`Notification sent to donor ${donation.donor}`);
    
    res.json({
      message: "Donation claimed successfully",
      donation: updatedDonation
    });
  } catch (error) {
    console.error("Error claiming donation:", error);
    res.status(500).json({ message: "Failed to claim donation" });
  }
};

// Mark donation as delivered
const deliverDonation = async (req, res) => {
  try {
    console.log("=== DELIVER DONATION ===");
    const userId = req.user?.id;
    const { id } = req.params;
    
    console.log(`User ${userId} marking donation ${id} as delivered`);
    
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid donation ID" });
    }
    
    // Check if donation exists and is matched
    const donation = await Donations.findOne({ 
      _id: id, 
      status: "matched",
      $or: [
        { donor: userId }, // Donor can mark as delivered
        { receiver: userId } // Receiver can mark as delivered
      ]
    });
    
    if (!donation) {
      console.log(`Donation ${id} not found or not matched`);
      return res.status(404).json({ 
        message: "Donation not found or not matched" 
      });
    }
    
    // Update donation status to delivered
    const updatedDonation = await Donations.findByIdAndUpdate(
      id,
      { status: "delivered" },
      { new: true }
    ).populate("donor", "fullname").populate("receiver", "fullname");
    
    console.log(`Successfully marked donation ${id} as delivered`);
    
    // Notify both donor and receiver
    const notifications = [
      {
        recipient: donation.donor,
        actor: userId,
        type: "donation_delivered",
        title: "Donation Delivered",
        message: `Your donation of ${donation.quantity} ${donation.unit} ${donation.foodName} has been delivered.`,
        relatedModel: "Donations",
        relatedId: donation._id,
      },
      {
        recipient: donation.receiver,
        actor: userId,
        type: "donation_delivered",
        title: "Donation Delivered",
        message: `The donation of ${donation.quantity} ${donation.unit} ${donation.foodName} has been delivered.`,
        relatedModel: "Donations",
        relatedId: donation._id,
      }
    ];
    
    await Notifications.insertMany(notifications);
    console.log(`Notifications sent for delivered donation ${id}`);
    
    res.json({
      message: "Donation marked as delivered successfully",
      donation: updatedDonation
    });
  } catch (error) {
    console.error("Error delivering donation:", error);
    res.status(500).json({ message: "Failed to mark donation as delivered" });
  }
};

// Get receiver's claimed donations
const getMyClaimedDonations = async (req, res) => {
  try {
    console.log("=== GET MY CLAIMED DONATIONS ===");
    const receiverId = req.user?.id;
    
    const donations = await Donations.find({ 
      receiver: receiverId,
      status: { $in: ["matched", "delivered"] }
    })
    .populate("donor", "fullname")
    .sort({ updatedAt: -1 });

    const formattedDonations = donations.map((donation) => ({
      ...donation.toObject(),
      expiryTime: new Date(donation.expiryTime).toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
    }));
    
    console.log(`Found ${formattedDonations.length} claimed donations for receiver ${receiverId}`);
    res.json(formattedDonations);
  } catch (error) {
    console.error("Error getting claimed donations:", error);
    res.status(500).json({ message: "Failed to get claimed donations" });
  }
};

// Helper function to update expired donations
const updateExpiredDonations = async () => {
  try {
    const result = await Donations.updateMany(
      { 
        status: "available",
        expiryTime: { $lt: new Date() }
      },
      { status: "expired" }
    );
    
    if (result.modifiedCount > 0) {
      console.log(`Updated ${result.modifiedCount} donations to expired status`);
    }
  } catch (error) {
    console.error("Error updating expired donations:", error);
  }
};

export { 
  createDonation, 
  getDonation, 
  getMyDonations, 
  getAvailableDonations,
  claimDonation,
  deliverDonation,
  getMyClaimedDonations,
  updateExpiredDonations
};
