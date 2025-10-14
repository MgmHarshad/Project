import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import donorRoutes from "./routes/donation.routes.js";
import userRoutes from "./routes/user.routes.js";
import eventsRoutes from "./routes/futureEvents.routes.js";
import requestsRoutes from "./routes/requests.routes.js";
import notificationsRoutes from "./routes/notifications.routes.js";
import statsRoutes from "./routes/stats.routes.js";

const app = express();

// Middlewares
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173", // Default to Vite dev server
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
// app.use(express.static("public"))
app.use(cookieParser());

//Routes
app.use("/api", donorRoutes);
app.use("/api", userRoutes);
app.use("/api", eventsRoutes);
app.use("/api", requestsRoutes);
app.use("/api", notificationsRoutes);
app.use("/api", statsRoutes);

export { app };
