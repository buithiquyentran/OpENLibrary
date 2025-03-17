const express = require("express");
const cors = require("cors");
const app = express();
const booksRouter = require("./app/routes/book.route");
const nxbsRouter = require("./app/routes/nxb.route");
const staffsRouter = require("./app/routes/staff.route");
const readersRouter = require("./app/routes/reader.route");
const trackingsRouter = require("./app/routes/tracking.route");

const ApiError = require("./app/api-error");
app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
  res.json({ message: "Welcome to OpENLibrary." });
});
app.use("/api/books", booksRouter);
app.use("/api/nxbs", nxbsRouter);
app.use("/api/staffs", staffsRouter);
app.use("/api/readers", readersRouter);
app.use("/api/trackings", trackingsRouter);

app.use((req, res, next) => {
  return next(new ApiError(404, "Resource not found"));
});
app.use((error, req, res, next) => {
  return res.status(error.statusCode || 500).json({
    message: error.message || "Internal Server Error",
  });
});
module.exports = app;
