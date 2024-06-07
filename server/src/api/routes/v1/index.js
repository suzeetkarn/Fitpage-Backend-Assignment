const express = require("express");
const weatherRoutes = require("./weather/index.route");
const locationRoutes = require("./location/index.route");
const historyRoutes = require("./history/index.route");

const router = express.Router();

router.get("/status", (req, res) => res.send("OK"));
router.use("/weather", weatherRoutes);
router.use("/location", locationRoutes);
router.use("/history", historyRoutes);
module.exports = router;
