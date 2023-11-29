const express = require("express")
const router = express.Router()
const { validationResult } = require("express-validator");

const employeeService = require("../services/employee-service")
const { validate_email, validate_password, validate_first_name, validate_last_name, validate_department_id } = require("./validator")

new employeeService()
let employee_srv = employeeService.instance

router.post("/signup", [validate_email,validate_password,validate_first_name,validate_last_name,validate_department_id],async function (req, res, next){
    try {
    const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(422)
          .json({ message: errors.array()[0].msg, status: false });
      }
        await employee_srv.signup(req.body);   
        res.status(201).json({status : true, message : "Sign-up Successful"})
    } catch (error) {
        next(error)
    }
})

router.put("/update/:id", async function(req, res, next){
    try {
        if(req.employee.role != "MANAGER"){
            const error = new Error("You have no authority to update details")
            error.statusCode = 401
            throw error
        }
        await employee_srv.update_employee(req.body, req.params.id)
        res.status(200).json({status : true , message : "Update successfully"})
    } catch (error) {
        next(error)
    }
})

router.get("/",async function (req, res, next){
    try {
        if(req.employee.role != "MANAGER"){
            const error = new Error("You have no authority to get list")
            error.statusCode = 401
            throw error
        }
        const employee_list = await employee_srv.get_employees(req.query);   
        res.append("X-Total-Count", employee_list.total_employee);
        res.status(200).json(employee_list.employee_list);
    } catch (error) {
        next(error)
    }
})

router.get("/:id",async function (req, res, next){
    try {
        if((req.employee.employee_id != req.params.id) && req.employee.role == "EMPLOYEE"){
            const error = new Error("You're not authorized to get details of others")
            error.statusCode = 401
            throw error
        }
        const employee_details = await employee_srv.get_employee_details(req.params.id);   
        res.status(200).json(employee_details[0]);
    } catch (error) {
        next(error)
    }
})

router.post("/login",async function (req, res, next){
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            const error = new Error(req.language.INVALID_DATA);
            error.statusCode = 422;
            return next(error);
        }
        const login_employee = await employee_srv.login(req.body);
        res.status(200).json({status: true,
            message: "Login Successfully",
            data: login_employee,})
    } catch (error) {
        next(error)
    }
})

router.delete("/", async function(req, res, next){
    try {
        if(req.employee.role != "MANAGER"){
            const error = new Error("You have no authority to delete details")
            error.statusCode = 401
            throw error
        }
        await employee_srv.delete_employee(req.body.id)
        res.status(200).json({status : true , message : "Delete successfully"})
    } catch (error) {
        next(error)
    }
})

module.exports = router