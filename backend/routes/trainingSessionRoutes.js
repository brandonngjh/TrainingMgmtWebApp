import express from "express";
import { getTrainingSessions, createTrainingSession } from "../database/trainingSessionDatabase.js";
import { protect } from '../middleware/middleware.js'; //add this
const router = express.Router();    

router.use(protect);    //add this

router.get("/", async (req, res) => {
    const trainingSessions = await getTrainingSessions();
    return res.status(200).send(trainingSessions);
})

router.post("/", async(req, res) => {
    try {
        const { employee_ids, training_id, status, start_date, end_date } = req.body;
        if (!employee_ids || !training_id || !status || !start_date || !end_date) {
          return res.status(400).send({
            message: "Send required fields: employee_ids, training_id, status, start_date, end_date",
          });
        }

        const trainingSessions = [];
        for (const employee_id of employee_ids) {
          const newTraining = await createTrainingSession(
            employee_id,
            training_id,
            status,
            start_date,
            end_date
          );
          trainingSessions.push(newTraining);
        }

        // const newTraining = await createTrainingSession(
        //     employee_id,
        //     training_id,
        //     status,
        //     start_date,
        //     end_date,
        // );
        return res.status(201).json(trainingSessions);
      } catch (error) {
        console.error(error.message);
        return res.status(500).send({ message: error.message });
    }
})

export default router;