import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import userRoute from "./routes/user.route.js";
import postRoute from "./routes/post.route.js";
import messageRoute from "./routes/message.route.js";
import { app, server } from "./socket/socket.js";
import path from "path";

dotenv.config();

const PORT = process.env.PORT || 3000;
const __dirname = path.resolve();

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({ extended: true }));

// CORS options
const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [process.env.URL, "http://127.0.0.1:5173","http://localhost:5173","https://zubagram-vercel-4tkk.vercel.app"];
    // Allow requests from any origin dynamically or allowed origins
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"], // Common methods
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "Origin",
    "X-Requested-With",
    "Accept",
    "Access-Control-Allow-Headers",
  ], // Custom headers allowed
  credentials: true, // Allow cookies and credentials
  preflightContinue: false, // OPTIONS requests handled automatically
  optionsSuccessStatus: 204, // For legacy browsers
};

// Use CORS middleware globally
app.use(cors(corsOptions));

// Set global headers for all routes (handled after CORS)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin || process.env.URL || "http://127.0.0.1:5173"||"http://localhost:5173"||"https://zubagram-vercel-4tkk.vercel.app");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,PATCH,OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

// API routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/post", postRoute);
app.use("/api/v1/message", messageRoute);

// Serve static files (if using frontend)
// app.use(express.static(path.join(__dirname, "/frontend/dist")));
// app.get("*", (req, res) => {
//   res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
// });

server.listen(PORT, () => {
  connectDB();
  console.log(`Server is listening at port ${PORT}`);
});
