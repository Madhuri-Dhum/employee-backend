const express = require("express");
const app = express();
const config = require("./config");
require("dotenv").config();
const common_db = require("./services/db-service");
let mysql_config = config.mysql;
new common_db(mysql_config);

const employee_routes = require("./routes/employee-routes");
const department_routes = require("./routes/department-routes");

const validate_request = require("./helpers/validate")
function main() {
  app.use(function (req, res, next) {
    res.setHeader("X-Powered-By", "employee");
    res.charset = "utf-8";
    next();
  });

    app.use(express.json({ limit: "10mb" }));

    app.use(validate_request);
    app.use("/employee/", employee_routes);
    app.use("/department/", department_routes);
  
  app.use(function (error, req, res, next) {
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({ message: message, data: data, status: false });
  });
  app.listen(process.env.PORT, "0.0.0.0", null, () => {
console.log("server starts on", process.env.PORT)
});
}
main();
