require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const otpRoutes = require("./routes/otpRoutes");

connectDB();

const app = express();

app.use(cors({
  origin: "http://localhost:5173"
}));

app.use(express.json());

app.use("/api/auth", otpRoutes);

app.listen(process.env.PORT || 5000, () =>
  console.log(`Server running on port ${process.env.PORT || 5000}`)
);