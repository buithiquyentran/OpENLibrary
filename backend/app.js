const express = require("express");
const cors = require("cors");
var cookieParser = require("cookie-parser");

const app = express();
const booksRouter = require("./app/routes/book.route");
const nxbsRouter = require("./app/routes/nxb.route");
const staffsRouter = require("./app/routes/staff.route");
const readersRouter = require("./app/routes/reader.route");
const trackingsRouter = require("./app/routes/tracking.route");
const authRouter = require("./app/routes/auth.route");

const ApiError = require("./app/api-error");
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"], // Cho phép truy cập từ frontend và admin
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.get("/", (req, res) => {
  res.json({ message: "Welcome to OpENLibrary." });
});
app.use("/api/books", booksRouter);
app.use("/api/nxbs", nxbsRouter);
app.use("/api/staffs", staffsRouter);
app.use("/api/readers", readersRouter);
app.use("/api/trackings", trackingsRouter);
app.use("/api/auth", authRouter);

app.use((req, res, next) => {
  return next(new ApiError(404, "Resource not found"));
});
app.use((error, req, res, next) => {
  return res.status(error.statusCode || 500).json({
    message: error.message || "Internal Server Error",
  });
});
module.exports = app;
