import express from 'express';
import { 
    getSkillsReport, 
    getFilteredSkillsReport 
} from '../database/skillsReportDatabase.js';

const router = express.Router();

// GET all skills report
router.get("/", async (req, res) => {
  try {
    const skillsReport = await getSkillsReport();
    res.json(skillsReport);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: error.message });
  }
});

// GET filtered skills report
router.get('/filter', async (req, res) => {
  try {
    const { job, training, validity } = req.query;
    const filteredSkillsReport = await getFilteredSkillsReport({ job, training, validity });
    res.json(filteredSkillsReport);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: error.message});
  }
});

export default router;