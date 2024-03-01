const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const { UserController } = require("./controllers/UserController");

const functions = require("firebase-functions");

const app = express();
app.use(express.json());
app.use(cors());
app.use(helmet());

const port = 5000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/user", UserController.registerUser);
app.get("/user/:id", UserController.getUser);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

exports.api = functions.https.onRequest(app);
