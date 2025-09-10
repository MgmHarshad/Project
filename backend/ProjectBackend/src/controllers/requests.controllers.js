import Requests from "../models/requests.models.js";

const createRequest = async (req, res) => {
  try {
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
    const requests = await Requests.find().populate("receiver", "fullname");

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
    const requests = await Requests.find({ receiver: receiverId }).populate(
      "receiver",
      "fullname"
    );

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

export { createRequest, getRequests, getMyRequests };
