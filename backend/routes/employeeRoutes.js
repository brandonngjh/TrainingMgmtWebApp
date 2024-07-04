import express from "express";
import {
  getEmployees,
  getEmployee,
  createEmployee,
  deleteEmployee,
  updateEmployee,
} from "../database/employeeDatabase.js";

const router = express.Router();

// Route for Get All Employees from database
router.get("/", async (req, res) => {
  try {
    const employees = await getEmployees();
    return res.status(200).json(employees);
  } catch (error) {
    console.error(error.message);
    return res.status(500).send({ message: error.message });
  }
});

// Route for Get One Employee from database by id
router.get("/:id", async (req, res) => {
  try {
    const employee = await getEmployee(req.params.id);
    if (employee) {
      return res.status(200).json(employee);
    } else {
      return res.status(404).send({ message: "Employee not found" });
    }
  } catch (error) {
    console.error(error.message);
    return res.status(500).send({ message: error.message });
  }
});

// Route for add a new Employee
router.post("/", async (req, res) => {
  try {
    const { name, email, department } = req.body;
    if (!name || !email || !department) {
      return res
        .status(400)
        .send({ message: "Send all required fields: name, email, department" });
    }
    const newEmployee = await createEmployee(name, email, department);
    return res.status(201).json(newEmployee);
  } catch (error) {
    console.error(error.message);
    return res.status(500).send({ message: error.message });
  }
});

// Route for Delete an Employee
router.delete("/:id", async (req, res) => {
  try {
    const message = await deleteEmployee(req.params.id);
    return res.status(200).send({ message });
  } catch (error) {
    console.error(error.message);
    return res.status(500).send({ message: error.message });
  }
});

// Route for updating an Employee
router.put("/:id", async (req, res) => {
  try {
    const { name, email, department } = req.body;
    if (!name || !email || !department) {
      return res
        .status(400)
        .send({ message: "Send all required fields: name, email, department" });
    }
    const updatedEmployee = await updateEmployee(
      req.params.id,
      name,
      email,
      department
    );
    if (updatedEmployee) {
      return res.status(200).json(updatedEmployee);
    } else {
      return res.status(404).send({ message: "Employee not found" });
    }
  } catch (error) {
    console.error(error.message);
    return res.status(500).send({ message: error.message });
  }
});

export default router;
