import express from "express";
const router = express.Router();
import { listMyNotifications, markAsRead, markAllAsRead } from "../controllers/notifications.controllers.js";
import { authMiddleware } from "../middlewares/auth.middlewares.js";

router.get("/notifications", authMiddleware, listMyNotifications);
// Define static route BEFORE dynamic :id route to avoid conflicts
router.patch("/notifications/read-all", authMiddleware, (req, res, next) => {
    console.log(`PATCH /notifications/read-all - Route hit`);
    next();
}, markAllAsRead);
router.patch("/notifications/:id/read", authMiddleware, (req, res, next) => {
    console.log(`PATCH /notifications/${req.params.id}/read - Route hit`);
    next();
}, markAsRead);

export default router;


