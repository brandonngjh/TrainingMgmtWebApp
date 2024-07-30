import express from "express";
import { getAllTrainingSessions, getTrainingSession, createTrainingSession, deleteTrainingSession } from "../database/trainingSessionDatabase.js";
import { protect } from '../middleware/middleware.js'; //add this
const router = express.Router();    

router.use(protect);    //add this

router.get("/", async (req, res) => {
    const trainingSessionsDict = await getAllTrainingSessions();
    return res.status(200).send(trainingSessionsDict);
})

router.get("/:session_id", async (req, res) => {
    const trainingSession = await getTrainingSession(req.params.session_id);
    return res.status(200).send(trainingSession);
})

router.post("/", async(req, res) => {
    try {
        const { employee_ids, training_id, status, start_date, end_date } = req.body;
        if (!employee_ids || !training_id || !status || !start_date || !end_date) {
          return res.status(400).send({
            message: "Send required fields: employee_ids, training_id, status, start_date, end_date",
          });
        }

        const trainingSession = await createTrainingSession(
          employee_ids,
          training_id,
          status,
          start_date,
          end_date
        );
        return res.status(201).send({ message: "Training session created successfully" });
        // return res.status(201).json(trainingSession);
      } catch (error) {
        console.error(error.message);
        return res.status(500).send({ message: error.message });
    }
})

router.delete("/:session_id", async (req, res) => {
    try {
        const session_id = req.params.session_id;
        if (!session_id) {
          return res.status(400).send({ message: "Send session_id in the params" });
        }
    
        const deletedTrainingSession = await deleteTrainingSession(session_id);
        return res.status(200).json(deletedTrainingSession);
      } catch (error) {
        console.error(error.message);
        return res.status(500).send({ message: error.message });
      }
})

export default router;