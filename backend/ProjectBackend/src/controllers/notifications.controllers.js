import Notifications from "../models/notification.models.js";
import mongoose from "mongoose";

const listMyNotifications = async (req, res) => {
  try {
    const userId = req.user?.id;
    const notifications = await Notifications.find({ recipient: userId })
      .sort({ createdAt: -1 })
      .populate("actor", "fullname role")
      .lean();
    res.json(notifications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
};

const markAsRead = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    
    console.log(`Marking notification ${id} as read for user ${userId}`);
    
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log(`Invalid ObjectId: ${id}`);
      return res.status(400).json({ message: "Invalid notification ID" });
    }
    
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      console.log(`Invalid user ObjectId: ${userId}`);
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    const notif = await Notifications.findOneAndUpdate(
      { _id: id, recipient: userId },
      { $set: { read: true } },
      { new: true }
    );
    
    if (!notif) {
      console.log(`Notification ${id} not found for user ${userId}`);
      return res.status(404).json({ message: "Notification not found" });
    }
    
    console.log(`Successfully marked notification ${id} as read`);
    res.json(notif);
  } catch (error) {
    console.error("Error in markAsRead:", error);
    res.status(500).json({ message: "Failed to mark as read" });
  }
};

const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user?.id;
    
    console.log(`Marking all notifications as read for user ${userId}`);
    
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      console.log(`Invalid user ObjectId: ${userId}`);
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    const result = await Notifications.updateMany(
      { recipient: userId, read: false },
      { $set: { read: true } },
      { upsert: false, multi: true }
    );
    
    console.log(`Successfully marked ${result.modifiedCount} notifications as read`);
    res.json({ message: "All notifications marked as read", modified: result.modifiedCount });
  } catch (error) {
    console.error("Error in markAllAsRead:", error);
    res.status(500).json({ message: "Failed to mark all as read" });
  }
};

export { listMyNotifications, markAsRead, markAllAsRead };


