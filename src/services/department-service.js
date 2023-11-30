const db = require("../db/department-db")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");

function DepartmentService(){
    this.db_service = db.instance
    DepartmentService.instance = this
}

DepartmentService.prototype.add_department = async function(req){
    try {
        return await this.db_service.add_department(req)
    } catch (error) {
        throw error
    }
}

DepartmentService.prototype.update_department = async function(req, id){
    try {
        return await this.db_service.update_department(req, id)
    } catch (error) {
        throw error
    }
}

  DepartmentService.prototype.get_departments = async function(req){
    try {
        return await this.db_service.get_departments(req)
    } catch (error) {
        throw error
    }
}

EmoployeeService.prototype.delete_department = async function(employee_id){
    try {
        return await this.db_service.update_employee({delete_status : "1"},employee_id)
    } catch (error) {
        throw error
    }
  }
module.exports = DepartmentService