import express from "express";
import {
  getDepartments,
  getDepartmentByID,
  createDepartment,
  deleteDepartment,
  updateDepartment,
} from "../database/departmentDatabase.js";

const router = express.Router();

// Route for Get All Departments from database
router.get("/", async (req, res) => {
  try {
    const departments = await getDepartments();
    return res.status(200).json(departments);
  } catch (error) {
    console.error(error.message);
    return res.status(500).send({ message: error.message });
  }
});

// Route for Get One Department from database by id
router.get("/:id", async (req, res) => {
  try {
    const department = await getDepartmentByID(req.params.id);
    if (department) {
      return res.status(200).json(department);
    } else {
      return res.status(404).send({ message: "Department not found" });
    }
  } catch (error) {
    console.error(error.message);
    return res.status(500).send({ message: error.message });
  }
});

// Route for adding a new Department
router.post("/", async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).send({ message: "Send required field: name" });
    }
    const newDepartment = await createDepartment(name);
    return res.status(201).json(newDepartment);
  } catch (error) {
    console.error(error.message);
    return res.status(500).send({ message: error.message });
  }
});

// Route for Deleting a Department
router.delete("/:id", async (req, res) => {
  try {
    const message = await deleteDepartment(req.params.id);
    return res.status(200).send({ message });
  } catch (error) {
    console.error(error.message);
    return res.status(500).send({ message: error.message });
  }
});

// Route for Updating a Department
router.put("/:id", async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).send({ message: "Send required field: name" });
    }
    const updatedDepartment = await updateDepartment(req.params.id, name);
    if (updatedDepartment) {
      return res.status(200).json(updatedDepartment);
    } else {
      return res.status(404).send({ message: "Department not found" });
    }
  } catch (error) {
    console.error(error.message);
    return res.status(500).send({ message: error.message });
  }
});

export default router;
