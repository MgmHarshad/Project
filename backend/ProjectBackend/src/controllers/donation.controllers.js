import express from "express";
import Donations from "../models/donation.models.js";
import axios from 'axios';
const createDonation = async (req, res) => {
  try {
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
    const donation = await Donations.find().populate("donor", "fullname");

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
    const donation = await Donations.find({ donor: donorId }).populate(
      "donor",
      "fullname"
    );

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

export { createDonation, getDonation, getMyDonations };
