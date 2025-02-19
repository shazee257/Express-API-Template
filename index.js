import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { createServer } from "http";
import cookieSession from "cookie-session";
import requestIp from "request-ip";
import { Server } from "socket.io";
import { initializeSocketIO } from "./socket/index.js";
import connectDB from "./config/database.config.js";
import { log, rateLimiter, notFound, errorHandler } from "./middlewares/index.js";
import API from "./api/index.js";
import { generateResponse } from "./utils/helpers.js";

// initialize environment variables
dotenv.config();

// initialize express app
const app = express();

// connect to database
connectDB();

// set port
const PORT = process.env.PORT || 5000;

// initialize http server
const httpServer = createServer(app);

// initialize socket.io
const io = new Server(httpServer, {
  pingTimeout: 60000,
  cors: {
    origin: "*",
    credentials: true,
  },
});

// mount io to app
app.set("io", io);

// set up middlewares
app.use(requestIp.mw());
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use('/uploads', express.static('uploads'));
app.use(cookieSession({
  name: 'session',
  keys: [process.env.COOKIE_KEY],
  maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
}));
app.use(cors({ origin: "*", credentials: true }));
app.use(rateLimiter);

app.get('/', (req, res) => generateResponse(null, `${process.env.APP_NAME} API - Health check passed`, res));

app.use(log);
new API(app).registerGroups();

initializeSocketIO(io);

app.use(notFound);
app.use(errorHandler);

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`.yellow.bold);
});
