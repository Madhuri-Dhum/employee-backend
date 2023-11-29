require("dotenv").config();

exports.mysql = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  connectionLimit: process.env.DB_CONNECTIONLIMIT,
  timezone: 'local',
  charset: "utf8mb4",
};