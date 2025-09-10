import express from "express";
const router = express.Router();
import {
  createEvents,
  getEvents,
  myEvents,
} from "../controllers/futureEvents.controllers.js";
import { authMiddleware } from "../middlewares/auth.middlewares.js";

router.post("/createEvent", authMiddleware, createEvents);

router.get("/getEvents", getEvents);

router.get("/getMyEvents", authMiddleware, myEvents);

export default router;
