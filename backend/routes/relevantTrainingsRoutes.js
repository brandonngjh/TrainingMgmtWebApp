import express from "express";
import {
  getRelevantTrainings,
  getRelevantTrainingsById,
  getRelevantTrainingsByTrainingId,
  getRelevantTrainingsByEmployeeId,
  createRelevantTraining,
  deleteRelevantTraining,
  updateRelevantTraining,
} from "../database/relevantTrainingsDatabase.js";

const router = express.Router();

// Route for Get All Relevant Trainings from database
router.get("/", async (req, res) => {
  try {
    console.log("Fetching all relevant trainings...");
    const trainings = await getRelevantTrainings();
    return res.status(200).json(trainings);
  } catch (error) {
    console.error(error.message);
    return res.status(500).send({ message: error.message });
  }
});

// Route for Get a specific employee training by ID
router.get("/:id", async (req, res) => {
    try {
      console.log(`Fetching relevant training by ID: ${req.params.id}`);
      const relevantTrainings = await getRelevantTrainingsById(req.params.id);
      if (relevantTrainings) {
        return res.status(200).json(relevantTrainings);
      } else {
        return res.status(404).send({ message: "Relevant training not found" });
      }
    } catch (error) {
      console.error(error.message);
      return res.status(500).send({ message: error.message });
    }
  });

// Route for Get Relevant Trainings by Employee ID
router.get("/employee/:employee_id", async (req, res) => {
  try {
    const trainings = await getRelevantTrainingsByEmployeeId(req.params.employee_id);
    if (trainings.length > 0) {
      return res.status(200).json(trainings);
    } else {
      return res.status(404).send({ message: "Relevant trainings not found" });
    }
  } catch (error) {
    console.error(error.message);
    return res.status(500).send({ message: error.message });
  }
});

// Route for Get Relevant Trainings by Training ID
router.get("/training/:training_id", async (req, res) => {
    try {
      const trainings = await getRelevantTrainingsByTrainingId(req.params.training_id);
      if (trainings.length > 0) {
        return res.status(200).json(trainings);
      } else {
        return res.status(404).send({ message: "Relevant trainings not found" });
      }
    } catch (error) {
      console.error(error.message);
      return res.status(500).send({ message: error.message });
    }
  });

// Route for adding a new Relevant Training
router.post("/", async (req, res) => {
  try {
    const { employee_id, training_id, validity } = req.body;
    if (!employee_id || !training_id || !validity) {
      return res.status(400).send({
        message: "Send all required fields: employee_id, training_id, validity",
      });
    }
    const newTraining = await createRelevantTraining(employee_id, training_id, validity);
    return res.status(201).json(newTraining);
  } catch (error) {
    console.error(error.message);
    if (error.message.includes("already exists")) {
      return res.status(409).send({ message: error.message });
    }
    return res.status(500).send({ message: error.message });
  }
});

// Route for Deleting a Relevant Training
router.delete("/:employee_id/:training_id", async (req, res) => {
  try {
    const { employee_id, training_id } = req.params;
    const message = await deleteRelevantTraining(employee_id, training_id);
    return res.status(200).send({ message });
  } catch (error) {
    console.error(error.message);
    return res.status(500).send({ message: error.message });
  }
});

// Route for Updating a Relevant Training
router.put("/:employee_id/:training_id", async (req, res) => {
  try {
    const { employee_id, training_id } = req.params;
    const { validity } = req.body;
    if (!validity) {
      return res.status(400).send({
        message: "Send all required fields: validity",
      });
    }
    const updatedTraining = await updateRelevantTraining(employee_id, training_id, validity);
    if (updatedTraining) {
      return res.status(200).json(updatedTraining);
    } else {
      return res.status(404).send({ message: "Relevant training not found" });
    }
  } catch (error) {
    console.error(error.message);
    if (error.message.includes("does not exist")) {
      return res.status(404).send({ message: error.message });
    }
    return res.status(500).send({ message: error.message });
  }
});

export default router;
