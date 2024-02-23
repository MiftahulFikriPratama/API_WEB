const route = require("./routers/route");
const express = require("express");
const fileupload = require("express-fileupload");

var cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(fileupload());

app.use(
  cors({
    origin: "*",
    methods: "*",
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Accept-Language",
      "x-api-key",
      "Origin",
      "X-Requested-With",
      "Accept",
      "Access-Control-Allow-Headers",
    ],
    credentials: false,
    optionsSuccessStatus: 204,
    preflightContinue: false,
  })
);

app.use(route);

app.listen(process.env.PORT, () => console.log("Server up and Running..."));
