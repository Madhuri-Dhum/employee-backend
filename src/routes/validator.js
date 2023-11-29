const { check } = require("express-validator");

module.exports = {
  validate_email: check("email").trim().normalizeEmail().isEmail().withMessage("Invalid email"),
  validate_password: check("password").trim().notEmpty().notEmpty().withMessage("Invalid Password"),
  validate_first_name: check("first_name").trim().notEmpty().withMessage("First name is required"),
  validate_role: check("role").trim().notEmpty().withMessage("Role is required"),
  validate_last_name : check("last_name").trim().notEmpty().withMessage("Last name is required"),
  validate_location : check("location").trim().notEmpty().withMessage("Location is required"),
  validate_department_id : check("department_id").trim().notEmpty().withMessage("Department is required"),
  validate_department_name : check("department_id").trim().notEmpty().withMessage("Department name is required")
};
