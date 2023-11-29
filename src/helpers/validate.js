var jwt = require("jsonwebtoken");
let db_employee = require("../db/employee-db");

const validate_request = async (req, res, cb) => {
  let db_srv_employee = db_employee.instance;

  if (
    req.path.startsWith("/employee/signup") ||
    req.path.startsWith("/employee/login")
  )
    return cb();

  let auth_header = req.headers["authorization"];
  let token = auth_header && auth_header.split(" ")[1];
  if (token == null) {
    return res.sendStatus(401);
  }

  jwt.verify(token, process.env.SECRET, async function (err, data) {
    if (err) {
      return res.sendStatus(403);
    } else {
      data = data.data ? data.data : data;
      let employeeinfo = await db_srv_employee.check_employee_by_id(data.employee_id);
      if (employeeinfo && employeeinfo[0].id) {
        req.employee = {
          employee_id: data.employee_id,
          email: data.email,
          role: data.role,
          token,
        };
        return cb();
      } else {
        return res.sendStatus(401);
      }
    }
  });
};

module.exports = validate_request;
