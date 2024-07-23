import express from "express";
import trainingRoutes from "./trainingRoutes.js";
import employeeRoutes from "./employeeRoutes.js";
import departmentRoutes from "./departmentRoutes.js";
import jobsRoutes from "./jobRoutes.js";
import employeesTrainingsRoutes from "./employeesTrainingsRoutes.js";
import skillsReportRoutes from "./skillsReportRoutes.js"
import { protect } from '../middleware/middleware.js';
import loginRoutes from "./loginRoutes.js";
import dashboardRoutes from "./dashboardRoutes.js";
import relevantTrainings from "./relevantTrainingsRoutes.js"

const router = express.Router();

router.use((req, res, next) => {
    console.log(`MainRoutes accessed: ${req.originalUrl}`); // Log access to mainRoutes
    next();
});

router.use("/login", loginRoutes);
router.use("/trainings", trainingRoutes);
router.use("/employees", employeeRoutes);
router.use("/departments", departmentRoutes);
router.use("/jobs", jobsRoutes);
router.use("/employeesTrainings", employeesTrainingsRoutes, protect);
router.use("/skillsReport", skillsReportRoutes);
router.use("/dashboard", dashboardRoutes)
router.use("/relevantTrainings", relevantTrainings)

export default router;
