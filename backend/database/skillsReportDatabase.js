import pool from "./database.js";

// Get all skills report
export async function getSkillsReport() {
  const [rows] = await pool.query("SELECT * FROM skills_report");
  return rows;
}

// Get filtered skills report
export async function getFilteredSkillsReport({ job, training, validity }) {
  let query = 'SELECT * FROM skills_report WHERE 1=1';
  const queryParams = [];

  if (job) {
    query += ' AND job_name = ?';
    queryParams.push(job);
  }
  if (training) {
    query += ' AND training_course = ?';
    queryParams.push(training);
  }
  if (validity) {
    query += ' AND validity = ?';
    queryParams.push(validity);
  }

  const [rows] = await pool.query(query, queryParams);
  return rows;
}