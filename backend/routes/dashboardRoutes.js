import express from "express";
import { getEmployeeDetails, getRelevantCourses, getTrainingDates} from "../database/dashboardDatabase.js";

const router = express.Router();

// Returns a massive json file containing all the entries of the employees

router.get("/", async (req, res) => {
  const [employeeDetails, relevantTrainings, trainingDates] = await Promise.all([
    getEmployeeDetails(),
    getRelevantCourses(),
    getTrainingDates()
  ]);

  // const combined = employeeDetails.map((employee) => {

  //   const employeeTrainings = relevantTrainings.filter(training => training.employee_id === employee.employee_id);

  //   employee.relevantTrainings = employeeTrainings.map(training => ({
  //     validity: training.validity,
  //     title: training.title
  //   }));

  //   const relevantDates = trainingDates.filter(training => training.employee_id === employee.employee_id);

  //   employee.relevantTrainings = relevantDates.map(training => {
  //     const relevantTraining = employee.relevantTrainings.find(relevantTraining => relevantTraining.title === training.title);
  //     return {
  //       ...relevantTraining,
  //       latest_end_date: training.latest_end_date,
  //       expiry_date: training.expiry_date,
  //       scheduled_date: training.scheduled_date
  //     }
  //   })

  //   return employee;
  // })

  const combined = employeeDetails.map((employee) => {
    const employeeTrainings = relevantTrainings.filter(training => training.employee_id === employee.employee_id);
  
    const relevantDates = trainingDates.filter(training => training.employee_id === employee.employee_id);
  
    employee.relevantTrainings = employeeTrainings.map(training => {
      const matchingDate = relevantDates.find(date => date.title === training.title);
      return {
        validity: training.validity,
        title: training.title,
        latest_end_date: matchingDate ? matchingDate.latest_end_date : null,
        expiry_date: matchingDate ? matchingDate.expiry_date : null,
        scheduled_date: matchingDate ? matchingDate.scheduled_date : null
      }
    })
  
    return employee;
  });

  return res.status(200).send(combined);


  // return res.status(200).json({ employeeDetails, relevantTrainings, trainingDates });
});

router.get("/employeeDetails", async (req, res) => {
  try {
    const details = await getEmployeeDetails();
    return res.status(200).json(details);
  } catch (error) {
    console.error(error.message);
    return res.status(500).send({ message: error.message });
  }
});

router.get("/relevantTrainings", async (req, res) => {
  try {
    const details = await getRelevantCourses();
    return res.status(200).json(details);
  } catch (error) {
    console.error(error.message);
    return res.status(500).send({ message: error.message });
  }
})

router.get("/trainingDates", async (req, res) => {
  try {
    const details = await getTrainingDates();
    return res.status(200).json(details);
  } catch (error) {
    console.error(error.message);
    return res.status(500).send({ message: error.message });
  }
})

export default router;
