const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const methodOverride = require('method-override');
const helmet = require('helmet');
const morgan = require("morgan");
const cors = require('cors');
const { logs } = require('./vars');
const routes = require('../api/routes/v1');
const error = require("../api/middlewares/error")
const app = express();
const rateLimit = require('express-rate-limit');


// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100 
});
app.use(limiter);

app.use(morgan(logs));
app.use(bodyParser.json({ limit: "100mb" }));
app.use(bodyParser.urlencoded({
    limit: "100mb",
    extended: true
}));
app.use(cookieParser());

app.use(methodOverride());

app.use(helmet());

app.use(cors());

app.use('/v1', routes);

app.use(error.converter);

app.use(error.notFound);

app.use(error.handler);

module.exports = app;
