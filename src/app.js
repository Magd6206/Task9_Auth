require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const cookies = require("cookie-parser");
const notFoundHandler = require("./middlewares/notFound");
const errorHandler = require("./middlewares/errHandler");
const cors = require("cors");
const helmet = require("helmet");
const hpp = require("hpp"); // حماية Parameter Pollution
const xss = require("./middlewares/xss"); // أو مسار الميدل وير الخاص بك لـ XSS
const rateLimit = require("express-rate-limit");
const { limiter } = require("./middlewares/limiter");
const app = express();

app.use(
  cors({
    origin: true,
    credentials: true, // Required for HTTP-Only cookie exchange
  }),
);
app.use(express.json());
app.use(cookies());
app.use(limiter); // قراءة الـ body بصيغة JSON

app.use(helmet());
app.use(hpp());
app.use(xss);
app.use(morgan("dev"));

app.get("/api/v1/Test", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Test endpoint is working successfully!",
  });
});

app.use("/api/v1/auth", require("./routers/auth.routes")); // 👈 ربط مسار المصادقة
app.use("/api/v1", require("./routers/protected.routes"));

//Routs

app.use(notFoundHandler);
app.use(errorHandler);
const PORT = process.env.PORT || 3000;
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/Task9";
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log("Connected to MongoDB");
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });
