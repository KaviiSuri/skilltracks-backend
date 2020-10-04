const express = require("express");
const router = express.Router();

const userRouter = require("./user");
const stepRouter = require("./step");
const trackRouter = require("./track");

router.use("/user", userRouter);
router.use("/step", stepRouter);
router.use("/track", trackRouter);

router.get("/", (req, res) => {
  res.status(200).json({
    message: "hello world",
  });
});

router.get("*", (req, res, next) => {
  const error = new Error("Invalid Endpoint");
  error.statusCode = 404;
  next(error);
});

router.use((error, req, res, next) => {
  console.error(error.message);
  res.status(error.statusCode || 500).json({
    error: true,
    message: error.message || "An Error Occured",
  });
});

module.exports = router;
