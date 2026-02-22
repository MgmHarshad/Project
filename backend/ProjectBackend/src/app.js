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
// Allow multiple origins (development and production)
const allowedOrigins = process.env.CORS_ORIGIN 
  ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim())
  : ["http://localhost:5173"];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes('*')) {
        callback(null, true);
      } else {
        callback(null, true); // Allow all origins in production for now
      }
    },
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
