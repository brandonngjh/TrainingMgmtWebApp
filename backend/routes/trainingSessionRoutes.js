import express from "express";
import { getTrainingSessions, createTrainingSession } from "../database/trainingSessionDatabase.js";
import { protect } from '../middleware/middleware.js'; //add this
const router = express.Router();    

router.use(protect);    //add this

router.get("/", async (req, res) => {
    const all = await getTrainingSessions();
    const trainingSessionsDict = {};
    
    all.forEach(session => {
      // if trianingSessionsDict does not have the session id, create populate the trainingsessiondict with the details of the session
      if (!trainingSessionsDict[session.session_id]) {
        trainingSessionsDict[session.session_id] = {
          session_id: session.session_id,
          start_date: session.start_date,
          end_date: session.end_date,
          expiry_date: session.expiry_date,
          training_title: session.training_title,
          training_id: session.training_id,
          employees: [
            {
              employee_id: session.employee_id,
              employee_name: session.employee_name,
              designation: session.designation,
              status: session.status,
            }
          ]
        };
      }
      // just add the employee details to the employees attribute of the session
      else {
        trainingSessionsDict[session.session_id].employees.push({
          employee_id: session.employee_id,
          employee_name: session.employee_name,
          designation: session.designation,
          status: session.status,
        });
      }
    });

    return res.status(200).send(trainingSessionsDict);
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