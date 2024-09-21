const Express = require("express");
require("dotenv").config();
const Cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = Express();

const PostRoute = require("./Routes/post-routes");
const UserRoute = require("./Routes/user-routes");
const CloudRoute = require("./Routes/cloud-routes")

app.use(Cors());
app.use(Express.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use("/pharmacie/User", UserRoute);
app.use("/pharmacie/Post", PostRoute);

app.use("/pharmacie", CloudRoute);


mongoose
  .connect(process.env.URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("database connected", process.env.URI);
  })
  .catch((err) => console.log("bonjour", err));

app.listen(process.env.PORT, () =>
  console.log(`The server is running on http://localhost:${process.env.PORT}`)
);
