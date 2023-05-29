// var db = require("./database");
// exports.list = function (callback) {
//   let sql = `SELECT *  FROM loai`;
//   let sqlSP = `SELECT id, tenSP, moTa, urlHinh, gia, giaCu FROM product`;
//   db.query(sql, function (err, listloai) {
//     callback(listloai);
//     db.query(sqlSP, function (err, listSP) {
//       callback(listSP);
//     });
//   });
// };
// exports.create = function (data, callback) {
//   //hàm chèn user mới vào table
//   let sql = "INSERT INTO loai SET ?";
//   db.query(sql, data, function (err, d) {
//     callback(d);
//   });
// };
// exports.update = function (id, data, callback) {
//   let sql = "UPDATE loai  SET ? WHERE id = ?";
//   db.query(sql, [data, id], (err, d) => {
//     if (err) throw err;
//     callback();
//   });
// };
// exports.read = function (id, callback) {
//   let sql = "SELECT * FROM loai WHERE id = ?";
//   db.query(sql, id, (err, d) => {
//     data = d[0];
//     callback(data);
//   });
// };
