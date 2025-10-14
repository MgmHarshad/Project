import express from "express";
import futureEvents from "../models/futureEvents.models.js";
import Users from "../models/users.models.js";
import Notifications from "../models/notification.models.js";
import moment from "moment";

const createEvents = async (req, res) => {
  try {
    console.log("=== CREATE EVENT ENDPOINT CALLED ===");
    // `req.user` should already be populated by your authMiddleware
    const organizerId = req.user?.id;
    if (!organizerId) {
      return res.status(400).json({ message: "Organizer not found in token" });
    }

    // Extract fields from body
    const { eventName, date, location } = req.body;

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
    });

    await event.save();

    // Notify all receivers when a donor registers a future event
    console.log(`Creating notifications for event ${event._id}`);
    const receivers = await Users.find({ role: "receiver" }).select("_id");
    console.log(`Found ${receivers.length} receivers to notify`);
    
    const receiverNotifs = receivers.map((r) => ({
      recipient: r._id,
      actor: organizerId,
      type: "event_created",
      title: "Upcoming Food Event",
      message: `${eventName} at ${location} on ${moment(date).format("MMMM Do YYYY, h:mm A")}.`,
      relatedModel: "futureEvents",
      relatedId: event._id,
    }));
    
    if (receiverNotifs.length) {
      console.log(`Inserting ${receiverNotifs.length} notifications for event ${event._id}`);
      try {
        const insertedNotifs = await Notifications.insertMany(receiverNotifs, { ordered: false });
        console.log(`Successfully inserted ${insertedNotifs.length} notifications`);
      } catch (error) {
        if (error.code === 11000) {
          console.log(`Some notifications already exist for event ${event._id}, skipping duplicates`);
        } else {
          console.error(`Error inserting notifications for event ${event._id}:`, error);
        }
      }
    }

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
    // Only upcoming events for receivers (public list)
    const events = await futureEvents
      .find({ date: { $gte: new Date() } })
      .sort({ date: 1 })
      .populate("organizer", "fullname");
    const formattedEvents = events.map((event) => ({
      ...event._doc,
      date: moment(event.date).format("MMMM Do YYYY"),
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
    // Donor (organizer) sees all of their events, past and future
    const events = await futureEvents
      .find({ organizer: organizerId })
      .sort({ date: -1 })
      .populate("organizer", "fullname");
    const formattedEvents = events.map((event) => ({
      ...event._doc,
      date: moment(event.date).format("MMMM Do YYYY"),
      // Example: September 12th 2025, 6:00 PM
    }));

    res.json(formattedEvents);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "No events found" });
  }
};

export { createEvents, getEvents, myEvents };
