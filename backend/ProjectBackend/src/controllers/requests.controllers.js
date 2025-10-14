import Requests from "../models/requests.models.js";
import Users from "../models/users.models.js";
import Notifications from "../models/notification.models.js";
import mongoose from "mongoose";

const createRequest = async (req, res) => {
  try {
    console.log("=== CREATE REQUEST ENDPOINT CALLED ===");
    // `req.user` should already be populated by your authMiddleware
    const receiverId = req.user?.id;
    if (!receiverId) {
      return res.status(400).json({ message: "Receiver not found in token" });
    }

    // Extract fields from body
    const { peopleCount, preferredTime, location, status, donor } = req.body;

    // Validate required fields manually (extra safety)
    if (!peopleCount || !preferredTime || !location) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Create donation document
    const request = new Requests({
      receiver: receiverId,
      peopleCount,
      preferredTime,
      location,
      status,
      donor,
    });

    await request.save();

    // Notify all donors when a receiver creates a request
    console.log(`Creating notifications for request ${request._id}`);
    const donors = await Users.find({ role: "donor" }).select("_id");
    console.log(`Found ${donors.length} donors to notify`);
    
    const donorNotifs = donors.map((d) => ({
      recipient: d._id,
      actor: receiverId,
      type: "request_created",
      title: "New Food Request",
      message: `A receiver requested food for ${peopleCount} people at ${location}.`,
      relatedModel: "Requests",
      relatedId: request._id,
    }));
    
    if (donorNotifs.length) {
      console.log(`Inserting ${donorNotifs.length} notifications for request ${request._id}`);
      try {
        const insertedNotifs = await Notifications.insertMany(donorNotifs, { ordered: false });
        console.log(`Successfully inserted ${insertedNotifs.length} notifications`);
      } catch (error) {
        if (error.code === 11000) {
          console.log(`Some notifications already exist for request ${request._id}, skipping duplicates`);
        } else {
          console.error(`Error inserting notifications for request ${request._id}:`, error);
        }
      }
    }

    res.status(201).json({
      message: "Request created successfully",
      request,
    });
  } catch (error) {
    console.error("Request creation error:", error);
    res
      .status(500)
      .json({ message: "Failed to create request", error: error.message });
  }
};

const getRequests = async (req, res) => {
  try {
    const requests = await Requests.find()
      .populate("receiver", "fullname")
      .populate("donor", "fullname");

    const formattedRequests = requests.map((request) => ({
      ...request.toObject(),
      preferredTime: new Date(request.preferredTime).toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata", // Convert to IST
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
    }));
    res.json(formattedRequests);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "failed to get requests" });
  }
};

const getMyRequests = async (req, res) => {
  try {
    const receiverId = req.user?.id;
    const requests = await Requests.find({ receiver: receiverId })
      .populate("receiver", "fullname")
      .populate("donor", "fullname");

    const formattedRequests = requests.map((request) => ({
      ...request.toObject(),
      preferredTime: new Date(request.preferredTime).toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata", // Convert to IST
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
    }));
    res.json(formattedRequests);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "failed to get my requests" });
  }
};

// Get available requests (for donors - excludes declined and matched)
const getAvailableRequests = async (req, res) => {
  try {
    console.log("=== GET AVAILABLE REQUESTS ===");
    
    // First, update any declined requests
    await updateDeclinedRequests();
    
    const requests = await Requests.find({ 
      status: "Pending",
      preferredTime: { $gt: new Date() } // Only non-expired requests
    })
    .populate("receiver", "fullname")
    .populate("donor", "fullname")
    .sort({ createdAt: -1 });

    const formattedRequests = requests.map((request) => ({
      ...request.toObject(),
      preferredTime: new Date(request.preferredTime).toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
    }));
    
    console.log(`Found ${formattedRequests.length} available requests`);
    res.json(formattedRequests);
  } catch (error) {
    console.error("Error getting available requests:", error);
    res.status(500).json({ message: "Failed to get available requests" });
  }
};

