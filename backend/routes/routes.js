import express from "express";
import trainingRoutes from "./trainingRoutes.js";
import employeeRoutes from "./employeeRoutes.js";
import departmentRoutes from "./departmentRoutes.js";
import jobsRoutes from "./jobRoutes.js";
import employeesTrainingsRoutes from "./employeesTrainingsRoutes.js";
import skillsReportRoutes from "./skillsReportRoutes.js"
import relevantTrainings from "./relevantTrainingsRoutes.js"

const router = express.Router();

router.use("/trainings", trainingRoutes);
router.use("/employees", employeeRoutes);
router.use("/departments", departmentRoutes);
router.use("/jobs", jobsRoutes);
router.use("/employeesTrainings", employeesTrainingsRoutes);
router.use("/skillsReport", skillsReportRoutes);
router.use("/relevantTrainings", relevantTrainings)

export default router;
