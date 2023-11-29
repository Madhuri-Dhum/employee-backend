const db = require("../db/employee-db")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");

function EmoployeeService(){
    this.db_service = db.instance
    EmoployeeService.instance = this
}

EmoployeeService.prototype.signup = async function(req){
    try {
        await this.db_service.check_employee_exist(req)
        const hashedPassword = await bcrypt.hash(req.password, 12);
        return await this.db_service.signup({...req, password : hashedPassword})
    } catch (error) {
        throw error
    }
}

EmoployeeService.prototype.update_employee = async function(req, id){
    try {
        return await this.db_service.update_employee(req, id)
    } catch (error) {
        throw error
    }
}

EmoployeeService.prototype.login = async function (
    employee_data,
  ) {
    try {
      const employee_exist = await this.db_service.check_employee_exist(
        employee_data,
        true
      );
      const isEqual = await bcrypt.compare(
        employee_data.password,
        employee_exist.password
      );
      if (isEqual) {
        const data = {
              email: employee_exist.email,
              employee_id: employee_exist.id,
              first_name: employee_exist.first_name,
              last_name: employee_exist.last_name,
              role : employee_exist.role
          }
        let token = jwt.sign(
          {
            exp:
              Math.floor(Date.now() / 1000) +
              parseInt(process.env.EXPIRES_IN) * 60,
            data: data,
          },
          process.env.SECRET
        );
  
        return {
          token,
          email: employee_exist.email,
          employee_id: employee_exist.id,
          first_name: employee_exist.first_name,
          last_name: employee_exist.last_name,
          role : employee_exist.role,
        };
      } else {
        const error = new Error("Invalid email or password");
        error.statusCode = 401;
        throw error;
      }
    } catch (error) {
      throw error;
    }
  };

  EmoployeeService.prototype.get_employees = async function(req){
    try {
        return await this.db_service.get_employees(req)
    } catch (error) {
        throw error
    }
}

EmoployeeService.prototype.get_employee_details = async function(employee_id){
  try {
      return await this.db_service.check_employee_by_id(employee_id)
  } catch (error) {
      throw error
  }
}

EmoployeeService.prototype.delete_employee = async function(employee_id){
  try {
      return await this.db_service.delete_employee(employee_id)
  } catch (error) {
      throw error
  }
}
module.exports = EmoployeeService