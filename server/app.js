import express from "express";
import cors from "cors";
import session from "express-session";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

import globalErrorHandler from "./src/controllers/error.controllers.js";
import connectDB from "./src/db/index.js";
import userRoutes from "./src/routes/user.routes.js"; // Adjusted path if file is inside src
import productRoutes from "./src/routes/product.routes.js";
import imageRoutes from "./src/routes/image.routes.js";

dotenv.config({ path: "./.env" }); // Make sure path is correct relative to this file

const app = express();
const PORT = process.env.PORT || 8000;

// CORS Configuration
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  })
);


// Parsing Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

// Static Files
app.use(express.static("public"));

// Session Middleware
app.use(
  session({
    secret: process.env.EXPRESS_SESSION_SECRET || "default-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    },
  })
);

app.get("/", (req, res) => {
  res.send("🚀 Server is running");
});

app.use("/api/auth", userRoutes);
app.use("/api", productRoutes);
app.use("/api" , imageRoutes);


app.use(globalErrorHandler);

//  Start Server 
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      //console.log(`🚀 Server is running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err);
  }
};

startServer();
