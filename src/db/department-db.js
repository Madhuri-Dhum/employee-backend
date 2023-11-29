const DBService = require("../services/db-service");
const { insert, update } = require("../helpers/common-function");


DBService.prototype.add_department = async function (
  department,
) {
  try {
    return await insert(department, "department", this.mysql);
  } catch (error) {
    throw error
  }
};

DBService.prototype.update_department = async function (
    department,
    department_id
  ) {
    try {
     return await update(department, department_id, "department", this.mysql);
    } catch (error) {
      throw error
    }
};

DBService.prototype.check_department_by_id = async function (
    department_id,
  ) {
    try {
      const department_details = this.mysql(
        `SELECT * FROM department WHERE id = ${department_id} AND delete_status != '1'`
      );
      return department_details;
    } catch (error) {
      throw error;
    }
  };

  DBService.prototype.get_departments = async function (req) {
    const search_params = req.query
    if (!search_params.start) search_params.start = 0;
    if (!search_params.limit) search_params.limit = 10;
    let limit = ` LIMIT ${Number(search_params.start)}, ${Number(
      search_params.limit
    )}`;
  
    let condition;
    let department_count_query;
    let department_query;
    try {
      if(req.employee.role != "MANAGER"){
        condition = `WHERE delete_status != '1' `;
         department_count_query = `SELECT count(id) as total_department  from department ${condition}`;
         department_query = `SELECT * from department ${condition} ${limit} `;
      }else{
        let condition2 = ""
        if(search_params.department ){
          condition2 = ` AND d.id = ${search_params.department}`
        }
        condition = ` WHERE d.delete_status != '1' AND e.delete_status != '1' ${condition2} GROUP BY d.id`
        const employee_join = "LEFT JOIN employee e ON d.id = e.department_id"
        department_count_query = `SELECT count(d.id) as total_department  from department d ${employee_join} ${condition}`;
        department_query = `SELECT d.*, group_concat(e.first_name, " ", e.last_name) as employee_names FROM department d ${employee_join} ${condition} ${limit} `;
      }
      console.log(department_count_query)
      const department_count = await this.mysql(department_count_query);
      const department_list = await this.mysql(department_query);
      return {
        department_list,
        total_department:
          department_count.length > 0
            ? department_count[0].total_department
            : 0,
      };
    } catch (err) {
      throw err;
    }
  };

  DBService.prototype.delete_department = async function (department_id) {
    try {
      const department_query = `UPDATE department SET delete_status = "1" where id = ${department_id} `;
      return await this.mysql(department_query); 
    } catch (err) {
      throw err;
    }
  };
module.exports = DBService;
