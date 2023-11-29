const DBService = require("../services/db-service");
const { insert, update } = require("../helpers/common-function");

DBService.prototype.check_employee_exist = async function (
  employee_data,
  login = false,
) {
    try {
        let condition = " AND delete_status != '1' "
        let query = `SELECT * FROM employee where email = "${employee_data.email}" ${condition}`;
        const results = await this.mysql(query);
        if (results && results.length > 0) {
            if (login) {
              return results[0];
            } else {
              const error = new Error("Employee already exist with this email");
              error.statusCode = 403;
              throw error;
            }
          } else {
            if (login) {
              const error = new Error("You are not registered. Please sign up first");
              error.statusCode = 401;
              throw error;
            } else {
              return true;
            }
          }
    } catch (err) {
        throw err
    }
};

DBService.prototype.signup = async function (
  employee,
) {
  try {
    return await insert(employee, "employee", this.mysql);
  } catch (error) {
    throw error
  }
};

DBService.prototype.update_employee = async function (
    employee,
    employee_id
  ) {
    try {
     return await update(employee, employee_id, "employee", this.mysql);
    } catch (error) {
      throw error
    }
};

DBService.prototype.check_employee_by_id = async function (
    employee_id,
  ) {
    try {
      const department_join = "LEFT JOIN department d ON e.department_id = d.id"

      const employee_details = this.mysql(
        `SELECT e.*, d.department_name FROM employee e ${department_join} WHERE e.id = ${employee_id} AND e.delete_status != '1'`
      );
      return employee_details;
    } catch (error) {
      throw error;
    }
  };

  DBService.prototype.get_employees = async function (search_params) {
    if (!search_params.start) search_params.start = 0;
    if (!search_params.limit) search_params.limit = 10;
    let limit = ` LIMIT ${Number(search_params.start)}, ${Number(
      search_params.limit
    )}`;
  
    try {
      let condition = `WHERE e.delete_status != '1' `;
      let order = ""
      if(search_params.location && search_params.location != ""){
        order += "ORDER BY e.location ASC"
      }
      if(search_params.order == "ASC"){
        order += "ORDER BY e.first_name ASC"
      }
      if(search_params.order == "DESC"){
        order += "ORDER BY e.first_name DESC"
      }
      const department_join = "LEFT JOIN department d ON e.department_id = d.id"
      const employee_count_query = `SELECT count(e.id) as total_employee from employee e ${department_join} ${condition}`;
      const employee_query = `SELECT e.*, d.department_name from employee e ${department_join} ${condition} ${order} ${limit} `;
      console.log(employee_query)
      const employee_count = await this.mysql(employee_count_query);
      const employee_list = await this.mysql(employee_query);
      return {
        employee_list,
        total_employee:
          employee_count.length > 0
            ? employee_count[0].total_employee
            : 0,
      };
    } catch (err) {
      throw err;
    }
  };

  DBService.prototype.delete_employee = async function (employee_id) {
    try {
      const employee_query = `UPDATE employee SET delete_status = "1" where id = ${employee_id} `;
      return await this.mysql(employee_query); 
    } catch (err) {
      throw err;
    }
  };
module.exports = DBService;
