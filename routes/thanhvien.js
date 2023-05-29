var express = require("express");
var router = express.Router();
var db = require("../models/database");
router.get("/dangky", function (req, res) {
  res.render("signup");
});
router.post("/luu", function (req, res) {
  let u = req.body.username;
  let p = req.body.password;
  let em = req.body.email;
  let user_info = { user_name: u, user_password: p, user_email: em };
  //let user_info = {};
  //user_info.username = u;
  //user_info.password = p;
  //user_info.email = em;
  let sql = "INSERT INTO user SET ?";
  db.query(sql, user_info);
  res.redirect("/login");
});
module.exports = router;
