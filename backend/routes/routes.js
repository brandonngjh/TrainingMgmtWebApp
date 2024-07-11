import express from "express";
import loginRoutes from "./loginRoutes.js";
import dashboardRoutes from "./dashboardRoutes.js";
import trainingRoutes from "./trainingRoutes.js";
import employeeRoutes from "./employeeRoutes.js";

const router = express.Router();

router.use("/login", loginRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/trainings", trainingRoutes);
router.use("/employees", employeeRoutes);

export default router;
