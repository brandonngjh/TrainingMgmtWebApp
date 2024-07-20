import express from "express";
import trainingRoutes from "./trainingRoutes.js";
import employeeRoutes from "./employeeRoutes.js";
import departmentRoutes from "./departmentRoutes.js";
import jobsRoutes from "./jobRoutes.js";
import skillsReportRoutes from "./skillsReportRoutes.js"
import { protect } from '../middleware/middleware.js';

const router = express.Router();

router.use((req, res, next) => {
    console.log(`MainRoutes accessed: ${req.originalUrl}`); // Log access to mainRoutes
    next();
});

router.use("/login", loginRoutes);
router.use("/trainings", trainingRoutes, protect);
router.use("/employees", employeeRoutes, protect);
router.use("/departments", departmentRoutes, protect);
router.use("/jobs", jobsRoutes, protect);
router.use("/skillsReport", skillsReportRoutes, protect);


export default router;
