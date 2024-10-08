const Express = require("express");
require("dotenv").config();
const Cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = Express();

const UserRoute = require("./Routes/user-routes");

app.use(Cors());
app.use(Express.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use("/Sourire/User", UserRoute);

mongoose
  .connect(process.env.URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("database connected", process.env.URI);
  })
  .catch((err) => console.log("bonjour", err));

app.listen(process.env.PORT, () =>
  console.log(`The server is running on http://localhost:${process.env.PORT}`)
);
