require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost:27017/usersDB", {useUnifiedTopology:true, useNewUrlParser:true});

const userSchema = new mongoose.Schema ({
  email: String,
  password: String, 
});

const secret = process.env.SECRET;

userSchema.plugin(encrypt, {secret: secret, encryptedFields: ["password"]});

const User = new mongoose.model("User", userSchema);

app.get("/", (req, res) => {
  res.render("home");
})

app.get("/login", (req, res) => {
  res.render("login");
})

app.post("/login", (req, res) =>{
  const { username, password } = req.body;
  User.findOne({email: username}, (err, foundUser) =>{
    if(err) {
      console.log(err);
    } else {
      if(foundUser.password === password){
        res.render("secrets");
      } else {
        console.log(err);
      }
    }
  })
})

app.get("/register", (req, res) => {
  res.render("register");
})

app.post("/register", (req, res) => {
  const { username, password} = req.body;
  const newUser = new User({
    email: username,
    password: password,
  });

  newUser.save((err) => {
    if(err){
      res.send(err);
    } else {
      res.render("secrets");
    }
  });
})

app.listen(3000, () => console.log("Server started at port 3000"));