// Accept a request (donor accepts it)
const acceptRequest = async (req, res) => {
  try {
    console.log("=== ACCEPT REQUEST ===");
    const donorId = req.user?.id;
    const { id } = req.params;
    
    console.log(`Donor ${donorId} accepting request ${id}`);
    
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid request ID" });
    }
    
    if (!mongoose.Types.ObjectId.isValid(donorId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    // Check if request exists and is pending
    const request = await Requests.findOne({ 
      _id: id, 
      status: "Pending",
      preferredTime: { $gt: new Date() } // Not expired
    });
    
    if (!request) {
      console.log(`Request ${id} not found or not pending`);
      return res.status(404).json({ 
        message: "Request not found or no longer pending" 
      });
    }
    
    // Update request status and assign to donor
    const updatedRequest = await Requests.findByIdAndUpdate(
      id,
      { 
        status: "Matched",
        donor: donorId
      },
      { new: true }
    ).populate("receiver", "fullname").populate("donor", "fullname");
    
    console.log(`Successfully accepted request ${id} by donor ${donorId}`);
    
    // Notify the receiver that their request was accepted
    const receiverNotification = new Notifications({
      recipient: request.receiver,
      actor: donorId,
      type: "request_accepted",
      title: "Request Accepted",
      message: `Your request for ${request.peopleCount} people at ${request.location} has been accepted.`,
      relatedModel: "Requests",
      relatedId: request._id,
    });
    
    await receiverNotification.save();
    console.log(`Notification sent to receiver ${request.receiver}`);
    
    res.json({
      message: "Request accepted successfully",
      request: updatedRequest
    });
  } catch (error) {
    console.error("Error accepting request:", error);
    res.status(500).json({ message: "Failed to accept request" });
  }
};

// Mark request as delivered
const deliverRequest = async (req, res) => {
  try {
    console.log("=== DELIVER REQUEST ===");
    const userId = req.user?.id;
    const { id } = req.params;
    
    console.log(`User ${userId} marking request ${id} as delivered`);
    
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid request ID" });
    }
    
    // Check if request exists and is matched
    const request = await Requests.findOne({ 
      _id: id, 
      status: "Matched",
      $or: [
        { donor: userId }, // Donor can mark as delivered
        { receiver: userId } // Receiver can mark as delivered
      ]
    });
    
    if (!request) {
      console.log(`Request ${id} not found or not matched`);
      return res.status(404).json({ 
        message: "Request not found or not matched" 
      });
    }
    
    // Update request status to delivered
    const updatedRequest = await Requests.findByIdAndUpdate(
      id,
      { status: "Delivered" },
      { new: true }
    ).populate("receiver", "fullname").populate("donor", "fullname");
    
    console.log(`Successfully marked request ${id} as delivered`);
    
    // Notify both donor and receiver
    const notifications = [
      {
        recipient: request.donor,
        actor: userId,
        type: "request_delivered",
        title: "Request Delivered",
        message: `Your accepted request for ${request.peopleCount} people has been delivered.`,
        relatedModel: "Requests",
        relatedId: request._id,
      },
      {
        recipient: request.receiver,
        actor: userId,
        type: "request_delivered",
        title: "Request Delivered",
        message: `Your request for ${request.peopleCount} people has been delivered.`,
        relatedModel: "Requests",
        relatedId: request._id,
      }
    ];
    
    await Notifications.insertMany(notifications);
    console.log(`Notifications sent for delivered request ${id}`);
    
    res.json({
      message: "Request marked as delivered successfully",
      request: updatedRequest
    });
  } catch (error) {
    console.error("Error delivering request:", error);
    res.status(500).json({ message: "Failed to mark request as delivered" });
  }
};

// Get donor's accepted requests
const getMyAcceptedRequests = async (req, res) => {
  try {
    console.log("=== GET MY ACCEPTED REQUESTS ===");
    const donorId = req.user?.id;
    
    const requests = await Requests.find({ 
      donor: donorId,
      status: { $in: ["Matched", "Delivered"] }
    })
    .populate("receiver", "fullname")
    .sort({ updatedAt: -1 });

    const formattedRequests = requests.map((request) => ({
      ...request.toObject(),
      preferredTime: new Date(request.preferredTime).toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
    }));
    
    console.log(`Found ${formattedRequests.length} accepted requests for donor ${donorId}`);
    res.json(formattedRequests);
  } catch (error) {
    console.error("Error getting accepted requests:", error);
    res.status(500).json({ message: "Failed to get accepted requests" });
  }
};

// Helper function to update declined requests
const updateDeclinedRequests = async () => {
  try {
    const result = await Requests.updateMany(
      { 
        status: "Pending",
        preferredTime: { $lt: new Date() }
      },
      { status: "Declined" }
    );
    
    if (result.modifiedCount > 0) {
      console.log(`Updated ${result.modifiedCount} requests to declined status`);
    }
  } catch (error) {
    console.error("Error updating declined requests:", error);
  }
};

export { 
  createRequest, 
  getRequests, 
  getMyRequests, 
  getAvailableRequests,
  acceptRequest,
  deliverRequest,
  getMyAcceptedRequests,
  updateDeclinedRequests
};
