import express from "express";
import trainingRoutes from "./trainingRoutes.js";
import employeeRoutes from "./employeeRoutes.js";
import departmentRoutes from "./departmentRoutes.js";
import jobsRoutes from "./jobRoutes.js";
import skillsReportRoutes from "./skillsReportRoutes.js";
import emailRoutes from "./emailRoutes.js";

const router = express.Router();

router.use("/trainings", trainingRoutes);
router.use("/employees", employeeRoutes);
router.use("/departments", departmentRoutes);
router.use("/jobs", jobsRoutes);
router.use("/skillsReport", skillsReportRoutes);
router.use("/send-email", emailRoutes);

export default router;
