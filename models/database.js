var mysql = require("mysql");

const db = mysql.createConnection({
  host: "localhost",
  database: "apple",
  user: "root",
  password: "",
});
db.connect(function (error) {
  if (error) {
    throw error;
  } else {
    console.log("Kết nối database thành công");
  }
});
module.exports = db;
