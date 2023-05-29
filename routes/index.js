var express = require("express");
var router = express.Router();
var db = require("../models/database");
var modelUsers = require("../models/loai");
const session = require("express-session");
var multer = require("multer");

/* GET home page. */
router.get("/", function (req, res, next) {
  let sql = "SELECT id, tenLoai from loai";
  let sqlApple = "SELECT id, tenSP, moTa, urlHinh, gia, giaCu from product";
  db.query(sql, function (err, listLoai) {
    if (err) throw err;
    db.query(sqlApple, function (err, listApple) {
      if (err) throw err;
      res.render("shop", { loaiApple: listLoai, listApple: listApple });
    });
  });
});

router.get("/product/:productId", (req, res) => {
  // thiếu dấu /
  let id = req.params.productId;
  let sql = `SELECT * from loai`;
  db.query(sql, function (err, listLoai) {
    if (err) throw err;
    let sqlApple = `SELECT * from product WHERE  idLoai = ${id}`;
    db.query(sqlApple, function (err, listApple) {
      res.render("shop", { loaiApple: listLoai, listApple: listApple });
    });
  });
});
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/images");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
var upload = multer({ storage: storage });
router.get("/productdetail/:id", (req, res) => {
  // thiếu detail
  let id = req.params.id;
  let sql = `SELECT * from loai`;
  db.query(sql, function (err, listLoai) {
    if (err) throw err;
    let sqlApple = `SELECT * from product WHERE  id = ${id}`;
    db.query(sqlApple, function (err, data) {
      res.render("productdetail", {
        loaiApple: listLoai,
        productdetail: data[0],
      });
    });
  });
});
router.get("/admin", (req, res) => {
  res.render("admin/home");
});

router.get("/admin/list", (req, res) => {
  let sqlLoai = "select id, tenLoai from loai";
  db.query(sqlLoai, (err, listLoai) => {
    if (err) throw err;
    let sqlSP = "select id, tenSP, moTa, urlHinh, gia, giaCu from product";
    db.query(sqlSP, (err, listSP) => {
      res.render("admin/list-product", { loaiSP: listLoai, listSP: listSP });
    });
  });
});
router.get("/admin/add-product", (req, res) => {
  res.render("admin/add-product");
});

router.post("/admin/add-product", upload.single("urlHinh"), (req, res) => {
  const file = req.file;
  let tenSP = req.body.tenSP;
  let gia = req.body.gia;
  let moTa = req.body.moTa;
  let hinhsp = file.filename;
  product = {
    tenSP: tenSP,
    gia: gia,
    moTa: moTa,
    urlHinh: hinhsp,
  };

  db.query("insert into product SET ?", product, function (err, data) {
    if (err) throw err;
    let sqlLoai = "select id, tenLoai from loai";
    db.query(sqlLoai, (err, listLoai) => {
      if (err) throw err;
      let sqlSP = "select id, tenSP, moTa, urlHinh, gia, giaCu from product";
      db.query(sqlSP, (err, listSP) => {
        res.render("admin/list-product", { loaiSP: listLoai, listSP: listSP });
      });
    });
  });
});
// xóa dlieu
router.get("/del/:id", (req, res) => {
  let id = req.params.id;
  db.query("DELETE FROM product WHERE id = ?", [id], function (err, data) {
    if (err) throw err;
    if (data.affectedRows == 0)
      console.log(`Không có id product để xóa: ${id}`);
    res.redirect("/admin/list");
  });
});
//update

router.get("/update/:id", function (req, res, next) {
  let id = req.params.id;
  let sql = `SELECT * FROM product where id=${id}`;
  db.query(sql, function (err, listSP) {
    res.render("./admin/edit", { product: listSP });
  });
});
router.post("/updateD/:id", upload.single("urlHinh"), (req, res) => {
  let id = req.params.id;
  const hinhsp = req.file ? req.file.filename : null;
  let tenSP = req.body.tenSP;
  let gia = req.body.gia;
  let moTa = req.body.moTa;

  product = {
    tenSP: tenSP,
    gia: gia,
    moTa: moTa,
    urlHinh: hinhsp,
  };
  db.query(
    `UPDATE product SET ? WHERE id = ${id}`,
    product,
    function (err, data) {
      if (err) throw err;
      if (data.affectedRows == 0) {
        console.log(`Không có id  để cập nhật: ${id}`);
      }
      res.redirect("/admin/list");
    }
  );
});

// router.get("/", function (req, res, next) {
//   res.render("shop");
// });

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


router.get("/admin/list-user", (req, res) => {
  let sqluser =
    "select user_id, user_name, user_email, user_password from user";
  db.query(sqluser, (err, listUser) => {
    if (err) throw err;
    res.render("admin/list-user", { listu: listUser });
  });
});
//xóa user
router.get("/del-user/:id", (req, res) => {
  let id = req.params.id;
  db.query("DELETE FROM user WHERE user_id = ?", [id], function (err, data) {
    if (err) throw err;
    if (data.affectedRows == 0) console.log(`Không có id user để xóa: ${id}`);
    res.redirect("/admin/list-user");
  });
});

router.get("/login", (req, res) => {
  res.render("login", { session: req.session });
});
router.post("/login", function (req, res, next) {
  var user_email_address = req.body.user_email_address;
  var user_password = req.body.user_password;
  if (user_email_address && user_password) {
    query = ` SELECT * FROM user Where user_email = "${user_email_address}"`;

    db.query(query, function (err, data) {
      if (data.length > 0) {
        for (var count = 0; count < data.length; count++) {
          if (data[count].user_password == user_password) {
            req.session.user_id = data[count].user_id;
            // res.send("Bạn đã đăng nhập thành công");
            res.redirect("/login");
          } else {
            res.send("Nhập sai mật khẩu");
          }
        }
      }
    });
  } else {
    res.send("Mời nhập user và mật khẩu");
    res.end();
  }
});
router.get("/logout", function (req, res, next) {
  req.session.destroy();
  res.redirect("/");
});
router.get("/signup", (req, res) => {
  res.render("signup", { session: req.session });
});
module.exports = router;
