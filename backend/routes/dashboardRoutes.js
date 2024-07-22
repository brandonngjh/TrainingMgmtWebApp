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
});


router.get("/percentage", async (req, res) => {
  const [employeeDetails, relevantTrainings] = await Promise.all([
    getEmployeeDetails(),
    getRelevantCourses()
  ]);

  const combined = employeeDetails.map((employee) => {
    const employeeTrainings = relevantTrainings.filter(training => training.employee_id === employee.employee_id);

    employee.relevantTrainings = employeeTrainings.length > 0 ? employeeTrainings.map(training => ({
      validity: training.validity,
      title: training.title
    })) : [{ validity: null, title: null }];

    return employee;
  });

  const totalEmployees = combined.length;
  const validEmployees = combined.filter(employee =>
    employee.relevantTrainings.every(training => training.validity === "valid")
  ).length;

  const percentageValidEmployees = (validEmployees / totalEmployees) * 100;

  return res.status(200).send({
    percentageValidEmployees: percentageValidEmployees.toFixed(2)
  });
});



router.get("/numbers", async (req, res) => {
  const [relevantTrainings] = await Promise.all([
    getRelevantCourses(),
  ]);

  const trainingStats = relevantTrainings.reduce((acc, training) => {
    if (!acc[training.title]) {
      acc[training.title] = { valid: 0, total: 0 };
    }
    acc[training.title].total += 1;
    if (training.validity === "valid") {
      acc[training.title].valid += 1;
    }
    return acc;
  }, {});

  const trainingStatsJson = Object.keys(trainingStats).reduce((result, title) => {
    result[title] = {
      numberOfEmployeesWithValid: trainingStats[title].valid.toString(),
      numberOfEmployeesWithTraining: trainingStats[title].total.toString()
    };
    return result;
  }, {});

  res.status(200).json(trainingStatsJson);
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