const express = require("express");
const routes = require("./v1/index.route");

const router = express.Router();

router.get("/status", (req, res) => res.send("OK"));
router.use("/route", routes);
module.exports = router;
