import express from "express";
import Donations from "../models/donation.models.js";

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

    // Validate required fields manually (extra safety)
    if (!foodName || !quantity || !unit || !location || !expiryDuration) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Create donation document
    const donation = new Donations({
      donor: donorId,
      foodName,
      quantity,
      unit,
      location,
      expiryDuration,
      status,
      receiver,
    });

    await donation.save();

    res.status(201).json({
      message: "Donation created successfully",
      donation,
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
