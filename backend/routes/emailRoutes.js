import express from "express";
import { sendEmail } from "../jobs/emailScheduler.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    await sendEmail();
    res.status(200).send("Email sent successfully");
  } catch (error) {
    res.status(500).send("Failed to send email");
  }
});

export default router;