require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const compression = require("compression");
const helmet = require("helmet");
const cors = require("cors");
const passport = require("passport");
const app = express();
const initMongo = require("./config/mongo");
const config = require("./config/config");
// Setup express server port from ENV, default: 3000
app.set("port", config.PORT || 3001);
const path = require('path');

require('./app/middleware/jwtAuth')(passport);
// for parsing json
app.use(
  express.json({
    limit: "50mb",
  })
);
// for parsing application/x-www-form-urlencoded
app.use(
  express.urlencoded({
    limit: "50mb",
    extended: true,
  })
);
// Enable only in development HTTP request logger middleware
if (config.ENV === "DEV" || config.ENV === "STAGE") {
  app.use(morgan("dev"));
}

//for Helth check
app.get("/test", (req, res) => {
  res.send("OK");
});

app.get("/static-data",(req,res) => {
  const resp = {
    blog:`${process.env.BACK_END_URL}/public/blog`,
    imageGallery:`${process.env.BACK_END_URL}/public/imageGallery`
  };
  return res.status(200).json({
    success: true,
    status: 200,
    data: resp,
    message: "Success.",
});
})

/**
 * use cors
 */
app.use(cors());

/**
 * allow cors origin
 */
app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "*");

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type,authorization"
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);

  // Pass to next layer of middleware
  next();
});

// Init all other stuff
app.use(passport.initialize());
app.use(compression());
app.use(helmet());
app.use('/public', express.static(path.join(__dirname, '/public')));
const route = require("./app/routes");
app.use(route);
module.exports = app;

Promise.all([initMongo()])
  .then((values) => {
    app.listen(app.get("port"), () => {
      console.log(
        `Server listening in ${config.ENV} mode to the port ${app.get(
          "port"
        )} ${new Date()}`
      );
    });
    app.timeout = 320000;
  })
  .catch((error) => {
    console.log("config error >> ", error);
  });
