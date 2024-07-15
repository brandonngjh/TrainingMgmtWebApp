import express from "express";
import {
  getJobs,
  getJobByID,
  createJob,
  deleteJob,
  updateJob,
} from "../database/jobDatabase.js";

const router = express.Router();

// Route for Get All Jobs from database
router.get("/", async (req, res) => {
  try {
    const jobs = await getJobs();
    return res.status(200).json(jobs);
  } catch (error) {
    console.error(error.message);
    return res.status(500).send({ message: error.message });
  }
});

// Route for Get One Job from database by id
router.get("/:id", async (req, res) => {
  try {
    const job = await getJobByID(req.params.id);
    if (job) {
      return res.status(200).json(job);
    } else {
      return res.status(404).send({ message: "Job not found" });
    }
  } catch (error) {
    console.error(error.message);
    return res.status(500).send({ message: error.message });
  }
});

// Route for adding a new Job
router.post("/", async (req, res) => {
  try {
    const { name, department_id } = req.body;
    if (!name || !department_id) {
      return res
        .status(400)
        .send({ message: "Send required fields: name, department_id" });
    }
    const newJob = await createJob(name, department_id);
    return res.status(201).json(newJob);
  } catch (error) {
    console.error(error.message);
    return res.status(500).send({ message: error.message });
  }
});

// Route for Deleting a Job
router.delete("/:id", async (req, res) => {
  try {
    const message = await deleteJob(req.params.id);
    return res.status(200).send({ message });
  } catch (error) {
    console.error(error.message);
    return res.status(500).send({ message: error.message });
  }
});

// Route for Updating a Job
router.put("/:id", async (req, res) => {
  try {
    const { name, department_id } = req.body;
    if (!name || !department_id) {
      return res
        .status(400)
        .send({ message: "Send required fields: name, department_id" });
    }
    const updatedJob = await updateJob(req.params.id, name, department_id);
    if (updatedJob) {
      return res.status(200).json(updatedJob);
    } else {
      return res.status(404).send({ message: "Job not found" });
    }
  } catch (error) {
    console.error(error.message);
    return res.status(500).send({ message: error.message });
  }
});

export default router;
