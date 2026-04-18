const express = require("express");
const bcrypt = require("bcrypt");
const path = require("path");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

// Model's
const userModel = require("./model/userModel");
const postModel = require("./model/postModel");

const app = express();

app.set("view engine", "ejs");

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/register", (req, res) => {
  res.render("index");
});

// User Create
app.post("/register", async (req, res) => {
  let { username, name, age, email, password } = req.body;
  const exitsUser = await userModel.findOne({ email });

  if (exitsUser) return res.status(500).send("User already exits");

  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, async (err, hash) => {
      const user = await userModel.create({
        username,
        name,
        age,
        email,
        password: hash,
      });

      const token = jwt.sign({ email: email, userid: user._id }, "SECRET_KEY");
      res.cookie("token", token);
      res.send("User Created Sucessfully");
    });
  });
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.listen(3000, () => {
  console.log("Server is running...");
});
