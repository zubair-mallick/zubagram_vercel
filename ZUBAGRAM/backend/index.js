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

//middlewares
app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({ extended: true }));

const corsOptions = {
    origin: (origin, callback) => {
      // Allow requests from any origin dynamically
      if (!origin || [process.env.URL, "http://localhost:5173"].includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],  // Allow all common methods
    allowedHeaders: [
      "Content-Type", 
      "Authorization", 
      "Origin", 
      "X-Requested-With", 
      "Accept", 
      "Access-Control-Allow-Headers"
    ],  // Allow all custom and common headers
    credentials: true,  // Allow cookies and credentials
    preflightContinue: false,  // If set to true, OPTIONS requests won't end the response cycle (useful if you handle preflight)
    optionsSuccessStatus: 204,  // Some legacy browsers (IE) choke on 204, so you can return 200 if needed
  };
  
  app.use(cors(corsOptions));
  
app.use(cors(corsOptions));

// Set headers globally for all routes
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin || process.env.URL);
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,PATCH,OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

// yha pr apni api ayengi
app.use("/api/v1/user", userRoute);
app.use("/api/v1/post", postRoute);
app.use("/api/v1/message", messageRoute);

// app.use(express.static(path.join(__dirname, "/frontend/dist")));
// app.get("*", (req, res) => {
//     res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
// });

server.listen(PORT, () => {
    connectDB();
    console.log(`Server listen at port ${PORT}`);
});
