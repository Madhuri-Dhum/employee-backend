const express = require("express")
const router = express.Router()
const { validationResult } = require("express-validator");

const departmentService = require("../services/department-service")
const { validate_department_name } = require("./validator")

new departmentService()
let department_srv = departmentService.instance

router.post("/",[validate_department_name],async function (req, res, next){
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res
            .status(422)
            .json({ message: errors.array()[0].msg, status: false });
        }
        if(req.employee.role != "MANAGER"){
            const error = new Error("You have no authority to add department")
            error.statusCode = 401
            throw error
        }
        if(!req.body.department_name){
            const error = new Error("Departname is required.")
            error.statusCode = 401
            throw error
        }
        await department_srv.add_department(req.body);   
        res.status(201).json({status : true, message : "Department Added Successfully"})
    } catch (error) {
        next(error)
    }
})

router.put("/update/:id", async function(req, res, next){
    try {
        if(req.employee.role != "MANAGER"){
            const error = new Error("You have no authority to update department")
            error.statusCode = 401
            throw error
        }
        await department_srv.update_department(req.body, req.params.id)
        res.status(200).json({status : true , message : "Department Update Successfully"})
    } catch (error) {
        next(error)
    }
})

router.get("/",async function (req, res, next){
    try {
        const department_list = await department_srv.get_departments(req);  
        res.append("X-Total-Count", department_list.total_department);
        res.status(200).json(department_list.department_list);
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
        await department_srv.delete_department(req.body.id)
        res.status(200).json({status : true , message : "Delete successfully"})
    } catch (error) {
        next(error)
    }
})

module.exports = router