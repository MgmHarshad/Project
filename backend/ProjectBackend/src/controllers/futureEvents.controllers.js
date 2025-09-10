import express from "express";
import futureEvents from "../models/futureEvents.models.js";
import moment from "moment";

const createEvents = async (req, res) => {
  try {
    // `req.user` should already be populated by your authMiddleware
    const organizerId = req.user?.id;
    if (!organizerId) {
      return res.status(400).json({ message: "Organizer not found in token" });
    }

    // Extract fields from body
    const { eventName, date, location, status } = req.body;

    // Validate required fields manually (extra safety)
    if (!eventName || !date || !location) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Create donation document
    const event = new futureEvents({
      organizer: organizerId,
      eventName,
      date,
      location,
      status,
    });

    await event.save();

    res.status(201).json({
      message: "Event created successfully",
      event,
    });
  } catch (error) {
    console.error("Event creation error:", error);
    res
      .status(500)
      .json({ message: "Failed to create donation", error: error.message });
  }
};

const getEvents = async (req, res) => {
  try {
    const events = await futureEvents.find().populate("organizer", "fullname");
    const formattedEvents = events.map((event) => ({
      ...event._doc,
      date: moment(event.date).format("MMMM Do YYYY, h:mm A"),
      // Example: September 12th 2025, 6:00 PM
    }));

    res.json(formattedEvents);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "No events found" });
  }
};

const myEvents = async (req, res) => {
  try {
    const organizerId = req.user?.id;
    const events = await futureEvents
      .find({ organizer: organizerId })
      .populate("organizer", "fullname");
    const formattedEvents = events.map((event) => ({
      ...event._doc,
      date: moment(event.date).format("MMMM Do YYYY, h:mm A"),
      // Example: September 12th 2025, 6:00 PM
    }));

    res.json(formattedEvents);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "No events found" });
  }
};

export { createEvents, getEvents, myEvents };
